# Booth runbook

## Before the show

1. Open the Amplify URL in Chrome on the booth laptop
2. Press **F11** for fullscreen
3. Disable sleep / screen lock
4. Visit `/admin` — confirm safe mode ON, unmute voice if the crowd can hear
5. Run one test roast end-to-end (voice + face animation)

## Staff script (30 seconds)

> "Tell CODiii who you are and what you do in AEC — architect, GC, BIM, whatever. Pick a roast intensity. CODiii runs a fake compliance scan, then roasts you in a kid voice while his face moves. It's industry satire — RFIs, submittals, coordination chaos — not personal attacks. Then we show you what CODiii actually fixes."

## During demos

- Staff drives keyboard on intake form
- If API is slow, the scan animation covers the wait (~9s)
- If API fails, fallback roasts still work (offline-safe)

## Reset

- **Kill switch:** `/admin` → Kill switch
- **Auto-reset:** share screen returns to attract loop after 30s
- **Manual:** Share screen → "Start over"

## If voice fails

Roast text still displays. Check Amplify function URL for `speak` in browser network tab. Web Speech API fallback runs if cloud TTS fails.

## If LLM fails

Fallback roasts from pre-written templates. Session logged as `fallback: true` in admin export.
