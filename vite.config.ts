import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import commonjs from "vite-plugin-commonjs";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
    commonjs({
      filter(id) {
        if (id.includes('node_modules/react-easy-sort')) {
          return true
        }
      }
    }),
  ],
});
