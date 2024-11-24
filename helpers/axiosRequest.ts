import axios from "axios";
import config from "@/config/config";
import { redirect } from "next/navigation";

const apiClient = axios.create({
  baseURL: config.BACKEND_URL , // Replace with your backend base URL
});

// Interceptor to attach the auth token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use((response)=>{
    console.log("API CLIENT ",response)
    return response
})

export default apiClient;