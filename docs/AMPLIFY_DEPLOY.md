# AWS Amplify deployment

## 1. Connect GitHub

1. Push this repo to [github.com/MegazordHaneck/CODiiiRoasts](https://github.com/MegazordHaneck/CODiiiRoasts.git)
2. AWS Amplify Console → **Create new app** → **Host web app**
3. Connect GitHub → select **CODiiiRoasts** → branch **main**
4. Amplify detects `amplify.yml` automatically

## 2. Secrets

In Amplify Console → **Hosting** → **Environment variables** (or Gen 2 secrets):

| Secret / variable | Purpose |
|-------------------|---------|
| `OPENAI_API_KEY` | LLM roasts + TTS |
| `TTS_VOICE_ID` | OpenAI voice (default: `nova`) |
| `ROAST_PROVIDER` | `openai` |

For Gen 2 sandbox locally:

```bash
npx ampx sandbox secret set OPENAI_API_KEY
```

## 3. SPA routing

`amplify.yml` includes a rewrite so `/admin` and all routes serve `index.html`.

## 4. Function URLs

After first backend deploy, `amplify_outputs.json` is generated with:

```json
{
  "custom": {
    "roastUrl": "https://...",
    "speakUrl": "https://..."
  }
}
```

The Vite build picks this up automatically. For local dev, copy URLs to `.env.local`:

```
VITE_ROAST_URL=
VITE_SPEAK_URL=
VITE_ADMIN_PIN=1234
```

## 5. Booth day

Open your Amplify URL in Chrome → F11 fullscreen. No install on booth PCs.
