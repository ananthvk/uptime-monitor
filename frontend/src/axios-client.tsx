import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

const apiURL = import.meta.env.VITE_API_URL;
if (!apiURL) {
    throw new Error('API url not set, set VITE_API_URL to the backend API location');
}

export const axiosClient = axios.create({
    baseURL: apiURL,
});

export const useAxiosWithAuth = () => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    useEffect(() => {
        const interceptor = axiosClient.interceptors.request.use(
            async (config: any) => {
                if (isAuthenticated) {
                    const token = await getAccessTokenSilently();
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Clean up interceptor when component unmounts
        return () => {
            axiosClient.interceptors.request.eject(interceptor);
        };
    }, [getAccessTokenSilently, isAuthenticated]);

    return axiosClient;
};

export default axiosClient