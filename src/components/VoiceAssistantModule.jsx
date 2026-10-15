import { useState, useEffect, useRef, useCallback } from "react";
import { Card, Badge, ActionButton } from "./ui/Primitives";

export default function VoiceAssistantModule({
  telemetry,
  onSetLed,
  onSetMode,
}) {
  const [isListening, setIsListening] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [assistantReply, setAssistantReply] = useState(
    "Tap the microphone or say 'Turn on the light' or 'Status report'."
  );
  const [commandHistory, setCommandHistory] = useState([]);
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef(null);
  const telemetryRef = useRef(telemetry);

  useEffect(() => {
    telemetryRef.current = telemetry;
  }, [telemetry]);

  const speakFeedback = useCallback((text) => {
    setAssistantReply(text);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const processVoiceCommand = useCallback(
    (rawText) => {
      const cmd = rawText.toLowerCase().trim();
      if (!cmd) return;

      let response = "";
      const current = telemetryRef.current;

      if (
        (cmd.includes("turn on") ||
          cmd.includes("switch on") ||
          cmd.includes("enable") ||
          cmd.includes("lights on") ||
          cmd.includes("led on")) &&
        (cmd.includes("light") || cmd.includes("led") || cmd.includes("lamp"))
      ) {
        onSetLed(true);
        response = "Turning on the STM32 LED and switching to manual mode.";
      } else if (
        (cmd.includes("turn off") ||
          cmd.includes("switch off") ||
          cmd.includes("disable") ||
          cmd.includes("lights off") ||
          cmd.includes("led off")) &&
        (cmd.includes("light") || cmd.includes("led") || cmd.includes("lamp"))
      ) {
        onSetLed(false);
        response = "Turning off the STM32 LED.";
      } else if (cmd.includes("auto mode") || cmd.includes("automatic")) {
        onSetMode("AUTO");
        response =
          "Switched to automatic context-aware mode. STM32 will control lighting based on motion and ambient light.";
      } else if (cmd.includes("manual mode") || cmd.includes("manual")) {
        onSetMode("MANUAL");
        response = "Switched to manual override mode.";
      } else if (
        cmd.includes("status") ||
        cmd.includes("report") ||
        cmd.includes("sensor") ||
        cmd.includes("room")
      ) {
        const motionStr = current.motion
          ? "motion is detected"
          : "no motion detected";
        const ledStr = current.led ? "on" : "off";
        response = `Room report: ${motionStr}, ambient light level is ${current.light}, and the main LED is ${ledStr} in ${current.mode} mode.`;
      } else {
        response = `Heard "${rawText}", but didn't match a command. Try "Turn on light", "Turn off light", "Auto mode", or "Status report".`;
      }

      speakFeedback(response);
      setCommandHistory((prev) => [
        {
          id: Date.now(),
          command: rawText,
          reply: response,
          time: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 4),
      ]);
    },
    [onSetLed, onSetMode, speakFeedback]
  );

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = continuousMode;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let interim = "";
      let finalChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const txt = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalChunk += txt;
        } else {
          interim += txt;
        }
      }

      setTranscript(finalChunk || interim);
      if (finalChunk) {
        processVoiceCommand(finalChunk);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [continuousMode, processVoiceCommand]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript("");
      recognitionRef.current.start();
    }
  };

  return (
    <Card className="flex flex-col justify-between gap-5 border-indigo-500/30">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">
              Voice Assistant Control
            </h2>
            <Badge variant={isListening ? "success" : "neutral"}>
              {isListening ? "Listening..." : "Standby"}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Hands-free voice dispatch to ESP32-C3 & STM32
          </p>
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={continuousMode}
            onChange={(e) => setContinuousMode(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
          />
          Continuous Mic
        </label>
      </div>

      {!supported ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
          Web Speech API is not supported in this browser. Use Chromium, Chrome,
          or Edge, or click the quick command buttons below.
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <button
            onClick={toggleListening}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all cursor-pointer mx-auto sm:mx-0 ${
              isListening
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
            }`}
            title={isListening ? "Stop Listening" : "Start Voice Command"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              {isListening ? "Live Transcript" : "Assistant Response"}
            </div>
            <p className="text-sm text-slate-200 font-medium mt-1 wrap-anywhere">
              {transcript ? `"${transcript}"` : assistantReply}
            </p>
          </div>
        </div>
      )}

      <div>
        <span className="text-xs text-slate-400 block mb-2">
          Quick Voice Macros:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            "Turn on light",
            "Turn off light",
            "Auto mode",
            "Status report",
          ].map((preset) => (
            <ActionButton
              key={preset}
              onClick={() => processVoiceCommand(preset)}
              className="text-xs py-2"
            >
              &ldquo;{preset}&rdquo;
            </ActionButton>
          ))}
        </div>
      </div>

      {commandHistory.length > 0 && (
        <div className="border-t border-slate-800/80 pt-3">
          <span className="text-xs font-medium text-slate-400 block mb-2">
            Recent Voice Logs
          </span>
          <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
            {commandHistory.map((item) => (
              <div
                key={item.id}
                className="text-xs flex items-center justify-between gap-2 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800/60"
              >
                <span className="text-indigo-300 font-medium truncate">
                  &ldquo;{item.command}&rdquo;
                </span>
                <span className="text-slate-500 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}