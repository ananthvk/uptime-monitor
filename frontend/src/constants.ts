export const additionalRefectDelay = 100;
export const methods = ['GET', 'HEAD', 'OPTIONS', 'TRACE', 'PUT', 'DELETE', 'POST', 'PATCH', 'CONNECT'] as const;
export const numberOfDataPointsInStatusBar = 30
export const numberOfDataPointsInGraph = 20


export const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
if (!auth0Domain) {
    throw new Error("")
}

export const auth0ClientID = import.meta.env.VITE_AUTH0_CLIENT_ID
if (!auth0ClientID) {
    throw new Error("")
}

export const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE
if (!auth0ClientID) {
    throw new Error("")
}