import { getExpiryTime } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const refreshToken = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API_URL}/auth/refresh`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const expiryTime = getExpiryTime();
    localStorage.setItem("youthshield-token-expiry", expiryTime.toString());
    useAuthStore.getState().setToken(data.accessToken);
  } catch (error) {
    console.error("Token refresh error", error);
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._isRetry) {
      try {
        originalRequest._isRetry = true;
        const headers = { ...originalRequest.headers };
        await refreshToken();
        return api.request({ ...originalRequest, headers });
      } catch (err) {
        console.error("Token refresh error", err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
