import { sites } from "@openai/sites-vite-plugin";
import { defineConfig } from "vite";

export default defineConfig(async () => {
  const { cloudflare } = await import("@cloudflare/vite-plugin");
  return {
    plugins: [
      sites(),
      cloudflare({
        viteEnvironment: { name: "server" },
        config: {
          main: "./worker/index.ts",
          compatibility_flags: ["nodejs_compat"],
          assets: { binding: "ASSETS" }
        }
      })
    ]
  };
});
