/**
 * src/hooks/useSTM32Telemetry.js
 * ----------------------------------------------------------------------------
 * Single source of truth for all sensor + actuator state.
 *
 * FUTURE HARDWARE HANDOFF
 * This is the ONLY file that needs to change when the real STM32 + ESP8266
 * hardware comes online. Replace the internal useState/setters with a
 * WebSocket subscription, e.g.:
 *
 *   useEffect(() => {
 *     const ws = new WebSocket("ws://<esp8266-ip>/telemetry");
 *     ws.onmessage = (evt) => setSensors(JSON.parse(evt.data));
 *     return () => ws.close();
 *   }, []);
 *
 * or a polling fetch("http://<esp8266-ip>/api/sensors"). Keep the exact
 * same return shape — { sensors, automation, appliances, fallEvent,
 * alertAcknowledged, occupantStatus, actions } — documented in
 * src/types/telemetry.ts, and every consuming component keeps working
 * unchanged.
 * ========================================================================== */
import { useState, useMemo } from "react";

/** @returns {import("../types/telemetry").TelemetryContextValue} */
export function useSTM32Telemetry() {
  const [sensors, setSensors] = useState({
    pir: false, // occupancy: true = motion detected
    lux: 420, // LDR ambient light, 0-1000
    tempC: 26, // DHT ambient temperature, 15-45
    gasLeak: false, // MQ-2 gas/smoke
    flame: false, // IR flame sensor
    waterLeak: false, // water leakage probe
  });

  const [fallEvent, setFallEvent] = useState(null); // { timestamp, lat, lng } | null
  const [alertAcknowledged, setAlertAcknowledged] = useState(false);

  // Manual overrides the caretaker can toggle when automation isn't forcing a state
  const [manual, setManual] = useState({ light: false, fan: false });

  const set = (key) => (value) => setSensors((s) => ({ ...s, [key]: value }));

  const triggerFall = () => {
    setFallEvent({
      timestamp: new Date(),
      lat: (12.9716 + (Math.random() - 0.5) * 0.002).toFixed(6),
      lng: (77.5946 + (Math.random() - 0.5) * 0.002).toFixed(6),
    });
    setAlertAcknowledged(false);
  };

  const acknowledgeAlert = () => setAlertAcknowledged(true);
  const clearSiren = () => {
    setFallEvent(null);
    setAlertAcknowledged(false);
  };

  // Context-aware automation rules — the "brain" the STM32 firmware will run
  const automation = useMemo(() => {
    const fanForced = sensors.tempC > 30;
    const lightAuto = sensors.pir && sensors.lux < 200;
    const exhaustForced = sensors.gasLeak || sensors.flame;
    const pumpShutoff = sensors.waterLeak;
    return { fanForced, lightAuto, exhaustForced, pumpShutoff };
  }, [sensors]);

  const appliances = useMemo(
    () => ({
      light: { on: manual.light || automation.lightAuto, auto: automation.lightAuto },
      fan: { on: manual.fan || automation.fanForced, auto: automation.fanForced },
      exhaust: { on: automation.exhaustForced, auto: automation.exhaustForced },
      pump: { on: !automation.pumpShutoff, auto: automation.pumpShutoff },
    }),
    [manual, automation]
  );

  const occupantStatus = fallEvent
    ? alertAcknowledged
      ? "ACKNOWLEDGED"
      : "CRITICAL"
    : sensors.pir
    ? "MOVEMENT"
    : "NORMAL";

  const setManualLight = (v) => setManual((m) => ({ ...m, light: v }));
  const setManualFan = (v) => setManual((m) => ({ ...m, fan: v }));

  return {
    sensors,
    automation,
    appliances,
    fallEvent,
    alertAcknowledged,
    occupantStatus,
    actions: {
      setPir: set("pir"),
      setLux: set("lux"),
      setTempC: set("tempC"),
      setGasLeak: set("gasLeak"),
      setFlame: set("flame"),
      setWaterLeak: set("waterLeak"),
      setManualLight,
      setManualFan,
      triggerFall,
      acknowledgeAlert,
      clearSiren,
    },
  };
}
