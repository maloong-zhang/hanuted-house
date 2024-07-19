import { defineConfig } from "vite";
import restart from "vite-plugin-restart";

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: "static/", // Path from "root"(typically where index.html is) to static assets (files that are served as they are)
  plugins: [restart({ restart: ["../static/**"] })],
});
