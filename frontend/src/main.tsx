import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import 'normalize.css'
import './index.css'
import App from './App.tsx'
import { CssBaseline } from '@mui/material'
import { Auth0Provider } from '@auth0/auth0-react'
import { auth0Audience, auth0ClientID, auth0Domain } from './constants'

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

        <Auth0Provider
            domain={auth0Domain}
            clientId={auth0ClientID}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: auth0Audience,
                // scope: "read:current_user update:current_user_metadata"
            }}
        >
            <QueryClientProvider client={queryClient} >
                <App />
            </QueryClientProvider>
        </Auth0Provider >
    </StrictMode>,
)
