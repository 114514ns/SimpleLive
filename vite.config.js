import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import mkcert from 'vite-plugin-mkcert'
import tailwindcss from "@tailwindcss/vite"
const ReactCompilerConfig = { /* ... */ };
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [    react({
    babel: {
      plugins: [
        ["babel-plugin-react-compiler", ReactCompilerConfig],
      ],
    },
  }), tsconfigPaths(), tailwindcss(),mkcert()],
  build: {
    target: "ES2022"
  },
  server: {
    https: true,
  }
});
