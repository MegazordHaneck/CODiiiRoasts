import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

type AmplifyCustom = {
  roastUrl?: string;
  speakUrl?: string;
  shareApiUrl?: string;
};

function readAmplifyOutputs(): { custom?: AmplifyCustom } {
  const candidates = [
    path.resolve(__dirname, "amplify_outputs.json"),
    path.resolve(__dirname, "public/amplify_outputs.json"),
  ];
  for (const file of candidates) {
    try {
      if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file, "utf8")) as { custom?: AmplifyCustom };
      }
    } catch {
      /* try next */
    }
  }
  return {};
}

function amplifyOutputsPlugin(): Plugin {
  return {
    name: "amplify-outputs-inject",
    config() {
      const custom = readAmplifyOutputs().custom ?? {};
      return {
        define: {
          __CODIII_ROAST_URL__: JSON.stringify(custom.roastUrl ?? ""),
          __CODIII_SPEAK_URL__: JSON.stringify(custom.speakUrl ?? ""),
          __CODIII_SHARE_URL__: JSON.stringify(custom.shareApiUrl ?? ""),
        },
      };
    },
    buildStart() {
      const src = path.resolve(__dirname, "amplify_outputs.json");
      const dest = path.resolve(__dirname, "public/amplify_outputs.json");
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), amplifyOutputsPlugin()],
  server: { port: 5173 },
  resolve: {
    alias: {
      "@industry": path.resolve(__dirname, "public/industryContext"),
    },
  },
});
