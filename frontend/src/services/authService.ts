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

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
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

export const refreshAccessToken = async () => {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Не удалось обновить токен");
  } else {
    const responseData = await response.json();
    console.log(responseData);
    const accessToken = responseData.access_token;
    console.log(accessToken);
    localStorage.setItem("accessToken", accessToken);
  }
  return response.json();
};
