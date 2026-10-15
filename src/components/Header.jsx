/**
 * src/components/Header.jsx
 * ----------------------------------------------------------------------------
 * Top navigation bar: connection status badge, RBAC role switch, and the
 * global Emergency Override / SOS lock. Both role switching and SOS are
 * PIN-gated via useAuth().requestPin.
 * ========================================================================== */
import React from "react";
import { Cpu, Wifi, WifiOff, Eye, UserCog, Lock, Unlock } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header({ connected, sosLocked, onToggleSos }) {
  const { role, setRole, isGuest, requestPin } = useAuth();

  const handleRoleSwitch = () => {
    if (role === "caretaker") {
      setRole("guest");
    } else {
      requestPin("switch to Caretaker / Admin mode", () => setRole("caretaker"));
    }
  };

  const handleSos = () => {
    requestPin(
      sosLocked ? "release the emergency override" : "engage the emergency override",
      onToggleSos
    );
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30">
            <Cpu className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-100">
              Context-Aware Smart Home &amp; Safety System
            </p>
            <p className="text-[11px] text-slate-500">
              STM32-based automation &middot; ESP8266 telemetry link
            </p>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-medium ${
              connected
                ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                : "border-slate-700 bg-slate-800 text-slate-400"
            }`}
          >
            {connected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            SIMULATED STM32 / DEMO MODE
          </span>

          <button
            onClick={handleRoleSwitch}
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition ${
              isGuest
                ? "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
            }`}
            title="Click to switch role"
          >
            {isGuest ? <Eye className="h-3.5 w-3.5" /> : <UserCog className="h-3.5 w-3.5" />}
            Role: {isGuest ? "Guest / View Only" : "Caretaker / Admin"}
          </button>

          <button
            onClick={handleSos}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition ${
              sosLocked
                ? "bg-red-600 text-white shadow-lg shadow-red-950 animate-pulse"
                : "border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20"
            }`}
          >
            {sosLocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
            {sosLocked ? "Release SOS Override" : "Emergency Override / SOS"}
          </button>
        </div>
      </div>
    </header>
  );
}
