/**
 * src/components/VoiceAssistantModule.jsx
 * ----------------------------------------------------------------------------
 * Live Laptop Microphone Voice Command Module & AI Assistant.
 * Uses Web Speech API (SpeechRecognition) for real voice input.
 * Integrates directly with telemetry.actions to toggle lights & fans.
 * ========================================================================== */
import React, { useState, useEffect } from "react";
import { Mic, MicOff, Music, CloudSun, Sparkles, Play, Pause, SkipForward } from "lucide-react";
import { Panel } from "./ui/Primitives.jsx";

export default function VoiceAssistantModule({ telemetry }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('Click "Start Voice Input" and speak into your mic...');
  const [assistantResponse, setAssistantResponse] = useState("AI Voice Assistant ready for spoken commands.");
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  // Media Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState("Calm Ambient Focus");

  // Weather AI Logic based on telemetry
  const temp = telemetry?.sensors?.temperature ?? 26;
  const humidity = telemetry?.sensors?.humidity ?? 55;

  const predictWeather = (t, h) => {
    if (t > 30 && h > 70) return { forecast: "High Rain/Thunderstorm Probability", action: "Recommend securing outdoor sensors." };
    if (t > 28 && h <= 50) return { forecast: "Clear & Warm", action: "HVAC automation active." };
    if (t < 20) return { forecast: "Cool Microclimate", action: "Thermal regulation suggested." };
    return { forecast: "Nominal Indoor Microclimate", action: "Environmental indicators stable." };
  };

  const weatherAI = predictWeather(temp, humidity);

  // Initialize Web Speech API (SpeechRecognition)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("Listening to laptop microphone...");
      };

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(`"${spokenText}"`);
        processVoiceCommand(spokenText);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setTranscript(`Error: ${event.error || "Microphone access blocked/unavailable."}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognitionInstance(recognition);
    } else {
      setTranscript("Web Speech API not supported in this browser. Use Chrome/Edge/Safari.");
    }
  }, [telemetry]);

  // Process live spoken text commands & trigger state changes + voice response
  const processVoiceCommand = (commandText) => {
    const lower = commandText.toLowerCase();
    let responseText = "";

    // Helper functions to clear auto-mode lock if present in telemetry actions
    const disableLightAuto = () => telemetry?.actions?.setLightAuto && telemetry.actions.setLightAuto(false);
    const disableFanAuto = () => telemetry?.actions?.setFanAuto && telemetry.actions.setFanAuto(false);

    // 1. Audio / Music Controls
    if (lower.includes("music") || lower.includes("play") || lower.includes("song")) {
      setIsPlaying(true);
      responseText = "Playing smart home audio playlist.";
    } else if (lower.includes("pause") || lower.includes("stop music")) {
      setIsPlaying(false);
      responseText = "Audio playback paused.";
    } 
    
    // 2. Weather Query
    else if (lower.includes("weather") || lower.includes("temperature") || lower.includes("climate")) {
      responseText = `Current temperature is ${temp} degrees Celsius. Forecast is ${weatherAI.forecast}.`;
    } 
    
    // 3. Living Room Light Control
    else if (lower.includes("light") || lower.includes("lamp") || lower.includes("bulb")) {
      if (lower.includes("on") || lower.includes("enable") || lower.includes("start")) {
        disableLightAuto();
        telemetry?.actions?.setManualLight(true);
        responseText = "Turning on living room light.";
      } else if (lower.includes("off") || lower.includes("disable") || lower.includes("stop")) {
        disableLightAuto();
        telemetry?.actions?.setManualLight(false);
        responseText = "Turning off living room light.";
      } else {
        responseText = "Unclear light instruction. Please say 'turn on light' or 'turn off light'.";
      }
    } 
    
    // 4. Ceiling Fan Control
    else if (lower.includes("fan") || lower.includes("cooler") || lower.includes("vent")) {
      if (lower.includes("on") || lower.includes("enable") || lower.includes("start")) {
        disableFanAuto();
        telemetry?.actions?.setManualFan(true);
        responseText = "Turning on ceiling fan.";
      } else if (lower.includes("off") || lower.includes("disable") || lower.includes("stop")) {
        disableFanAuto();
        telemetry?.actions?.setManualFan(false);
        responseText = "Turning off ceiling fan.";
      } else {
        responseText = "Unclear fan instruction. Please say 'turn on fan' or 'turn off fan'.";
      }
    } 
    
    // Fallback response for unhandled commands
    else {
      responseText = `Received command: "${commandText}". Command not recognized by local rule parser.`;
    }

    setAssistantResponse(responseText);
    speakText(responseText);
  };

  // Speak response out loud using Laptop Speaker (SpeechSynthesis)
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionInstance) {
      try {
        recognitionInstance.start();
      } catch (err) {
        recognitionInstance.stop();
      }
    }
  };

  return (
    <Panel title="Live Voice Assistant & Smart Speaker" icon={<Sparkles className="h-4 w-4 text-cyan-400" />}>
      <div className="space-y-4">
        
        {/* Live Mic Controls */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${isListening ? "bg-red-500/20 text-red-400 animate-pulse ring-1 ring-red-500/50" : "bg-cyan-500/10 text-cyan-400"}`}>
                {isListening ? <Mic className="h-4.5 w-4.5" /> : <MicOff className="h-4.5 w-4.5" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Laptop Microphone Input</p>
                <p className="text-[11px] text-slate-400">{isListening ? "Listening... Speak now!" : "Click button to speak"}</p>
              </div>
            </div>

            <button
              onClick={startListening}
              disabled={isListening}
              className="rounded bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-cyan-500 disabled:opacity-50"
            >
              {isListening ? "Listening..." : "Start Voice Input"}
            </button>
          </div>

          <div className="mt-3 rounded bg-slate-950/80 p-2.5 font-mono text-[11px]">
            <p className="text-slate-400"><span className="text-slate-500">Heard:</span> {transcript}</p>
            <p className="mt-1 text-cyan-400"><span className="text-slate-500">Response:</span> {assistantResponse}</p>
          </div>
        </div>

        {/* Smart Speaker Output */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Music className="h-4 w-4 text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Smart Speaker Audio Output</p>
                <p className="text-[11px] text-slate-400">{currentTrack}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
              </button>
              <button
                onClick={() => setCurrentTrack("Lo-Fi Study Beats")}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Weather AI */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <CloudSun className="h-4 w-4" />
            <span>AI Predictive Weather Engine</span>
          </div>
          <div className="mt-2 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-300">
              <span>Predicted Forecast:</span>
              <span className="font-semibold text-slate-100">{weatherAI.forecast}</span>
            </div>
            <p className="text-slate-400"><span className="text-slate-500">Action:</span> {weatherAI.action}</p>
          </div>
        </div>

      </div>
    </Panel>
  );
}