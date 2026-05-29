import { useCallback } from "react";
import { fetchSpeech } from "../lib/api";
import { codiiiVoiceProfile } from "../lib/voice/codiiiVoiceProfile";
import { useAudioAnalyser } from "./useAudioAnalyser";

export function useCodiiiVoice(volume: number, muted: boolean) {
  const { mouthState, isSpeaking, playBuffer, stop } = useAudioAnalyser();

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
      utter.rate = codiiiVoiceProfile.rate;
      utter.pitch = codiiiVoiceProfile.pitch;
      const voices = speechSynthesis.getVoices();
      const childish =
        voices.find((v) => v.name.includes("Google") && v.lang.startsWith("en")) ??
        voices.find((v) => v.lang.startsWith("en"));
      if (childish) utter.voice = childish;
      speechSynthesis.speak(utter);
    },
    [muted, playBuffer, volume],
  );

  return { mouthState, isSpeaking, speak, stopSpeaking: stop };
}
