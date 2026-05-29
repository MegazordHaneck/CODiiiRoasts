import { useCallback, useEffect, useRef, useState } from "react";
import type { MouthState } from "../lib/face/faceLayout";
import { rmsToMouthState } from "../lib/face/faceLayout";

export function useAudioAnalyser() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const [mouthState, setMouthState] = useState<MouthState>("smile");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const rafRef = useRef<number>(0);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    audioRef.current?.pause();
    setIsSpeaking(false);
    setMouthState("smile");
  }, []);

  const playBuffer = useCallback(
    async (buffer: ArrayBuffer, volume = 0.85) => {
      stop();
      const blob = new Blob([buffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.volume = volume;
      audioRef.current = audio;

      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(ctx.destination);

      const data = new Uint8Array(analyser.frequencyBinCount);
      setIsSpeaking(true);

      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        setMouthState(rmsToMouthState(rms));
        rafRef.current = requestAnimationFrame(tick);
      };

      audio.onended = () => {
        stop();
        URL.revokeObjectURL(url);
      };

      await audio.play();
      tick();
    },
    [stop],
  );

  useEffect(() => () => stop(), [stop]);

  return { mouthState, isSpeaking, playBuffer, stop };
}
