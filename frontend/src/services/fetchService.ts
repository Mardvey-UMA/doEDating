import { refreshAccessToken } from "./authService";

export const fetchWithToken = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
    });

    if (response.status === 401) {
      await refreshAccessToken();
      return fetchWithToken<T>(url, options);
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
