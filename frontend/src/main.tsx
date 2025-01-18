import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import 'normalize.css'
import './index.css'
import App from './App.tsx'
import { CssBaseline } from '@mui/material'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false
        }
    }
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CssBaseline />
        <QueryClientProvider client={queryClient} >
            <App />
        </QueryClientProvider>
    </StrictMode>,
)
