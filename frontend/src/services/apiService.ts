import { refreshAccessToken } from "./authService";
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
}

import { fetchWithToken } from "./fetchService";

export const fetchUsers = async (): Promise<User[]> => {
  const response = (await fetchWithToken(`/api/users`, {
    method: "GET",
    credentials: "include",
  })) as Response;

  if (!response.ok) {
    throw new Error(`Ошибка: ${response.statusText}`);
  }

  const data = await response.json();
  return data as User[];
};

export const updateUser = async (
  id: number,
  updatedFields: Partial<{
    first_name: string;
    last_name: string;
    username: string;
    password: string;
  }>
): Promise<User> => {
  const response = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updatedFields),
  });

  if (!response.ok) {
    if (response.status === 401) {
      await refreshAccessToken();
      return updateUser(id, updatedFields);
    }
    throw new Error("Ошибка обновления пользователя");
  }

  return response.json();
};

export const deleteUser = async (id: number): Promise<void> => {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      await refreshAccessToken();
      return deleteUser(id);
    }
    throw new Error("Ошибка удаления пользователя");
  }
};
