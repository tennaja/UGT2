import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Define the modes in which you want to drop console and debugger
const modesToRemoveConsole = ["qas", "production"];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env": env,
    },
    plugins: [react()],
    server: {
      // port: 3000,
    },
    esbuild: {
      drop: modesToRemoveConsole.includes(mode) ? ["console", "debugger"] : [],
    },
  };
});
