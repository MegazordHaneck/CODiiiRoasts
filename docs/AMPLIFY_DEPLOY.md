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
VITE_NSFW_PIN=1818
# Optional separate /admin PIN — if omitted, /admin uses VITE_NSFW_PIN
# VITE_ADMIN_PIN=1234
```

## 5. Booth day

Open your Amplify URL in Chrome → F11 fullscreen. No install on booth PCs.

## Troubleshooting

### `BootstrapDetectionError` / `ssm:GetParameter` on `cdk-bootstrap`

The backend phase (`npx ampx pipeline-deploy`) needs CDK bootstrapped in your **Amplify region** (yours: `ca-central-1`) and the Amplify CodeBuild role must be allowed to read bootstrap metadata.

**Step 1 — Bootstrap CDK (one-time, run as account admin)**

From a machine with AWS CLI configured for account `824930503114`:

```bash
npx cdk bootstrap aws://824930503114/ca-central-1
```

Or bootstrap via Amplify sandbox (also creates backend resources locally):

```bash
npm install
npx ampx sandbox secret set OPENAI_API_KEY
npx ampx sandbox
```

**Step 2 — Allow CodeBuild to read CDK bootstrap version**

In **IAM** → find role `AemiliaControlPlaneLambda-CodeBuildRole-*` (from the build log) → **Add permissions** → **Create inline policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ssm:GetParameter",
      "Resource": "arn:aws:ssm:ca-central-1:824930503114:parameter/cdk-bootstrap/*"
    }
  ]
}
```

Also check **Amplify Console** → **App settings** → **IAM roles** → ensure the **Build** service role has permissions for Amplify Gen 2 backend deploy (or attach `AdministratorAccess-Amplify` / Amplify backend deploy policies if your org allows).

**Step 3 — Redeploy**

Amplify Console → **Redeploy this version** on `main`, or push an empty commit.

### `npm ci` lock file out of sync

Run `npm install` locally, commit `package-lock.json`, push.

### Build succeeds but roasts use fallback text

Set `OPENAI_API_KEY` in Amplify **Secrets** (Gen 2), redeploy, and confirm `amplify_outputs.json` contains `custom.roastUrl` and `custom.speakUrl` after the backend phase.
