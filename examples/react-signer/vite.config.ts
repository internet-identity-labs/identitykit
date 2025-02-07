import { nodePolyfills } from "vite-plugin-node-polyfills"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), nodePolyfills()],
    server: {
      port: 3003,
    },
  }
})
