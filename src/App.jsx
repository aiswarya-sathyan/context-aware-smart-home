import React, { useState } from "react";
import Header from "./components/Header";
import VoiceAssistantModule from "./components/VoiceAssistantModule";
import ApplianceControl from "./components/ApplianceControl";
import EnvironmentalAlarms from "./components/EnvironmentalAlarms";
import SimulatorWorkbench from "./components/SimulatorWorkbench";
import { useSTM32Telemetry } from "./hooks/useSTM32Telemetry";

export default function App() {
  const {
    telemetry,
    connected,
    lastSync,
    setLedState,
    setControlMode,
    injectSimulatedTelemetry,
  } = useSTM32Telemetry();

  const [showSimulator, setShowSimulator] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Header
        connected={connected}
        lastSync={lastSync}
        mode={telemetry.mode}
        onOpenSim={() => setShowSimulator((prev) => !prev)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {showSimulator && (
          <SimulatorWorkbench
            telemetry={telemetry}
            onInject={injectSimulatedTelemetry}
            onClose={() => setShowSimulator(false)}
          />
        )}

        {/* Primary Voice Control Section */}
        <VoiceAssistantModule
          telemetry={telemetry}
          onSetLed={setLedState}
          onSetMode={setControlMode}
        />

        {/* Responsive 2-Column Hardware Grid for Desktop, Stacked for Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnvironmentalAlarms telemetry={telemetry} />
          <ApplianceControl
            telemetry={telemetry}
            onSetLed={setLedState}
            onSetMode={setControlMode}
          />
        </div>
      </main>

      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        Context-Aware Smart Home • STM32 & ESP32-C3 Super Mini Telemetry Node
      </footer>
    </div>
  );
}