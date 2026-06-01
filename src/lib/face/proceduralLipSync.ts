/** Syllable-ish bumps for browser TTS when Web Audio analyser is unavailable */
export function estimateSpeechDurationMs(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.min(28000, Math.max(2200, words * 380 + text.length * 28));
}

export function proceduralOpenness(elapsedMs: number, text: string): number {
  const syllableRate = 4.2;
  const phase = (elapsedMs / 1000) * syllableRate * Math.PI * 2;
  const wordPulse = Math.sin(phase) * 0.5 + 0.5;
  const micro = Math.sin(phase * 2.7) * 0.25 + 0.25;
  const punctuationPause =
    elapsedMs > 0 && Math.floor(elapsedMs / 900) % 2 === 0 ? 0.15 : 0;
  const vowelBoost = /[aeiou]/i.test(text[Math.floor(elapsedMs / 120) % text.length] ?? "a")
    ? 0.12
    : 0;
  return Math.min(1, Math.max(0.08, wordPulse * 0.55 + micro * 0.35 + vowelBoost - punctuationPause));
}
