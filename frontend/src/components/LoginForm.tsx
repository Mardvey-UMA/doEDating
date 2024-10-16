import React, { useState, useEffect, useRef } from "react";
import InputField from "./InputField";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "../../src/styles/formFields.module.scss";
import { WEBSOCKET_URL } from "./constants";
import VkIdButton from "./VkButton";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log("WebSocket подключен");
    };

    ws.current.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        //console.log("Получен ответ из WebSocket:", response);

        if (response.topic === "user-auth-response-topic") {
          if (response.data.error) {
            setError(response.data.error); // обработка ошибки
          } else {
            console.log("Авторизация успешна:", response);

            // Извлекаем accessToken и id пользователя
            const accessToken = response.data.access_token;
            const userId = response.data.user_id;
            console.log(userId);
            // Сохраняем accessToken и userId в LocalStorage
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("userId", userId);

            // Переход на страницу Home
            navigate("/home");
          }
        }
      } catch (error) {
        console.error("Ошибка при обработке сообщения:", error);
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
  }, []);

  const handleLogin = () => {
    if (email && password) {
      setError("");

      const loginData = {
        topic: "user-auth-topic",
        data: {
          username: email,
          password: password,
        },
      };

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(loginData));
        console.log("Отправлено в WebSocket:", loginData);
      } else {
        console.error("WebSocket не открыт");
      }
    } else {
      setError("Не все поля заполнены");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>Войти</h1>
      <InputField
        type="email"
        label="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        type="password"
        label="Пароль"
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className={styles.error}>{error}</p>}
      <Button variant="contained" onClick={handleLogin}>
        Войти
      </Button>
      <a href="http://localhost/api/auth/oauth2/vk">
      <VkIdButton ></VkIdButton>
      </a>
      <Button
        variant="text"
        className={styles.switchButton}
        onClick={() => navigate("/register")}
      >
        Еще нет аккаунта? Зарегистрироваться
      </Button>

    </div>
  );
};

export default LoginForm;
