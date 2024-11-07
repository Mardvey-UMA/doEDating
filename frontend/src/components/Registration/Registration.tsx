import React, { useState } from "react";
import InputField from "../InputField";
import { Button } from "@mui/material";
import VkIdButton from "../VkElements/VkButton";
import styles from "./Registration.module.scss";
import { RegistrationProps } from "./Registration.type.ts";

const Registration: React.FC<RegistrationProps> = ({
  onRegister,
  onNavigateToLogin,
  loading,
  error,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleRegisterClick = () => {
    if (password !== confirmPassword) {
      setLocalError("Пароли не совпадают");
    } else {
      setLocalError("");
      onRegister({ firstName, lastName, email, password });
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
      {(localError || error) && (
        <p className={styles.error}>{localError || error}</p>
      )}
      <Button
        className={styles.registerButton}
        onClick={handleRegisterClick}
        disabled={loading}
      >
        {loading ? "Загрузка..." : "Зарегистрироваться"}
      </Button>
      <a href="http://localhost/api/auth/oauth2/vk">
        <VkIdButton />
      </a>
      <Button
        variant="text"
        className={styles.switchButton}
        onClick={onNavigateToLogin}
      >
        Уже зарегистрированы? Войти
      </Button>
    </div>
  );
};

export default Registration;
