import React, { useState, useEffect, useRef } from "react";
import InputField from "./InputField";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // для перенаправления
import styles from "../../src/styles/formFields.module.scss";
import { WEBSOCKET_URL } from "./constants";
import VkIdButton from "./VkButton";

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const ws = useRef<WebSocket | null>(null);
  const navigate = useNavigate(); // для перенаправления

  useEffect(() => {
    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log("WebSocket подключен");
    };

    ws.current.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        console.log("Получен ответ из WebSocket:", response);

        if (response.topic === "register-response-topic") {
          if (response.data.error) {
            setError(response.data.error); // обрабатываем ошибку
          } else {
            console.log("Регистрация успешна:", response);
            navigate("/login"); // Перенаправляем на страницу входа после успешной регистрации
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
  }, [navigate]);

  const handleRegister = () => {
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
    } else {
      setError("");

      const registerData = {
        topic: "register-topic",
        data: {
          first_name: firstName,
          last_name: lastName,
          username: email,
          password: password,
        },
      };

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(registerData));
        console.log("Отправлено в WebSocket:", registerData);
      } else {
        console.error("WebSocket не открыт");
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>Зарегистрироваться</h1>
      <InputField
        type="text"
        label="Имя"
        onChange={(e) => setFirstName(e.target.value)}
      />
      <InputField
        type="text"
        label="Фамилия"
        onChange={(e) => setLastName(e.target.value)}
      />
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
      <InputField
        type="password"
        label="Повторите пароль"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {error && <p className={styles.error}>{error}</p>}
      <Button
        variant="contained"
        className={styles.registerButton}
        onClick={handleRegister}
      >
        Зарегистрироваться
      </Button>
      <a href="http://localhost/api/auth/oauth2/vk">
      <VkIdButton ></VkIdButton>
      </a>
      <Button
        variant="text"
        className={styles.switchButton}
        onClick={() => navigate("/login")} // Перенаправляем на страницу входа
      >
             
        Уже зарегистрированы? Войти
      </Button>
    </div>
  );
};

export default RegisterForm;
