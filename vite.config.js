import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import basicSsl from '@vitejs/plugin-basic-ssl'
import tailwindcss from "@tailwindcss/vite"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [    react({
    babel: {
      plugins: [
        ["babel-plugin-react-compiler", ReactCompilerConfig],
      ],
    },
  }), tsconfigPaths(),basicSsl(), tailwindcss()],
  build: {
    target: "ES2022"
  },
});
