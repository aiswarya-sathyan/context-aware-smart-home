/**
 * src/components/ui/Primitives.jsx
 * ----------------------------------------------------------------------------
 * Small, shared visual atoms used across the dashboard: a status LED dot,
 * an amber "automation is driving this" badge, and the bordered Panel
 * wrapper used by every card. Kept separate so each feature module stays
 * focused on its own logic rather than repeating layout chrome.
 * ========================================================================== */
import React from "react";

export function LedDot({ color }) {
  return (
    <span
      className="inline-block h-2 w-2 rounded-full"
      style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
    />
  );
}

export function AutoBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
      {children}
    </span>
  );
}

export function Panel({ title, icon, children, className = "", tone = "default" }) {
  const toneRing =
    tone === "critical" ? "border-red-500/40" : tone === "warn" ? "border-amber-500/30" : "border-slate-800";
  return (
    <section className={`rounded-lg border ${toneRing} bg-slate-900/60 ${className}`}>
      {title && (
        <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
          {icon}
          <h2 className="text-sm font-semibold tracking-wide text-slate-200">{title}</h2>
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
