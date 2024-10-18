export const login = async (data: { username: string; password: string }) => {
  console.log(data);
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Ошибка авторизации");
  }

  return response.json();
};

export const register = async (data: {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}) => {
  console.log(data);
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

export const refreshAccessToken = async () => {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Не удалось обновить токен");
  }

  return response.json();
};
