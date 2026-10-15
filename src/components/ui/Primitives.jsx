import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md transition-all ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({ children, variant = "neutral" }) {
  const styles = {
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    danger: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    info: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    neutral: "bg-slate-800 text-slate-300 border-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        styles[variant] || styles.neutral
      }`}
    >
      {children}
    </span>
  );
}

export function ActionButton({
  children,
  onClick,
  active = false,
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const base =
    "px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variants = {
    primary: active
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500"
      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    danger:
      "bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30",
    ghost:
      "bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function LedDot({ active = false, size = "md" }) {
  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <span
      className={`rounded-full transition-all duration-300 inline-block ${
        sizes[size] || sizes.md
      } ${
        active
          ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
          : "bg-slate-700 border border-slate-600"
      }`}
    />
  );
}