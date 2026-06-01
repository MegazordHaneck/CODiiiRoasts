import { useCallback } from "react";
import { fetchSpeech } from "../lib/api";
import { estimateSpeechDurationMs } from "../lib/face/proceduralLipSync";
import { codiiiVoiceProfile } from "../lib/voice/codiiiVoiceProfile";
import { useAudioAnalyser } from "./useAudioAnalyser";

export function useCodiiiVoice(volume: number, muted: boolean) {
  const {
    mouthState,
    mouthOpenness,
    eyeOpenness,
    isSpeaking,
    playBuffer,
    playProcedural,
    stop,
  } = useAudioAnalyser();

  const speakFromBuffer = useCallback(
    async (buffer: ArrayBuffer | null, text: string) => {
      if (muted || !text.trim()) return false;

      if (buffer) {
        await playBuffer(buffer, volume);
        return true;
      }

      const fetched = await fetchSpeech(text);
      if (fetched) {
        await playBuffer(fetched, volume);
        return true;
      }

      if (!("speechSynthesis" in window)) return false;

      const duration = estimateSpeechDurationMs(text);
      playProcedural(text, duration);

      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = codiiiVoiceProfile.fallbackRate;
      utter.pitch = codiiiVoiceProfile.fallbackPitch;
      const voices = speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => v.lang.startsWith("en-GB")) ??
        voices.find((v) => v.name.includes("Google UK")) ??
        voices.find((v) => v.lang.startsWith("en"));
      if (preferred) utter.voice = preferred;

      await new Promise<void>((resolve) => {
        utter.onend = () => {
          stop();
          resolve();
        };
        utter.onerror = () => {
          stop();
          resolve();
        };
        speechSynthesis.speak(utter);
      });
      return true;
    },
    [muted, playBuffer, playProcedural, stop, volume],
  );

  const speak = useCallback(
    async (text: string) => speakFromBuffer(null, text),
    [speakFromBuffer],
  );

  return {
    mouthState,
    mouthOpenness,
    eyeOpenness,
    isSpeaking,
    speak,
    speakFromBuffer,
    stopSpeaking: stop,
  };
}
