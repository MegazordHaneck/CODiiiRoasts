import { useCallback } from "react";
import { fetchSpeech } from "../lib/api";
import { codiiiVoiceProfile } from "../lib/voice/codiiiVoiceProfile";
import { useAudioAnalyser } from "./useAudioAnalyser";

export function useCodiiiVoice(volume: number, muted: boolean) {
  const { mouthState, mouthOpenness, isSpeaking, playBuffer, stop } = useAudioAnalyser();

  const speak = useCallback(
    async (text: string) => {
      if (muted || !text.trim()) return;

      const buffer = await fetchSpeech(text);
      if (buffer) {
        await playBuffer(buffer, volume);
        return;
      }

      if (!("speechSynthesis" in window)) return;
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = codiiiVoiceProfile.fallbackRate;
      utter.pitch = codiiiVoiceProfile.fallbackPitch;
      const voices = speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => v.lang.startsWith("en-GB")) ??
        voices.find((v) => v.name.includes("Google UK")) ??
        voices.find((v) => v.lang.startsWith("en"));
      if (preferred) utter.voice = preferred;
      speechSynthesis.speak(utter);
    },
    [muted, playBuffer, volume],
  );

  return { mouthState, mouthOpenness, isSpeaking, speak, stopSpeaking: stop };
}
