import { useCallback, useEffect, useRef, useState } from "react";
import { opennessToMouthState, rmsToOpenness } from "../lib/face/faceLayout";
import type { MouthState } from "../lib/face/faceLayout";

export function useAudioAnalyser() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const smoothRef = useRef(0);
  const [mouthState, setMouthState] = useState<MouthState>("smile");
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const rafRef = useRef<number>(0);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setIsSpeaking(false);
    setMouthOpenness(0);
    smoothRef.current = 0;
    setMouthState("smile");
  }, []);

  const playBuffer = useCallback(
    async (buffer: ArrayBuffer, volume = 0.85) => {
      stop();

      const blob = new Blob([buffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.volume = volume;
      audio.preload = "auto";
      audioRef.current = audio;

      const ctx = ctxRef.current ?? new AudioContext();
      ctxRef.current = ctx;
      if (ctx.state === "suspended") await ctx.resume();

      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.35;
      source.connect(analyser);
      analyser.connect(ctx.destination);

      const data = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        if (!audioRef.current || audio.paused) return;
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        const target = rmsToOpenness(rms);
        smoothRef.current = smoothRef.current * 0.55 + target * 0.45;
        setMouthOpenness(smoothRef.current);
        setMouthState(opennessToMouthState(smoothRef.current));
        rafRef.current = requestAnimationFrame(tick);
      };

      audio.onended = () => {
        stop();
        URL.revokeObjectURL(url);
      };

      setIsSpeaking(true);
      await audio.play();
      tick();
    },
    [stop],
  );

  useEffect(() => () => stop(), [stop]);

  return { mouthState, mouthOpenness, isSpeaking, playBuffer, stop };
}
