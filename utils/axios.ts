import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.API_ADDRESS,
})

export default axiosInstance;