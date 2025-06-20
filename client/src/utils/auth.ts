import { jwtDecode } from "jwt-decode";

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getToken = () => {
  return localStorage.getItem("token")!;
};

export function getCurrentUser() {
  try {
    const token = getToken();
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}

export const isAuthenticated = () => {
  const user = getCurrentUser();

  if (!user || typeof user.exp !== "number") {
    return false;
  }

  if (user.exp < Date.now() / 1000) {
    logout();
    return false;
  }

  return true;
};
