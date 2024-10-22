import { initTokenRefresh } from "./refreshService";
export const login = async (data: { username: string; password: string }) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Ошибка авторизации");
  }

  const responseData = await response.json();

  const accessToken = responseData.access_token;
  const accessExpiresAt = responseData.access_expires_at;

  if (accessToken && accessExpiresAt) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("accessTokenExpirationTime", accessExpiresAt);
    initTokenRefresh();
  } else {
    throw new Error("Токен доступа не найден в ответе");
  }

  return responseData;
};

export const register = async (data: {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}) => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Ошибка регистрации");
  }

  return response.json();
};
