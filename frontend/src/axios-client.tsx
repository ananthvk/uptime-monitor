import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL
if(!apiURL) {
    throw new Error("API url not set, set VITE_API_URL to the backend API location")
}
export const axiosClient = axios.create({
    baseURL: apiURL,
});
export default axiosClient