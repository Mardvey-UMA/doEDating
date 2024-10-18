import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import styles from "../../src/styles/homePage.module.scss";
import {
  fetchUsers,
  updateUser,
  deleteUser,
} from "../../src/services/apiService";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
}

const HomePage: React.FC = () => {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [deleteUserId, setDeleteUserId] = useState<number | "">("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    handleGetUsers();
  }, []);

  const handleGetUsers = async () => {
    try {
      const users: User[] = await fetchUsers(); 
      setUsersList(users); 
    } catch (error) {
      console.error("Ошибка получения списка пользователей:", error);
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
        handleGetUsers(); 
      } catch (error) {
        console.error("Ошибка обновления пользователя:", error);
      }
    } else {
      console.error("ID пользователя не указан");
    }
  };

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

  return (
    <div className={styles.pageContainer}>
      <Box>
        <Typography variant="h6">Список пользователей:</Typography>
        <ul>
          {usersList.map((user) => (
            <li key={user.id}>
              ID: {user.id} - {user.first_name} {user.last_name} (
              {user.username})
            </li>
          ))}
        </ul>
      </Box>

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
