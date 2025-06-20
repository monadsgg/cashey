import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(function (config) {
  let accessToken = localStorage.getItem("token");

  if (accessToken && accessToken !== "") {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

export default instance;
