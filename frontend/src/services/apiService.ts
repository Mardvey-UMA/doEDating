import { refreshAccessToken } from "./authService";
import { User, UserResponse } from "../components/tsVariables/types";

import { fetchWithToken } from "./fetchService";

export const fetchUsers = async (): Promise<User[]> => {
  try {
    console.log("Отправка запроса для получения списка пользователей");

    // Используем fetchWithToken для отправки запроса с проверкой токена
    // Ожидаем массив объектов UserResponse с полным набором полей
    const response = await fetchWithToken<UserResponse[]>(`/api/users`, {
      method: "GET",
      credentials: "include",
    });

    // Логируем ответ сервера для отладки
    console.log("Ответ сервера:", response);

    // Проверяем, является ли response массивом
    if (!Array.isArray(response)) {
      throw new Error(
        "Некорректный ответ сервера: ожидается массив пользователей"
      );
    }

    // Преобразуем данные: извлекаем только нужные поля
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
export const fetchUserById = async (id: number): Promise<User> => {
  try {
    // Формируем URL с параметром ID
    const response = await fetchWithToken<UserResponse>(`/api/users/${id}`, {
      method: "GET",
      credentials: "include",
    });

    // Проверяем, корректный ли ответ от сервера
    if (!response) {
      throw new Error(`Пользователь с ID ${id} не найден`);
    }

    // Преобразуем данные: извлекаем только нужные поля
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
    // Отправляем запрос на /api/auth/info с проверкой токена
    const response = await fetchWithToken<UserResponse>(`/api/auth/info`, {
      method: "GET",
      credentials: "include",
    });

    // Проверяем ответ
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
