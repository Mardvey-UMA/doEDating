// src/services/fetchService.ts
import { refreshAccessToken } from "./refreshService";
import store, { RootState } from "../store";
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};
export const fetchWithToken = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T | void> => {
  const state: RootState = store.getState();
  let accessToken = state.auth.token;

  const headers = {
    ...options.headers,
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          accessToken = newToken;
          store.dispatch({ type: "auth/login/fulfilled", payload: newToken });
          processQueue(null, newToken);
        } catch (err) {
          processQueue(err as Error, null);
          throw new Error("Ошибка при обновлении токена");
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise<T | void>((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken: string) => {
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            };
            fetchWithToken<T>(url, options)
              .then((result) => {
                if (result !== undefined) {
                  resolve(result);
                }
              })
              .catch(reject);
          },
          reject,
        });
      });
    }

    if (response.status === 204) {
      return;
    }

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error("Ошибка запроса с токеном:", error);
    throw new Error("Ошибка при запросе данных с токеном");
  }
};

export const fetchWithTokenPhoto = async (
  url: string,
  options: RequestInit = {}
): Promise<Blob> => {
  const state: RootState = store.getState();
  let accessToken = state.auth.token;

  const headers = {
    ...options.headers,
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          accessToken = newToken;
          store.dispatch({ type: "auth/login/fulfilled", payload: newToken });
          processQueue(null, newToken);
        } catch (err) {
          processQueue(err as Error, null);
          throw new Error("Ошибка при обновлении токена");
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise<Blob>((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken: string) => {
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            };
            fetchWithTokenPhoto(url, options).then(resolve).catch(reject);
          },
          reject,
        });
      });
    }

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Ошибка запроса с токеном:", error);
    throw new Error("Ошибка при запросе данных с токеном");
  }
};
