import React from "react";
import { Card, Badge, ActionButton } from "./ui/Primitives";

export default function ApplianceControl({
  telemetry,
  onSetLed,
  onSetMode,
}) {
  const { led, mode } = telemetry;

  return (
    <Card className="flex flex-col justify-between gap-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-white">
            STM32 Actuator Control
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Direct relay / LED switching & context automation mode
          </p>
        </div>
        <Badge variant={led ? "success" : "neutral"}>
          {led ? "LED ACTIVE" : "LED OFF"}
        </Badge>
      </div>

      {/* Main Lighting Card */}
      <div
        className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
          led
            ? "bg-amber-500/10 border-amber-500/40"
            : "bg-slate-950/60 border-slate-800"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition ${
              led
                ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30"
                : "bg-slate-800 text-slate-500"
            }`}
          >
            💡
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Primary Room LED
            </h3>
            <p className="text-xs text-slate-400">
              Firebase node: <code className="text-indigo-400">/sensor/led</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ActionButton
            active={led}
            onClick={() => onSetLed(!led)}
            className="min-w-[90px]"
          >
            {led ? "Turn OFF" : "Turn ON"}
          </ActionButton>
        </div>
      </div>

      {/* Context Automation Mode Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">
            Operating Mode
          </span>
          <span className="text-xs text-slate-500">
            {mode === "AUTO"
              ? "STM32 rules active (PIR + LDR)"
              : "Manual / Voice override active"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <ActionButton
            active={mode === "AUTO"}
            onClick={() => onSetMode("AUTO")}
          >
            Auto Context
          </ActionButton>
          <ActionButton
            active={mode === "MANUAL"}
            onClick={() => onSetMode("MANUAL")}
          >
            Manual / Voice
          </ActionButton>
        </div>
      </div>
    </Card>
  );
}