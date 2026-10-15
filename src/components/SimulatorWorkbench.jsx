/**
 * src/components/SimulatorWorkbench.jsx
 * ----------------------------------------------------------------------------
 * "STM32 Hardware Control & Sensor Simulator" — collapsible drawer used to
 * test, trigger, and demonstrate every context-aware behavior live during
 * presentations, before the real STM32 + ESP8266 hardware is wired in.
 * ========================================================================== */
import React from "react";
import {
  Radio,
  ChevronDown,
  ChevronUp,
  PersonStanding,
  Sun,
  Thermometer,
  Wind,
  Flame,
  Droplets,
  OctagonAlert,
  Eye,
} from "lucide-react";
import { LedDot } from "./ui/Primitives.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function SliderRow({ icon, label, value, min, max, unit, onChange, accent }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="py-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          {icon}
          {label}
        </div>
        <span className="font-mono text-sm text-slate-200">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-700"
        style={{ background: `linear-gradient(to right, ${accent} ${pct}%, #334155 ${pct}%)` }}
      />
    </div>
  );
}

function ToggleRow({ icon, label, on, onChange, onLabel = "Detected", offLabel = "Safe/Idle" }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2 text-sm text-slate-300">
        {icon}
        {label}
      </div>
      <button
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold transition ${
          on ? "border-red-500/40 bg-red-500/10 text-red-300" : "border-slate-700 bg-slate-950 text-slate-400"
        }`}
      >
        <LedDot color={on ? "#ef4444" : "#475569"} />
        {on ? onLabel : offLabel}
      </button>
    </div>
  );
}

export default function SimulatorWorkbench({ telemetry, open, setOpen }) {
  const { sensors, actions } = telemetry;
  const { isGuest } = useAuth();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-t-lg border border-b-0 border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
        >
          <span className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-cyan-400" />
            STM32 Hardware Control &amp; Sensor Simulator
          </span>
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>

        {open && (
          <div className="max-h-[65vh] overflow-y-auto rounded-t-none border border-t-0 border-slate-700 bg-slate-950 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] sm:p-5">
            {isGuest && (
              <p className="mb-3 flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400">
                <Eye className="h-3.5 w-3.5" /> Guest mode is view-only — switch to Caretaker to drive the simulator.
              </p>
            )}
            <fieldset disabled={isGuest} className="grid grid-cols-1 gap-x-8 gap-y-1 disabled:opacity-50 md:grid-cols-2">
              <div className="divide-y divide-slate-800/70">
                <ToggleRow
                  icon={<PersonStanding className="h-4 w-4 text-slate-500" />}
                  label="PIR occupancy sensor"
                  on={sensors.pir}
                  onChange={actions.setPir}
                  onLabel="Motion"
                  offLabel="Idle"
                />
                <SliderRow
                  icon={<Sun className="h-4 w-4 text-slate-500" />}
                  label="LDR ambient light"
                  value={sensors.lux}
                  min={0}
                  max={1000}
                  unit=" lux"
                  onChange={actions.setLux}
                  accent="#22d3ee"
                />
                <SliderRow
                  icon={<Thermometer className="h-4 w-4 text-slate-500" />}
                  label="DHT ambient temperature"
                  value={sensors.tempC}
                  min={15}
                  max={45}
                  unit="°C"
                  onChange={actions.setTempC}
                  accent="#f59e0b"
                />
              </div>

              <div className="divide-y divide-slate-800/70">
                <ToggleRow
                  icon={<Wind className="h-4 w-4 text-slate-500" />}
                  label="Gas / smoke sensor"
                  on={sensors.gasLeak}
                  onChange={actions.setGasLeak}
                  onLabel="Leak"
                />
                <ToggleRow
                  icon={<Flame className="h-4 w-4 text-slate-500" />}
                  label="Flame sensor"
                  on={sensors.flame}
                  onChange={actions.setFlame}
                  onLabel="Fire"
                />
                <ToggleRow
                  icon={<Droplets className="h-4 w-4 text-slate-500" />}
                  label="Water leakage sensor"
                  on={sensors.waterLeak}
                  onChange={actions.setWaterLeak}
                  onLabel="Leak"
                />
              </div>
            </fieldset>

            <div className="mt-4 border-t border-slate-800 pt-4">
              <button
                disabled={isGuest}
                onClick={actions.triggerFall}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-red-600 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/60 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <OctagonAlert className="h-4.5 w-4.5" />
                SIMULATE ELDERLY FALL EVENT
              </button>
              <p className="mt-2 text-center text-[11px] text-slate-600">
                Fires a synthetic accelerometer + gyroscope fall signature for live demo purposes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
