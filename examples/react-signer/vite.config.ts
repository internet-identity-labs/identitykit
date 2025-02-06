import { nodePolyfills } from "vite-plugin-node-polyfills"
import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [react(), nodePolyfills()],
    base: env.VITE_ENVIRONMENT === "dev" ? "/" : "/demo",
    server: {
      port: 3003,
    },
  }
})
