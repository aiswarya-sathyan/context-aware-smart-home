import React, { useState } from "react";
import { Card, ActionButton } from "./ui/Primitives";

export default function SimulatorWorkbench({
  telemetry,
  onInject,
  onClose,
}) {
  const [simLight, setSimLight] = useState(telemetry.light || 50);

  return (
    <Card className="border-amber-500/40 bg-slate-900/95">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-amber-400">
            Hardware Telemetry Simulator
          </h3>
          <p className="text-xs text-slate-400">
            Simulate STM32 UART packets directly in Firebase RTDB
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white px-2 py-1"
        >
          Close ✕
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <ActionButton
          active={telemetry.motion}
          onClick={() => onInject({ motion: !telemetry.motion })}
        >
          Toggle Motion ({telemetry.motion ? "1" : "0"})
        </ActionButton>

        <ActionButton
          active={telemetry.led}
          onClick={() => onInject({ led: !telemetry.led })}
        >
          Toggle LED ({telemetry.led ? "1" : "0"})
        </ActionButton>

        <div className="flex flex-col gap-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Simulated Light:</span>
            <span className="text-white font-semibold">{simLight}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={simLight}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSimLight(val);
              onInject({ light: val });
            }}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>
    </Card>
  );
}