import { User, UserResponse } from "../components/tsVariables/types";

import { fetchWithToken } from "./fetchService";

// Функция для получения списка пользователей
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetchWithToken<UserResponse[]>(`/api/users`, {
      method: "GET",
    });

    const users: User[] = response.map((user: UserResponse) => ({
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
    }));

    return users;
  } catch (error) {
    console.error("Ошибка при получении списка пользователей:", error);
    throw new Error("Ошибка получения списка пользователей");
  }
};

// Функция для обновления данных пользователя
export const updateUser = async (
  id: number,
  updatedFields: Partial<{
    first_name: string;
    last_name: string;
    username: string;
    password: string;
  }>
): Promise<User> => {
  try {
    return await fetchWithToken<User>(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
  } catch (error) {
    console.error("Ошибка обновления пользователя:", error);
    throw new Error("Ошибка обновления пользователя");
  }
};

// Функция для удаления пользователя
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await fetchWithToken<void>(`/api/users/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Ошибка удаления пользователя:", error);
    throw new Error("Ошибка удаления пользователя");
  }
};

// Функция для получения информации о пользователе по ID
export const fetchUserById = async (id: number): Promise<User> => {
  try {
    const response = await fetchWithToken<UserResponse>(`/api/users/${id}`, {
      method: "GET",
    });

    if (!response) {
      throw new Error(`Пользователь с ID ${id} не найден`);
    }

    const user: User = {
      id: response.id,
      username: response.username,
      first_name: response.first_name,
      last_name: response.last_name,
    };

    return user;
  } catch (error) {
    console.error("Ошибка при получении пользователя по ID:", error);
    throw new Error(`Ошибка получения пользователя с ID ${id}`);
  }
};

// Функция для получения информации о текущем пользователе
export const fetchUserInfo = async (): Promise<User> => {
  try {
    const response = await fetchWithToken<UserResponse>(`/api/users/info`, {
      method: "GET",
    });

    if (!response) {
      throw new Error("Не удалось получить информацию о пользователе");
    }

    const user: User = {
      id: response.id,
      username: response.username,
      first_name: response.first_name,
      last_name: response.last_name,
    };

    return user;
  } catch (error) {
    console.error("Ошибка при получении информации о пользователе:", error);
    throw new Error("Ошибка получения информации о пользователе");
  }
};
