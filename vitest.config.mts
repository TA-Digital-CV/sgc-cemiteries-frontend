import { defineConfig } from "vitest/config";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    css: {
      include: [],
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
    server: {
      deps: {
        inline: ["@igrp/igrp-framework-react-design-system"],
      },
    },
    setupFiles: ["./src/app/(igrp)/cemeteries/[id]/__tests__/setup.ts"],
  },
  resolve: {
    alias: [
      {
        find: /.*maplibre-gl\.css$/,
        replacement: resolve(
          __dirname,
          "./src/app/(igrp)/cemeteries/[id]/__tests__/styleMock.js",
        ),
      },
      { find: "@", replacement: resolve(__dirname, "./src") },
    ],
  },
});
