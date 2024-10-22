import { refreshAccessToken } from "./refreshService";

let accessToken: string | null = localStorage.getItem("accessToken");
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
  if (!accessToken) {
    accessToken = localStorage.getItem("accessToken");
  }

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
          const { accessToken: newToken } = await refreshAccessToken();
          accessToken = newToken;
          localStorage.setItem("accessToken", newToken);
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
