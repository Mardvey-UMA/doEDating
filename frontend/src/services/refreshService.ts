// src/services/refreshService.ts
import store from "../store";

export const refreshAccessToken = async (): Promise<string> => {
  const response = await fetch(`/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Не удалось обновить токен");
  }

  const responseData: { access_token: string; access_expires_at: number } =
    await response.json();

  const accessToken = responseData.access_token;
  const accessExpiresAt = responseData.access_expires_at;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("accessTokenExpirationTime", accessExpiresAt.toString());

  console.log("Токен успешно обновлён", accessToken);

  scheduleTokenRefresh(accessExpiresAt);

  store.dispatch({ type: "auth/login/fulfilled", payload: accessToken });

  return accessToken;
};

const scheduleTokenRefresh = (expirationTime: number): void => {
  const now = Date.now();
  const refreshTime = expirationTime - 5 * 60 * 1000;

  const timeUntilRefresh = refreshTime - now;

  if (timeUntilRefresh > 0) {
    setTimeout(async () => {
      await refreshAccessToken();
    }, timeUntilRefresh);
  } else {
    refreshAccessToken();
  }
};

export const initTokenRefresh = (): void => {
  const accessExpiresAt = localStorage.getItem("accessTokenExpirationTime");

  if (accessExpiresAt) {
    const expirationTime = parseInt(accessExpiresAt, 10);
    if (!isNaN(expirationTime)) {
      scheduleTokenRefresh(expirationTime);
    }
  }
};
