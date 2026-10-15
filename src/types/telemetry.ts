/**
 * src/types/telemetry.ts
 * ----------------------------------------------------------------------------
 * Shared type definitions for sensor telemetry, derived automation state,
 * appliance state, and alert levels.
 *
 * These types describe the CONTRACT between the simulator and the future
 * real hardware link. When the ESP8266 comes online, its WebSocket/HTTP
 * payloads should be mapped into these exact shapes before being handed
 * to the rest of the app — nothing downstream should need to change.
 * ========================================================================== */

/** Raw sensor readings, as they would arrive from the STM32 over ESP8266. */
export interface SensorState {
  /** PIR occupancy sensor: true = motion detected */
  pir: boolean;
  /** LDR ambient light sensor, 0–1000 lux */
  lux: number;
  /** DHT ambient temperature sensor, 15–45 °C */
  tempC: number;
  /** MQ-2 gas/smoke sensor: true = leak detected */
  gasLeak: boolean;
  /** IR flame sensor: true = fire detected */
  flame: boolean;
  /** Water leakage probe: true = leak detected */
  waterLeak: boolean;
}

/** Rules derived from SensorState — the "brain" the STM32 firmware runs. */
export interface AutomationState {
  /** Fan is forced on because tempC > 30 */
  fanForced: boolean;
  /** Light auto-on because PIR motion + lux < 200 */
  lightAuto: boolean;
  /** Exhaust fan forced on because of gas leak or flame */
  exhaustForced: boolean;
  /** Water pump auto shut-off because of a detected leak */
  pumpShutoff: boolean;
}

/** Single appliance's resolved on/off + whether automation is driving it. */
export interface ApplianceStatus {
  on: boolean;
  auto: boolean;
}

export interface ApplianceState {
  light: ApplianceStatus;
  fan: ApplianceStatus;
  exhaust: ApplianceStatus;
  pump: ApplianceStatus;
}

/** A single elderly-fall incident dispatched to the guardian/caretaker. */
export interface FallEvent {
  timestamp: Date;
  lat: string;
  lng: string;
}

/** Alert severity levels used across the dashboard. */
export type AlertLevel = "NORMAL" | "MOVEMENT" | "CRITICAL" | "ACKNOWLEDGED";

/** Roles recognized by the RBAC layer. */
export type UserRole = "caretaker" | "guest";

/** Shape returned by useSTM32Telemetry(). */
export interface TelemetryContextValue {
  sensors: SensorState;
  automation: AutomationState;
  appliances: ApplianceState;
  fallEvent: FallEvent | null;
  alertAcknowledged: boolean;
  occupantStatus: AlertLevel;
  actions: {
    setPir: (v: boolean) => void;
    setLux: (v: number) => void;
    setTempC: (v: number) => void;
    setGasLeak: (v: boolean) => void;
    setFlame: (v: boolean) => void;
    setWaterLeak: (v: boolean) => void;
    setManualLight: (v: boolean) => void;
    setManualFan: (v: boolean) => void;
    triggerFall: () => void;
    acknowledgeAlert: () => void;
    clearSiren: () => void;
  };
}
