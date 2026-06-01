import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clearNsfwSession } from "../lib/nsfwAccess";
import type { Attendee, Intensity, RoastResult, Screen, SessionRecord } from "../types";

const STORAGE_KEY = "codiii-roasts-settings";

export type BoothSettings = {
  safeMode: boolean;
  mute: boolean;
  volume: number;
  defaultIntensity: Intensity;
  autoResetSeconds: number;
};

const defaultSettings: BoothSettings = {
  safeMode: true,
  mute: false,
  volume: 0.85,
  defaultIntensity: "contractor",
  autoResetSeconds: 30,
};

type BoothContextValue = {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  attendee: Attendee | null;
  setAttendee: (attendee: Attendee) => void;
  intensity: Intensity;
  setIntensity: (intensity: Intensity) => void;
  nsfwPin: string | null;
  setNsfwPin: (pin: string | null) => void;
  roast: RoastResult | null;
  setRoast: (roast: RoastResult | null) => void;
  webcamPhotoUrl: string | null;
  setWebcamPhotoUrl: (url: string | null) => void;
  roastSpeechBuffer: ArrayBuffer | null;
  setRoastSpeechBuffer: (buffer: ArrayBuffer | null) => void;
  settings: BoothSettings;
  updateSettings: (patch: Partial<BoothSettings>) => void;
  sessions: SessionRecord[];
  logSession: (record: Omit<SessionRecord, "id" | "timestamp">) => void;
  resetFlow: () => void;
  killSwitch: () => void;
};

const BoothContext = createContext<BoothContextValue | null>(null);

function loadSettings(): BoothSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = { ...defaultSettings, ...JSON.parse(raw) } as BoothSettings;
      if (parsed.defaultIntensity === "nsfw") {
        parsed.defaultIntensity = "contractor";
      }
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return defaultSettings;
}

export function BoothProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<Screen>("attract");
  const [attendee, setAttendeeState] = useState<Attendee | null>(null);
  const [intensity, setIntensity] = useState<Intensity>(loadSettings().defaultIntensity);
  const [nsfwPin, setNsfwPin] = useState<string | null>(null);
  const [roast, setRoast] = useState<RoastResult | null>(null);
  const [webcamPhotoUrl, setWebcamPhotoUrl] = useState<string | null>(null);
  const [roastSpeechBuffer, setRoastSpeechBuffer] = useState<ArrayBuffer | null>(null);
  const [settings, setSettings] = useState<BoothSettings>(loadSettings);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((patch: Partial<BoothSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const setAttendee = useCallback((a: Attendee) => {
    setAttendeeState(a);
  }, []);

  const logSession = useCallback((record: Omit<SessionRecord, "id" | "timestamp">) => {
    setSessions((prev) => [
      {
        ...record,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const resetFlow = useCallback(() => {
    setAttendeeState(null);
    setRoast(null);
    setWebcamPhotoUrl(null);
    setRoastSpeechBuffer(null);
    setNsfwPin(null);
    clearNsfwSession();
    setIntensity(loadSettings().defaultIntensity);
    setScreen("attract");
  }, []);

  const killSwitch = useCallback(() => {
    resetFlow();
  }, [resetFlow]);

  const value = useMemo(
    () => ({
      screen,
      setScreen,
      attendee,
      setAttendee,
      intensity,
      setIntensity,
      nsfwPin,
      setNsfwPin,
      roast,
      setRoast,
      webcamPhotoUrl,
      setWebcamPhotoUrl,
      roastSpeechBuffer,
      setRoastSpeechBuffer,
      settings,
      updateSettings,
      sessions,
      logSession,
      resetFlow,
      killSwitch,
    }),
    [
      screen,
      attendee,
      intensity,
      nsfwPin,
      roast,
      webcamPhotoUrl,
      roastSpeechBuffer,
      settings,
      updateSettings,
      sessions,
      logSession,
      resetFlow,
      killSwitch,
    ],
  );

  return <BoothContext.Provider value={value}>{children}</BoothContext.Provider>;
}

export function useBooth() {
  const ctx = useContext(BoothContext);
  if (!ctx) throw new Error("useBooth must be used within BoothProvider");
  return ctx;
}
