import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

declare var process: any;

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        // vite config
        plugins: [
            react(),
            {
                name: 'check-if-base-api-url-is-set',
                config() {
                    if (!env.VITE_API_URL) {
                        throw new Error("VITE_API_URL not set")
                    }
                }
            }
        ],
        server: {
            port: 3000,
            host: true
        }
    }
})
