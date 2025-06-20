import api from "./api";

export async function register(name: string, email: string, password: string) {
  const result = await api.post("api/users/register", {
    name,
    email,
    password,
  });
  return result.data;
}

export async function login(email: string, password: string) {
  const result = await api.post("api/users/login", { email, password });
  return result.data;
}
