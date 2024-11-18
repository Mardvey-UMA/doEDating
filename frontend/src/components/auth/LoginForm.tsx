import React, { useState } from "react";
import InputField from "../../components/InputField";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/formFields.module.scss";
import { login } from "../../services/authService";
import VkIdButton from "../../components/vkElements/VkButton";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email && password) {
      setError("");

      try {
        await login({ username: email, password: password });
        navigate("/home");
      } catch (err) {
        console.error("Ошибка авторизации:", err);
        setError("Ошибка авторизации. Проверьте данные и попробуйте снова.");
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
      <Button className={styles.loginButton} onClick={handleLogin}>
        Войти
      </Button>
      <a href="http://localhost/api/auth/oauth2/vk">
        <VkIdButton />
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
