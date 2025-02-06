import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [react()],
    base: env.VITE_ENVIRONMENT === "localhost" ? "/" : "/standards",
    server: {
      port: 3001,
    },
  }
})
