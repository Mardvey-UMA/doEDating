import React, { useState, useEffect, useRef } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import styles from "../../src/styles/homePage.module.scss";
import { WEBSOCKET_URL } from "../../src/components/constants";

// Интерфейс для описания данных пользователя
interface User {
  id: number;
  first_name: string; // snake_case для соответствия бэкенду
  last_name: string; // snake_case
  username: string;
}

// Интерфейс для передачи данных через WebSocket
interface UserData {
  id?: number;
  first_name?: string; // snake_case
  last_name?: string; // snake_case
  username?: string;
}

const HomePage: React.FC = () => {
  const [userId, setUserId] = useState<number | "">(""); // ID теперь число
  const [selectedUserId, setSelectedUserId] = useState<number | "">(""); // Изменен тип на number
  const [deleteUserId, setDeleteUserId] = useState<number | "">(""); // Изменен тип на number
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState<User | null>(null); // Состояние для информации о текущем пользователе
  const [usersList, setUsersList] = useState<User[]>([]); // Состояние для списка пользователей
  const [fetchedUser, setFetchedUser] = useState<User | null>(null); // Состояние для полученной информации о пользователе

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Инициализация WebSocket
    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log("WebSocket подключен");

      // Получение информации о текущем пользователе из LocalStorage
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        const userId = Number(storedUserId);
        sendMessage("user-get-by-id-topic", { id: userId });
      }
    };

    ws.current.onmessage = (event) => {
      const response = JSON.parse(event.data);

      console.log("Получено сообщение из WebSocket:", response);

      // Обработка ответа из разных топиков
      switch (response.topic) {
        case "user-get-list-response-topic":
          setUsersList(response.data); // Обновляем список пользователей
          break;
        case "user-get-by-id-response-topic":
          // Обновляем информацию для пользователя по ID, если ID совпадает с текущим пользователем
          if (response.data.id === Number(localStorage.getItem("userId"))) {
            setUserInfo(response.data); // Обновляем информацию о текущем пользователе
          } else {
            setFetchedUser(response.data); // Обновляем информацию о пользователе по ID
          }
          break;
        case "user-update-response-topic":
          alert("Информация пользователя успешно обновлена");
          break;
        case "user-delete-response-topic":
          alert(`Пользователь с ID ${deleteUserId} был успешно удален`);
          setDeleteUserId(""); // Очищаем поле удаления
          break;
        default:
          console.log("Неизвестный топик:", response.topic);
      }
    };

    ws.current.onerror = (error) => {
      console.error("Ошибка WebSocket:", error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [deleteUserId]);

  // Функция для отправки сообщений с accessToken в WebSocket
  const sendMessage = (topic: string, data: UserData) => {
    const accessToken = localStorage.getItem("accessToken"); // Получаем accessToken
    const message = {
      topic: topic,
      data: data,
      accessToken: accessToken,
    };

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      console.log("Отправлено в WebSocket:", message);
    } else {
      console.error("WebSocket не открыт");
    }
  };

  const handleGetUsers = () => {
    sendMessage("user-get-list-topic", {}); // Отправляем запрос на получение списка пользователей
  };

  const handleGetUserById = () => {
    if (userId !== "") {
      sendMessage("user-get-by-id-topic", { id: Number(userId) }); // Отправляем запрос на получение информации о пользователе по ID
    } else {
      console.error("User ID не указан");
    }
  };

  const handleUpdateUser = () => {
    if (selectedUserId !== "") {
      const updatedData: UserData = { id: Number(selectedUserId) };

      if (firstName != "") {
        updatedData.first_name = firstName;
      }
      if (lastName != "") {
        updatedData.last_name = lastName;
      }
      if (username != "") {
        updatedData.username = username;
      }

      sendMessage("user-update-topic", updatedData);
    } else {
      console.error("User ID для изменения не указан");
    }
  };

  const handleDeleteUser = () => {
    if (deleteUserId !== "") {
      sendMessage("user-delete-topic", { id: Number(deleteUserId) });
    } else {
      console.error("User ID для удаления не указан");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Box className={styles.userInfoRow}>
        {/* Блок информации о текущем пользователе */}
        <Box className={styles.userInfoBox}>
          <Typography variant="h6">
            Информация о текущем пользователе
          </Typography>
          {userInfo ? (
            <Typography variant="body1">
              Имя: {userInfo.first_name}, Фамилия: {userInfo.last_name},
              Username: {userInfo.username}
            </Typography>
          ) : (
            <Typography variant="body1">
              Здесь будет отображаться информация о текущем пользователе.
            </Typography>
          )}
        </Box>

        {/* Блок информации о пользователе по ID */}
        <Box className={styles.fetchedUserInfoBox}>
          <Typography variant="h6">Информация о пользователе по ID</Typography>
          {fetchedUser ? (
            <Typography variant="body1">
              Имя: {fetchedUser.first_name}, Фамилия: {fetchedUser.last_name},
              Username: {fetchedUser.username}
            </Typography>
          ) : (
            <Typography variant="body1">
              Здесь будет отображаться информация о пользователе по введенному
              ID.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Блок для получения информации о пользователе по ID */}
      <Box className={styles.rowContainer}>
        <TextField
          label="Введите ID пользователя"
          value={userId}
          onChange={(e) =>
            setUserId(e.target.value !== "" ? Number(e.target.value) : "")
          }
          fullWidth
        />
        <Button variant="contained" onClick={handleGetUserById}>
          Получить по ID
        </Button>
      </Box>

      {/* Кнопки и поля для изменения информации о пользователе */}
      <Box className={styles.buttonContainer}>
        <Box className={styles.rowContainer}>
          <TextField
            label="ID для изменения"
            value={selectedUserId}
            onChange={(e) =>
              setSelectedUserId(
                e.target.value !== "" ? Number(e.target.value) : ""
              )
            }
            fullWidth
          />
          <TextField
            label="Имя"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Фамилия"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleUpdateUser}>
            Изменить пользователя
          </Button>
        </Box>

        {/* Кнопка для удаления пользователя */}
        <Box className={styles.rowContainer}>
          <TextField
            label="Введите ID пользователя"
            value={deleteUserId}
            onChange={(e) =>
              setDeleteUserId(
                e.target.value !== "" ? Number(e.target.value) : ""
              )
            }
            fullWidth
          />
          <Button variant="contained" color="error" onClick={handleDeleteUser}>
            Удалить пользователя
          </Button>
        </Box>

        {/* Кнопка для получения списка пользователей */}
        <Box className={styles.rowContainer}>
          <Button variant="contained" onClick={handleGetUsers}>
            Получить список пользователей
          </Button>
        </Box>

        {/* Отображение списка пользователей */}
        {/* Отображение списка пользователей */}
        <Box>
          <Typography variant="h6">Список пользователей:</Typography>
          <ul>
            {usersList.map((user, index) => (
              <li key={index}>
                ID: {user.id} - {user.first_name} {user.last_name} (
                {user.username})
              </li>
            ))}
          </ul>
        </Box>
      </Box>
    </div>
  );
};

export default HomePage;
