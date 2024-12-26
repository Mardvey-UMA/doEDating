import { AppDispatch } from "../store";
import { addUsersToState } from "../store/searchSlice";
import store, { RootState } from "../store";

const interestsEx = [
  {
    name: "Moke",
    color: "#FF5733",
    textColor: "#FFFFFF",
  },
];

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

export interface Interest {
  name: string;
  color: string;
  textColor: string;
}

interface UserResponse {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  city: string;
  job: string;
  education: string;
  about_me: string;
  photos: string[];
}

export const fetchUsersRecommendation = async (
  dispatch: AppDispatch
): Promise<User[]> => {
  const state: RootState = store.getState();
  const accessToken = state.auth.token;

  console.log("fetchUsersRecommendation вызвана");


  // cписок для накопленных пользователей
  const allUsers: User[] = [];

  return new Promise((resolve, reject) => {
    // fetch для получения SSE потока с токеном авторизации
    fetch("/api/recommendation/stream", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "text/event-stream",
      },
    })
      .then((response) => {
        console.log("ОТВЕТИК", response);
        //packetCount = 0;
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const readStream = async () => {
          while (true) {
            const { done, value } = await reader?.read() || { done: true, value: null };
            if (done) {
              console.log("Поток завершен или считано 10 пакетов");
              resolve(allUsers); //возвращаем накопленные пользователей
              break;
            }

            buffer += decoder.decode(value, { stream: true });

            let boundary = buffer.indexOf("\n\n");
            while (boundary !== -1) {
              const eventData = buffer.slice(0, boundary);
              console.log("Полученные данные из потока SSE:", eventData);

              //убираем префикс "data:" из события SSE, если он есть
              const jsonData = eventData.replace(/^data:\s*/, "");

              try {
                const data = JSON.parse(jsonData);
                if (data.batch_index === -1) {
                  console.log("Обработка завершена, закрытие потока");
                  resolve(allUsers); 
                  break;
                } else if (data.batch_index != 0) {
                  const users = data.users_list.map((user: UserResponse) => ({
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

                  console.log("Обработанные пользователи для dispatch:", users);

                  //добавляем пользователей в Redux
                  dispatch(addUsersToState(users));

                  //добавляем пользователей в накопленный список
                  allUsers.push(...users);
                }
              } catch (error) {
                console.error("Ошибка при обработке данных события SSE", error);
              }

              buffer = buffer.slice(boundary + 2); // отрезаем обработанные данные
              boundary = buffer.indexOf("\n\n"); // ищем следующее сообщение
            }
          }
        };

        //асинхронное чтение данных из потока
        readStream().catch((error) => {
          console.error("Ошибка при чтении потока", error);
          reject(error);
        });
      })
      .catch((error) => {
        console.error("Ошибка при подключении к SSE потоку", error);
        reject(error);
      });
  });
};
