import axios from "axios";

export const axiosClient = axios.create({
    baseURL: 'http://192.168.1.199:3001/api/v1',
});
export default axiosClient