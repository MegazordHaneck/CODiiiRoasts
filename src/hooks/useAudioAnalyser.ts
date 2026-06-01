import { useCallback, useEffect, useRef, useState } from "react";
import {
  opennessToMouthState,
  speechEnergyToOpenness,
} from "../lib/face/faceLayout";
import type { MouthState } from "../lib/face/faceLayout";
import {
  estimateSpeechDurationMs,
  proceduralOpenness,
} from "../lib/face/proceduralLipSync";

export function useAudioAnalyser() {
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const smoothRef = useRef(0);
  const rafRef = useRef(0);
  const proceduralStartRef = useRef(0);
  const proceduralTextRef = useRef("");
  const proceduralEndRef = useRef(0);

  const [mouthState, setMouthState] = useState<MouthState>("smile");
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [eyeOpenness, setEyeOpenness] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const applyOpenness = useCallback((target: number) => {
    smoothRef.current = smoothRef.current * 0.35 + target * 0.65;
    const o = smoothRef.current;
    setMouthOpenness(o);
    setMouthState(opennessToMouthState(o));
    setEyeOpenness(0.82 + o * 0.22);
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  }, []);

  const stop = useCallback(() => {
    stopLoop();
    try {
      sourceRef.current?.stop();
    } catch {
      /* already stopped */
    }
    sourceRef.current = null;
    proceduralEndRef.current = 0;
    setIsSpeaking(false);
    smoothRef.current = 0;
    setMouthOpenness(0);
    setMouthState("smile");
    setEyeOpenness(1);
  }, [stopLoop]);

  const getContext = useCallback(async () => {
    const ctx = ctxRef.current ?? new AudioContext();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") await ctx.resume();
    return ctx;
  }, []);

  const startAnalysisLoop = useCallback(
    (analyser: AnalyserNode, onEnd: () => void) => {
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.12;
      const freq = new Uint8Array(analyser.frequencyBinCount);
      const sampleRate = analyser.context.sampleRate;
      const binHz = sampleRate / analyser.fftSize;

      const tick = () => {
        const now = performance.now();
        if (proceduralEndRef.current > 0 && now >= proceduralEndRef.current) {
          onEnd();
          return;
        }

        if (proceduralEndRef.current > 0) {
          const elapsed = now - proceduralStartRef.current;
          applyOpenness(proceduralOpenness(elapsed, proceduralTextRef.current));
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        analyser.getByteFrequencyData(freq);
        let energy = 0;
        let bins = 0;
        for (let i = 0; i < freq.length; i++) {
          const hz = i * binHz;
          if (hz >= 200 && hz <= 4000) {
            energy += freq[i];
            bins += 1;
          }
        }
        const normalized = bins > 0 ? energy / (bins * 255) : 0;
        applyOpenness(speechEnergyToOpenness(normalized * 2.2));
        rafRef.current = requestAnimationFrame(tick);
      };

      stopLoop();
      rafRef.current = requestAnimationFrame(tick);
    },
    [applyOpenness, stopLoop],
  );

  const playBuffer = useCallback(
    async (buffer: ArrayBuffer, volume = 0.85) => {
      stop();
      proceduralEndRef.current = 0;

      const ctx = await getContext();
      const audioBuffer = await ctx.decodeAudioData(buffer.slice(0));

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      const analyser = ctx.createAnalyser();
      const gain = ctx.createGain();
      gain.gain.value = volume;

      source.connect(analyser);
      analyser.connect(gain);
      gain.connect(ctx.destination);

      sourceRef.current = source;
      setIsSpeaking(true);

      source.onended = () => stop();

      startAnalysisLoop(analyser, stop);
      source.start(0);
    },
    [stop, getContext, startAnalysisLoop],
  );

  /** Lip-sync when using speechSynthesis (no analyser tap) */
  const playProcedural = useCallback(
    (text: string, durationMs?: number) => {
      stop();
      const duration = durationMs ?? estimateSpeechDurationMs(text);
       proceduralTextRef.current = text;
      proceduralStartRef.current = performance.now();
      proceduralEndRef.current = proceduralStartRef.current + duration;
      setIsSpeaking(true);

      const tick = () => {
        const now = performance.now();
        if (now >= proceduralEndRef.current) {
          stop();
          return;
        }
        applyOpenness(proceduralOpenness(now - proceduralStartRef.current, text));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [stop, applyOpenness],
  );

  useEffect(() => () => stop(), [stop]);

  return {
    mouthState,
    mouthOpenness,
    eyeOpenness,
    isSpeaking,
    playBuffer,
    playProcedural,
    stop,
  };
}
