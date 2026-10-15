/**
 * src/App.jsx
 * ----------------------------------------------------------------------------
 * Main entry point. Wires together the AuthProvider (RBAC + PIN gate), the
 * useSTM32Telemetry hook (single source of sensor/appliance truth), and the
 * feature modules: Header, FallDetectionModule, ApplianceControl,
 * EnvironmentalAlarms, VoiceAssistantModule, and SimulatorWorkbench.
 * ========================================================================== */
import React, { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext.jsx";
import { useSTM32Telemetry } from "./hooks/useSTM32Telemetry.js";
import Header from "./components/Header.jsx";
import FallDetectionModule from "./components/FallDetectionModule.jsx";
import ApplianceControl from "./components/ApplianceControl.jsx";
import EnvironmentalAlarms from "./components/EnvironmentalAlarms.jsx";
import VoiceAssistantModule from "./components/VoiceAssistantModule.jsx";
import SimulatorWorkbench from "./components/SimulatorWorkbench.jsx";
import { db } from "./firebase.jsx"; // Ensure this matches your file extension
import { ref, set, onValue } from "firebase/database";

// Write Test Function
const testFirebaseWrite = () => {
  set(ref(db, "test/status"), `Connected successfully at ${new Date().toLocaleTimeString()}`)
    .then(() => alert("✅ Firebase write successful! Check Realtime Database console."))
    .catch((error) => console.error("❌ Firebase write failed:", error));
};

function Dashboard() {
  const telemetry = useSTM32Telemetry();
  const [connected] = useState(true);
  const [sosLocked, setSosLocked] = useState(false);
  const [workbenchOpen, setWorkbenchOpen] = useState(true);
  const [fbTestData, setFbTestData] = useState("Waiting for Firebase...");

  // Real-time Firebase Read Test Listener
  useEffect(() => {
    const testRef = ref(db, "test/status");
    const unsubscribe = onValue(
      testRef,
      (snapshot) => {
        const val = snapshot.val();
        if (val) {
          setFbTestData(val);
        } else {
          setFbTestData("No data at 'test/status' path yet.");
        }
      },
      (error) => {
        console.error("Firebase read error:", error);
        setFbTestData(`Error reading: ${error.message}`);
      }
    );

    return () => unsubscribe();
  }, []);

  // SOS override forces manual appliances off while engaged
  useEffect(() => {
    if (sosLocked) {
      telemetry.actions.setManualLight(false);
      telemetry.actions.setManualFan(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sosLocked]);

  return (
    <div className="min-h-screen bg-slate-950 pb-64 font-sans text-slate-100 antialiased">
      <Header connected={connected} sosLocked={sosLocked} onToggleSos={() => setSosLocked((s) => !s)} />

      <main className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6">
        {/* Firebase Live Test Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg backdrop-blur">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Firebase Connection Test</div>
            <div className="text-sm font-medium text-emerald-400">{fbTestData}</div>
          </div>
          <button
            onClick={testFirebaseWrite}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition-colors"
          >
            Send Test Pulse to Firebase
          </button>
        </div>

        <FallDetectionModule telemetry={telemetry} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <ApplianceControl telemetry={telemetry} sosLocked={sosLocked} />
            <VoiceAssistantModule telemetry={telemetry} />
          </div>
          <div>
            <EnvironmentalAlarms sensors={telemetry.sensors} />
          </div>
        </div>
      </main>

      <SimulatorWorkbench telemetry={telemetry} open={workbenchOpen} setOpen={setWorkbenchOpen} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}