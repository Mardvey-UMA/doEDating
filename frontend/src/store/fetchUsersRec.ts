import { fetchWithToken } from "../services/fetchService";
const interestsEx: Interest[] = [
  //   :)
  {
    name: "Sports",
    color: "#FF5733",
    textColor: "#FFFFFF",
  },
  {
    name: "Music",
    color: "#4CAF50",
    textColor: "#FFFFFF",
  },
  {
    name: "Technology",
    color: "#2196F3",
    textColor: "#FFFFFF",
  },
  {
    name: "Travel",
    color: "#FFC107",
    textColor: "#000000",
  },
];

export interface Interest {
  name: string;
  color: string;
  textColor: string;
}
// Интерфейс для пользователя
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  job: string;
  education: string;
  aboutMe: string;
  photos: string[];
  interests: Interest[];
}

// Тип для ответа от сервера
interface UserResponse {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  age: number;
  city: string;
  job: string;
  education: string;
  about_me: string;
  photos: string[];
}

export const fetchUsersRecommendation = async (): Promise<User[]> => {
  try {
    const response = await fetchWithToken<UserResponse[]>(
      "/api/users/recommendation",
      {
        method: "POST",
      }
    );

    if (!response) {
      throw new Error("Ответ от сервера пуст.");
    }

    const users: User[] = response.map((user: UserResponse) => ({
      id: user.id,
      username: "moke",
      firstName: user.first_name,
      lastName: user.last_name,
      age: user.age,
      city: user.city,
      job: user.job,
      education: user.education,
      aboutMe: user.about_me,
      photos: user.photos,
      interests: interestsEx,
    }));

    return users;
  } catch (error) {
    console.error("Ошибка при получении списка пользователей:", error);
    throw new Error("Ошибка получения списка пользователей");
  }
};
