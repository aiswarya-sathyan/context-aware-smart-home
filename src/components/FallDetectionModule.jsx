/**
 * src/components/FallDetectionModule.jsx
 * ----------------------------------------------------------------------------
 * Primary feature: live elderly-occupant status (Normal / Movement /
 * Critical / Acknowledged) plus the Automated Guardian Dispatcher, which
 * surfaces caretaker contact details, timestamp, and a lat/long placeholder
 * the moment a fall is detected. Acknowledge / Clear Siren are PIN-gated.
 * ========================================================================== */
import React from "react";
import {
  Siren,
  UserCog,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  PersonStanding,
  OctagonAlert,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { Panel } from "./ui/Primitives.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const STATUS_MAP = {
  NORMAL: { label: "Normal / Active", color: "#10b981", Icon: ShieldCheck },
  MOVEMENT: { label: "Movement Detected", color: "#22d3ee", Icon: PersonStanding },
  CRITICAL: { label: "CRITICAL: Fall Detected", color: "#ef4444", Icon: OctagonAlert },
  ACKNOWLEDGED: { label: "Acknowledged — Awaiting Clear", color: "#f59e0b", Icon: AlertTriangle },
};

function GuardianDispatch({ fallEvent, acknowledged, onAcknowledge, onClearSiren }) {
  const { requestPin, isGuest } = useAuth();

  if (!fallEvent) return null;

  return (
    <div className="mt-4 rounded-md border border-red-500/40 bg-red-950/40 p-4">
      <div className="mb-3 flex items-center gap-2 text-red-300">
        <Siren className="h-4 w-4 animate-pulse" />
        <p className="text-sm font-semibold">Automated guardian dispatcher</p>
      </div>

      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2 text-slate-300">
          <UserCog className="h-3.5 w-3.5 text-slate-500" />
          <dt className="text-slate-500">Caretaker</dt>
          <dd className="font-medium text-slate-200">Mrs. Anjali Rao</dd>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Phone className="h-3.5 w-3.5 text-slate-500" />
          <dt className="text-slate-500">Contact</dt>
          <dd className="font-mono text-slate-200">+91 98450-11223</dd>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          <dt className="text-slate-500">Timestamp</dt>
          <dd className="font-mono text-slate-200">{fallEvent.timestamp.toLocaleTimeString()}</dd>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <MapPin className="h-3.5 w-3.5 text-slate-500" />
          <dt className="text-slate-500">Location</dt>
          <dd className="font-mono text-slate-200">
            {fallEvent.lat}, {fallEvent.lng}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          disabled={acknowledged || isGuest}
          onClick={() => requestPin("acknowledge this alert", onAcknowledge)}
          className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {acknowledged ? "Alert acknowledged" : "Acknowledge alert"}
        </button>
        <button
          disabled={isGuest}
          onClick={() => requestPin("clear the siren and reset status", onClearSiren)}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-600 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Siren className="h-3.5 w-3.5" />
          Clear siren
        </button>
      </div>
    </div>
  );
}

export default function FallDetectionModule({ telemetry }) {
  const { occupantStatus, fallEvent, alertAcknowledged, actions } = telemetry;
  const status = STATUS_MAP[occupantStatus];
  const StatusIcon = status.Icon;

  return (
    <Panel
      tone={occupantStatus === "CRITICAL" ? "critical" : "default"}
      className={occupantStatus === "CRITICAL" ? "ring-1 ring-red-500/30" : ""}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${status.color}1a`,
              color: status.color,
              boxShadow: occupantStatus === "CRITICAL" ? `0 0 0 6px ${status.color}22` : "none",
            }}
          >
            <StatusIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Elderly occupant &middot; live status
            </p>
            <p className="text-lg font-semibold" style={{ color: status.color }}>
              {status.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-400">
          <Activity className="h-3.5 w-3.5" />
          Fall-detection module: online
        </div>
      </div>

      <GuardianDispatch
        fallEvent={fallEvent}
        acknowledged={alertAcknowledged}
        onAcknowledge={actions.acknowledgeAlert}
        onClearSiren={actions.clearSiren}
      />
    </Panel>
  );
}
