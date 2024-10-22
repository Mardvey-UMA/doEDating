import { refreshAccessToken } from "./authService";

export const fetchWithToken = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T | void> => {
  const token = localStorage.getItem("accessToken");

  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : "",
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      await refreshAccessToken();
      return fetchWithToken<T>(url, options);
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
