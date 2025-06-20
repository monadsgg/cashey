import axios from "axios";
import { getToken } from "../utils/auth";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(function (config) {
  let accessToken = getToken();

  if (accessToken && accessToken !== "") {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

export default instance;
