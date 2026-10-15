import React from "react";
import { Card, Badge } from "./ui/Primitives";

export default function EnvironmentalAlarms({ telemetry }) {
  const { motion, light, led } = telemetry;

  // Normalize light value (supports both 0-100% or 0-4095 12-bit STM32 ADC)
  const maxScale = light > 100 ? 4095 : 100;
  const lightPercent = Math.min(100, Math.round((light / maxScale) * 100));
  const isDark = lightPercent < 35;

  return (
    <Card className="flex flex-col justify-between gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            STM32 Sensor Telemetry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time UART stream via ESP32-C3 Super Mini
          </p>
        </div>
        <Badge variant={motion ? "warning" : "neutral"}>
          {motion ? "Occupied" : "Clear"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* PIR Motion Status */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            motion
              ? "bg-emerald-500/10 border-emerald-500/40"
              : "bg-slate-950/60 border-slate-800"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">
              PIR Motion Sensor
            </span>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                motion ? "bg-emerald-400 animate-ping" : "bg-slate-600"
              }`}
            />
          </div>
          <div className="text-xl font-bold text-white">
            {motion ? "Motion Detected" : "No Motion"}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Node: <code className="text-indigo-400">/sensor/motion</code>
          </p>
        </div>

        {/* LDR Ambient Light Status */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">
              Ambient Light (LDR)
            </span>
            <Badge variant={isDark ? "warning" : "info"}>
              {isDark ? "Low Light" : "Bright"}
            </Badge>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-white">{light}</span>
            <span className="text-xs text-slate-400">{lightPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${lightPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Context Inference Summary Banner */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
        <span className="text-slate-400">Context Evaluation:</span>
        <span className="text-slate-200 font-medium text-right">
          {motion && isDark
            ? "Room occupied in low light → Auto LED ON recommended"
            : !motion && led
            ? "No occupancy detected with LED ON → Energy saving recommended"
            : "Environment optimal"}
        </span>
      </div>
    </Card>
  );
}