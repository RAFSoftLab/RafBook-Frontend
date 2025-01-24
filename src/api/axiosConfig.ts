import axios, { AxiosInstance, AxiosError } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://192.168.124.28:1524/api",
  // baseURL: "http://localhost:8080/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log(`Auth Token: ${token}`);
      console.log(`Request URL: ${config.url}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          break;
        case 500:
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
