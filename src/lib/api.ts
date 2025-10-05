// lib/api.ts
import axios from "axios";

export const api = axios.create({ baseURL: "/api/proxy" });

// Optional: response error handling
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      if (typeof window !== "undefined") window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  }
);
