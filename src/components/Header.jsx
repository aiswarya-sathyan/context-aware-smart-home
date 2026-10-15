import React from "react";
import { Badge } from "./ui/Primitives";

export default function Header({ connected, lastSync, mode, onOpenSim }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
            <span className="text-indigo-400 font-bold text-lg">SH</span>
          </div>
          <div className="truncate">
            <h1 className="text-base sm:text-lg font-bold text-white truncate">
              Context-Aware Smart Home
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              STM32 Sensor Node • ESP32-C3 Gateway • Voice Assisted
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Badge variant={mode === "AUTO" ? "info" : "warning"}>
            Mode: {mode}
          </Badge>

          <Badge variant={connected ? "success" : "danger"}>
            <span
              className={`w-2 h-2 rounded-full ${
                connected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
              }`}
            />
            <span className="hidden xs:inline">
              {connected ? "Firebase Online" : "Offline"}
            </span>
          </Badge>

          {lastSync && (
            <span className="text-xs text-slate-500 hidden md:inline">
              Synced {lastSync}
            </span>
          )}

          <button
            onClick={onOpenSim}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            Simulator
          </button>
        </div>
      </div>
    </header>
  );
}