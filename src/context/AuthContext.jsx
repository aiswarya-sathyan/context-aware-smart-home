/**
 * src/context/AuthContext.jsx
 * ----------------------------------------------------------------------------
 * Role-Based Access Control (Caretaker/Admin vs Guest/View Only) plus a
 * `requestPin(label, onSuccess)` helper any component can call to gate a
 * sensitive action behind the PinAuthModal.
 * ========================================================================== */
import React, { createContext, useContext, useState } from "react";
import PinAuthModal from "../components/PinAuthModal.jsx";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export function AuthProvider({ children }) {
  const [role, setRole] = useState("caretaker"); // "caretaker" | "guest"
  const [pinRequest, setPinRequest] = useState(null); // { label, onSuccess } | null

  const requestPin = (label, onSuccess) => setPinRequest({ label, onSuccess });
  const closePinRequest = () => setPinRequest(null);

  const isGuest = role === "guest";

  return (
    <AuthContext.Provider value={{ role, setRole, isGuest, requestPin }}>
      {children}
      {pinRequest && (
        <PinAuthModal
          label={pinRequest.label}
          onSuccess={() => {
            pinRequest.onSuccess();
            closePinRequest();
          }}
          onCancel={closePinRequest}
        />
      )}
    </AuthContext.Provider>
  );
}
