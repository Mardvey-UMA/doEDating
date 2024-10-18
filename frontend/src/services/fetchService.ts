export const fetchWithToken = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (response.status === 401) {
    try {
      await refreshAccessToken();
      return fetchWithToken<T>(url, options);
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  if (!response.ok) {
    throw new Error(`Ошибка: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};
function refreshAccessToken() {
  throw new Error("Function not implemented.");
}
