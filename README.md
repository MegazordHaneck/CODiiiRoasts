# CODiii Roasts

Conference booth web app — live LLM roasts with child-like TTS and animated CODiii face.

Deployed on **AWS Amplify**. Open the URL on any booth PC in Chrome fullscreen.

## Quick start (local)

```bash
npm install
npm run dev
```

Without Amplify function URLs configured, the app uses **fallback roasts** from `src/content/fallback-roasts.json`.

## Amplify sandbox

```bash
npx ampx sandbox secret set OPENAI_API_KEY
npm run sandbox
```

After sandbox deploy, copy function URLs into `.env.local`:

```
VITE_ROAST_URL=https://...
VITE_SPEAK_URL=https://...
VITE_ADMIN_PIN=1234
```

## Routes

- `/` — booth flow
- `/admin` — staff controls (PIN from `VITE_ADMIN_PIN`)

## Docs

- [docs/AMPLIFY_DEPLOY.md](docs/AMPLIFY_DEPLOY.md)
- [docs/BOOTH_RUNBOOK.md](docs/BOOTH_RUNBOOK.md)
- [docs/TONE_GUIDE.md](docs/TONE_GUIDE.md)

## Repo

https://github.com/MegazordHaneck/CODiiiRoasts
