import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export function makeClient(getToken) {
  const client = axios.create({ baseURL: API_BASE });

  client.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return client;
}
