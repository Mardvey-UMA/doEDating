import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import styles from "../../src/styles/homePage.module.scss";
import {
  fetchUsers,
  updateUser,
  deleteUser,
  fetchUserById,
  fetchUserInfo,
} from "../services/userService";
import { User } from "../components/tsVariables/types";

const HomePage: React.FC = () => {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [deleteUserId, setDeleteUserId] = useState<number | "">("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<number | "">("");
  const [user, setUser] = useState<User | null>(null); // Для поиска по ID
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Для авторизованного пользователя
  const [error, setError] = useState<string>("");
  useEffect(() => {
    // При монтировании компонента получаем список пользователей
    handleGetUsers();
    handleGetCurrentUser();
  }, []);

  const handleGetUsers = async () => {
    try {
      const users: User[] = await fetchUsers(); // Получаем список пользователей
      setUsersList(users); // Обновляем состояние с пользователями
    } catch (error) {
      console.error(error);
    }
  };
  const handleGetCurrentUser = async () => {
    try {
      const fetchedUser = await fetchUserInfo();
      setCurrentUser(fetchedUser);
    } catch (error) {
      console.error("Ошибка при получении текущего пользователя:", error);
    }
  };
  // Изменение пользователя
  const handleUpdateUser = async () => {
    if (selectedUserId !== "") {
      try {
        const updatedUserData: Partial<{
          first_name: string;
          last_name: string;
          username: string;
          password: string;
        }> = {};

        if (firstName) {
          updatedUserData.first_name = firstName;
        }
        if (lastName) {
          updatedUserData.last_name = lastName;
        }
        if (username) {
          updatedUserData.username = username;
        }

        await updateUser(Number(selectedUserId), updatedUserData);

        alert("Пользователь успешно обновлен");
        handleGetUsers(); // Обновляем список после изменения пользователя
      } catch (error) {
        console.error("Ошибка обновления пользователя:", error);
      }
    } else {
      console.error("ID пользователя не указан");
    }
  };

  // Удаление пользователя
  const handleDeleteUser = async () => {
    if (deleteUserId !== "") {
      try {
        await deleteUser(Number(deleteUserId));
        alert(`Пользователь с ID ${deleteUserId} был удален`);
        setDeleteUserId(""); // Сбрасываем поле для удаления
        handleGetUsers(); // Обновляем список пользователей после удаления
      } catch (error) {
        console.error("Ошибка удаления пользователя:", error);
      }
    }
  };
  const handleFetchUserById = async () => {
    if (userId !== "") {
      try {
        const fetchedUser = await fetchUserById(Number(userId));
        setUser(fetchedUser);
        setError(""); // Сбрасываем ошибку, если запрос успешен
      } catch (err) {
        setError(`Ошибка: ${err}`);
        setUser(null);
      }
    }
  };
  return (
    <div className={styles.pageContainer}>
      <Box>
        <Typography variant="h6">
          Информация об авторизованном пользователе:
        </Typography>
        {currentUser ? (
          <Box>
            <p>ID: {currentUser.id}</p>
            <p>Имя: {currentUser.first_name}</p>
            <p>Фамилия: {currentUser.last_name}</p>
            <p>Логин: {currentUser.username}</p>
          </Box>
        ) : (
          <p>Не удалось получить данные о пользователе</p>
        )}
      </Box>

      <Box>
        <Typography variant="h6">Список пользователей:</Typography>
        {usersList.length > 0 ? (
          <ul>
            {usersList.map((user) => (
              <li key={user.id}>
                ID: {user.id} - {user.first_name} {user.last_name} (
                {user.username})
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет пользователей для отображения</p>
        )}
      </Box>

      {/* Поля для изменения пользователя */}
      <Box className={styles.rowContainer}>
        <TextField
          label="ID для изменения"
          value={selectedUserId}
          onChange={(e) =>
            setSelectedUserId(e.target.value ? Number(e.target.value) : "")
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

      <Typography variant="h6">Поиск пользователя по ID:</Typography>
      <TextField
        label="Введите ID пользователя"
        value={userId}
        onChange={(e) =>
          setUserId(e.target.value ? Number(e.target.value) : "")
        }
        fullWidth
      />
      <Button variant="contained" onClick={handleFetchUserById}>
        Найти пользователя
      </Button>

      {/* Отображаем информацию о пользователе по ID */}
      {user && (
        <Box>
          <Typography variant="h6">Информация о пользователе:</Typography>
          <p>ID: {user.id}</p>
          <p>Имя: {user.first_name}</p>
          <p>Фамилия: {user.last_name}</p>
          <p>Логин: {user.username}</p>
        </Box>
      )}

      {/* Отображаем ошибку, если запрос завершился неудачно */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Поля для удаления пользователя */}
      <Box className={styles.rowContainer}>
        <TextField
          label="Введите ID пользователя для удаления"
          value={deleteUserId}
          onChange={(e) =>
            setDeleteUserId(e.target.value ? Number(e.target.value) : "")
          }
          fullWidth
        />
        <Button variant="contained" color="error" onClick={handleDeleteUser}>
          Удалить пользователя
        </Button>
      </Box>
    </div>
  );
};

export default HomePage;
