import React, { useState } from "react";
import InputField from "../InputField";
import { Button } from "@mui/material";
import VkIdButton from "../VkElements/VkButton";
import styles from "./Login.module.scss";
import { LoginProps } from "./Login.type.ts";

const Login: React.FC<LoginProps> = ({
  onLogin,
  onNavigateToRegister,
  loading,
  error,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginClick = () => {
    if (email && password) {
      onLogin(email, password);
    } else {
      // Handle empty fields error locally if needed
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
      <Button
        className={styles.loginButton}
        onClick={handleLoginClick}
        disabled={loading}
      >
        {loading ? "Загрузка..." : "Войти"}
      </Button>
      <a href="http://localhost/api/auth/oauth2/vk">
        <VkIdButton />
      </a>
      <Button
        variant="text"
        className={styles.switchButton}
        onClick={onNavigateToRegister}
      >
        Еще нет аккаунта? Зарегистрироваться
      </Button>
    </div>
  );
};

export default Login;
