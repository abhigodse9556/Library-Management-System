import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const tokens = await JSON.parse(localStorage.getItem("tokens"));
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Redirect to login if needed
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
