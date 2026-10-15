/**
 * src/components/PinAuthModal.jsx
 * ----------------------------------------------------------------------------
 * Secure modal requiring a 4-digit PIN (default: 1234) for clearing safety
 * alarms, overriding auto rules, or switching into Caretaker mode.
 * Validated via React 19's useActionState.
 * ========================================================================== */
import React, { useActionState, useEffect } from "react";
import { KeyRound, X } from "lucide-react";

const DEMO_PIN = "1234";

function pinCheckAction(_prevState, formData) {
  const pin = formData.get("pin") ?? "";
  if (pin === DEMO_PIN) {
    return { status: "success" };
  }
  return { status: "error", message: "Incorrect PIN. Try again." };
}

export default function PinAuthModal({ label, onSuccess, onCancel }) {
  const [state, formAction] = useActionState(pinCheckAction, { status: "idle" });

  useEffect(() => {
    if (state.status === "success") onSuccess();
  }, [state.status, onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2 text-slate-200">
            <KeyRound className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold">Caretaker PIN required</span>
          </div>
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-300" aria-label="Cancel">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form action={formAction} className="px-5 py-5">
          <p className="mb-4 text-sm text-slate-400">
            Enter the 4-digit PIN to <span className="text-slate-200">{label}</span>.
          </p>
          <input
            key={state.status}
            name="pin"
            type="password"
            inputMode="numeric"
            maxLength={4}
            autoFocus
            placeholder="••••"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] text-slate-100 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
          {state.status === "error" && (
            <p className="mt-2 text-center text-xs font-medium text-red-400">{state.message}</p>
          )}
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-md border border-slate-700 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-cyan-600 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
            >
              Confirm
            </button>
          </div>
          <p className="mt-3 text-center text-[11px] text-slate-600">Demo PIN: {DEMO_PIN}</p>
        </form>
      </div>
    </div>
  );
}
