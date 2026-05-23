import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode ?? "development", process.cwd(), "");
  for (const [k, v] of Object.entries(env)) {
    if (process.env[k] === undefined) process.env[k] = v;
  }
  return {
    tanstackStart: {
      server: { entry: "server" },
    },
    vite: {
      resolve: {
        alias: {
          "entities/lib/decode.js": path.resolve(
            process.cwd(),
            "node_modules/entities/lib/decode.js",
          ),
          "entities/lib/encode.js": path.resolve(
            process.cwd(),
            "node_modules/entities/lib/encode.js",
          ),
          entities: path.resolve(process.cwd(), "node_modules/entities"),
        },
      },
    },
  };
});
