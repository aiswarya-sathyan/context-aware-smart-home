import { useState, useEffect, useCallback } from "react";
import { db, ref, onValue, update, set } from "../firebase";

export function useSTM32Telemetry() {
  const [telemetry, setTelemetry] = useState({
    motion: false,
    light: 0,
    led: false,
    mode: "AUTO",
  });
  const [connected, setConnected] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  // 1. Real-time Firebase Listener
  useEffect(() => {
    const sensorRef = ref(db, "sensor");
    console.log("[RTDB] Subscribing to 'sensor' path...");

    const unsubscribe = onValue(
      sensorRef,
      (snapshot) => {
        setConnected(true);
        setLastSync(new Date().toLocaleTimeString());
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log("[RTDB Stream Received]", data);
          setTelemetry({
            motion: Boolean(data.motion),
            light: Number(data.light ?? 0),
            led: Boolean(data.led),
            mode: data.mode || "MANUAL",
          });
        } else {
          console.warn("[RTDB] '/sensor' node does not exist yet. Initializing...");
          // Initialize empty node
          set(sensorRef, {
            motion: false,
            light: 0,
            led: false,
            mode: "MANUAL",
          });
        }
      },
      (error) => {
        console.error("[RTDB Error]", error);
        setConnected(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Control LED
  const setLedState = useCallback(async (newState) => {
    console.log("[Action] Toggling LED to:", newState);
    try {
      const sensorRef = ref(db, "sensor");
      await update(sensorRef, {
        led: Boolean(newState),
        mode: "MANUAL",
      });
      console.log("[Action] Firebase update succeeded!");
    } catch (err) {
      console.error("[Action] Failed to update LED:", err);
    }
  }, []);

  // 3. Control Mode
  const setControlMode = useCallback(async (newMode) => {
    console.log("[Action] Setting Mode to:", newMode);
    try {
      const sensorRef = ref(db, "sensor");
      await update(sensorRef, {
        mode: newMode,
      });
      console.log("[Action] Mode updated successfully!");
    } catch (err) {
      console.error("[Action] Failed to update Mode:", err);
    }
  }, []);

  // 4. Inject Simulated Telemetry
  const injectSimulatedTelemetry = useCallback(async (payload) => {
    try {
      const sensorRef = ref(db, "sensor");
      await update(sensorRef, payload);
    } catch (err) {
      console.error("[Simulator] Injection failed:", err);
    }
  }, []);

  return {
    telemetry,
    connected,
    lastSync,
    setLedState,
    setControlMode,
    injectSimulatedTelemetry,
  };
}