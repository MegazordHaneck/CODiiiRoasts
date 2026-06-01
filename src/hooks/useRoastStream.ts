import { useEffect, useState } from "react";
import { fetchRoast } from "../lib/api";
import type { Intensity, RoastResult } from "../types";

export function useRoastStream() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState(0);

  const generate = async (input: {
    name: string;
    role: string;
    company?: string;
    introTranscript?: string;
    industryHatId?: string;
    intensity: Intensity;
    safeMode: boolean;
    nsfwPin?: string;
  }) => {
    setLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const data = await fetchRoast(input);
      setLatencyMs(Math.round(performance.now() - start));
      setResult(data);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Roast failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => setResult(null);
  }, []);

  return { loading, result, error, latencyMs, generate, setResult };
}
