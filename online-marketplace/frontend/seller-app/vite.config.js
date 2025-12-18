import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".",        // root is seller-app folder
  server: {
    port: 5175      // dev server port
  }
});
