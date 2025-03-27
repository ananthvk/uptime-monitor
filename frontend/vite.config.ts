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
                name: 'check-if-env-variables-are-set',
                config() {
                    if (!env.VITE_API_URL) {
                        throw new Error("VITE_API_URL not set")
                    }
                    if (!env.VITE_AUTH0_CLIENT_ID) {
                        throw new Error("VITE_AUTH0_CLIENT_ID not set")
                    }
                    if (!env.VITE_AUTH0_DOMAIN) {
                        throw new Error("VITE_AUTH0_DOMAIN not set")
                    }
                    if (!env.VITE_AUTH0_AUDIENCE) {
                        throw new Error("VITE_AUTH0_AUDIENCE not set")
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
