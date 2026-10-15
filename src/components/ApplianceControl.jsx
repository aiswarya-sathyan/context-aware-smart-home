/**
 * src/components/ApplianceControl.jsx
 * ----------------------------------------------------------------------------
 * Cards and toggles for Lights, Fans, and Exhaust/Pumps, with amber
 * "Auto" badges explaining which context rule is currently driving an
 * appliance (e.g. "Fan forced ON: Temp > 30°C").
 * ========================================================================== */
import React from "react";
import { Lightbulb, Fan, Wind, Droplets, Power, ShieldAlert } from "lucide-react";
import { Panel, AutoBadge, LedDot } from "./ui/Primitives.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function ApplianceRow({ icon, label, on, auto, autoText, disabled, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-800/70 py-3 last:border-b-0">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-md ring-1 ${
            on ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30" : "bg-slate-800 text-slate-500 ring-slate-700"
          }`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">{label}</p>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
            <LedDot color={on ? "#10b981" : "#475569"} />
            {on ? "Running" : "Idle"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {auto && <AutoBadge>{autoText}</AutoBadge>}
       <button
  role="switch"
  aria-checked={on}
  disabled={disabled || auto}
  onClick={() => onToggle(!on)}
  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 ${
    on ? "bg-cyan-600" : "bg-slate-700"
  }`}
  title={auto ? "Under automatic control" : "Manual toggle"}
>
  <span
    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
      on ? "translate-x-5" : "translate-x-0"
    }`}
  />
</button>
      </div>
    </div>
  );
}

export default function ApplianceControl({ telemetry, sosLocked }) {
  const { appliances, actions } = telemetry;
  const { isGuest } = useAuth();
  const locked = isGuest || sosLocked;

  return (
    <Panel title="Appliance Control" icon={<Power className="h-4 w-4 text-slate-400" />}>
      <ApplianceRow
        icon={<Lightbulb className="h-4.5 w-4.5" />}
        label="Living room light"
        on={appliances.light.on}
        auto={appliances.light.auto}
        autoText="Auto: PIR motion + lux < 200"
        disabled={locked}
        onToggle={actions.setManualLight}
      />
      <ApplianceRow
        icon={<Fan className="h-4.5 w-4.5" />}
        label="Ceiling fan"
        on={appliances.fan.on}
        auto={appliances.fan.auto}
        autoText="Auto: forced ON, temp > 30°C"
        disabled={locked}
        onToggle={actions.setManualFan}
      />
      <ApplianceRow
        icon={<Wind className="h-4.5 w-4.5" />}
        label="Exhaust fan"
        on={appliances.exhaust.on}
        auto={appliances.exhaust.auto}
        autoText="Auto: gas / flame alarm"
        disabled={true}
        onToggle={() => {}}
      />
      <ApplianceRow
        icon={<Droplets className="h-4.5 w-4.5" />}
        label="Water pump"
        on={appliances.pump.on}
        auto={appliances.pump.auto}
        autoText="Auto: shut off, leak detected"
        disabled={true}
        onToggle={() => {}}
      />
      {sosLocked && (
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-red-400">
          <ShieldAlert className="h-3.5 w-3.5" /> Manual control suspended — emergency override active.
        </p>
      )}
    </Panel>
  );
}
