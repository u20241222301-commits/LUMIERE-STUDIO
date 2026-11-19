import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { lumiereApiPlugin } from "./server/apiPlugin.js";

export default defineConfig({
  plugins: [react(), lumiereApiPlugin()],
  server: {
    port: 5173,
    strictPort: false,
    cors: true,
  },
});
