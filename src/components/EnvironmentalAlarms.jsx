/**
 * src/components/EnvironmentalAlarms.jsx
 * ----------------------------------------------------------------------------
 * Read-only presentation strip showing gas/flame/water alarm state plus
 * the current temperature, light, and occupancy readings — lets the
 * audience see sensor values change live as the workbench is driven.
 * ========================================================================== */
import React from "react";
import { Wind, Flame, Droplets, ShieldAlert } from "lucide-react";
import { Panel } from "./ui/Primitives.jsx";

function AlarmChip({ active, label, Icon }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium ${
        active ? "border-red-500/40 bg-red-500/10 text-red-300" : "border-slate-800 bg-slate-950 text-slate-500"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}: {active ? "Detected" : "Safe"}
    </div>
  );
}

export default function EnvironmentalAlarms({ sensors }) {
  return (
    <Panel title="Environmental alarms" icon={<ShieldAlert className="h-4 w-4 text-slate-400" />}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <AlarmChip active={sensors.gasLeak} label="Gas / smoke" Icon={Wind} />
        <AlarmChip active={sensors.flame} label="Flame" Icon={Flame} />
        <AlarmChip active={sensors.waterLeak} label="Water leak" Icon={Droplets} />
      </div>
      <div className="mt-4 space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-500">
        <div className="flex items-center justify-between">
          <span>Ambient temperature</span>
          <span className="font-mono text-slate-300">{sensors.tempC}°C</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Ambient light</span>
          <span className="font-mono text-slate-300">{sensors.lux} lux</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Occupancy (PIR)</span>
          <span className="font-mono text-slate-300">{sensors.pir ? "Motion" : "Idle"}</span>
        </div>
      </div>
    </Panel>
  );
}
