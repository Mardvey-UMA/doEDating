import {
  User,
  UserResponse,
  UserInfo,
  UserResponseInfo,
} from "./userService.type.ts";

import { fetchWithToken } from "./fetchService";

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetchWithToken<UserResponse[]>(`/api/users`, {
      method: "GET",
    });

    if (!response) {
      throw new Error("Ответ от сервера пуст.");
    }

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
export const uploadUserPhoto = async (
  file: File,
  userId: number
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchWithToken<{ photo_url?: string; error?: string }>(
    `/api/users/${userId}/photo`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );

  if (!response) {
    throw new Error("Ошибка при загрузке фото");
  }

  if (response.error) {
    alert(response.error);
    return null;
  }

  return response.photo_url || null;
};

export const deleteUserPhoto = async (
  userId: number,
  filename: string
): Promise<void> => {
  try {
    await fetchWithToken(`/api/users/${userId}/photo/${filename}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Ошибка при удалении фотографии на сервере:", error);
    throw new Error("Не удалось удалить фотографию на сервере");
  }
};

// Функция для обновления данных пользователя
export const updateUser = async (
  id: number,
  updatedFields: Partial<{
    email: string;
    first_name: string;
    last_name: string;
    birth_date: Date | null;
    gender: string;
    city: string;
    job: string;
    education: string;
    about_me: string;
    selected_interests: number[];
    photos: string[];
    telegram_id: string;
  }>
): Promise<void> => {
  try {
    const response = await fetchWithToken(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });

    if (!response) {
      throw new Error("Ответ от сервера пуст.");
    }

    console.log("Профиль пользователя успешно обновлен на сервере.");
  } catch (error) {
    console.error("Ошибка обновления пользователя:", error);
    throw new Error("Ошибка обновления профиля пользователя");
  }
};
// Функция для удаления пользователя
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await fetchWithToken<void>(`/api/users/${id}`, {
      method: "DELETE",
    });

    console.log(`Пользователь с ID ${id} успешно удален.`);
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

// Функция для получения полной информации о текущем пользователе
export const fetchUserInfo = async (): Promise<UserInfo> => {
  try {
    const response = await fetchWithToken<UserResponseInfo>(`/api/users/info`, {
      method: "GET",
    });
    console.log(response);
    if (!response) {
      throw new Error("Не удалось получить информацию о пользователе");
    }

    // Преобразуем `UserResponseInfo` в `UserInfo`
    const user: UserInfo = {
      id: response.id,
      username: response.username,
      firstName: response.first_name,
      lastName: response.last_name,
      email: response.email,
      birthDate: response.birth_date,
      gender: response.gender,
      city: response.city,
      job: response.job,
      education: response.education,
      aboutMe: response.about_me,
      selectedInterests: response.selected_interests,
      photos: response.photos,
      telegramId: response.telegram_id,
      chatId: response.chat_id
    };

    return user;
  } catch (error) {
    console.error("Ошибка при получении информации о пользователе:", error);
    throw new Error("Ошибка получения информации о пользователе");
  }
};
