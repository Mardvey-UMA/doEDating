import React, { useState } from "react";
import InputField from "../../components/InputField";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/formFields.module.scss";
import { register } from "../../services/authService";
import VkIdButton from "../../components/vkElements/VkButton";

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
    } else {
      setError("");
      try {
        await register({
          username: email,
          password: password,
          first_name: firstName,
          last_name: lastName,
        });
        navigate("/login"); 
      } catch (err) {
        console.error("Ошибка регистрации:", err);
        setError("Ошибка регистрации. Попробуйте снова.");
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
        <VkIdButton />
      </a>
      <Button
        variant="text"
        className={styles.switchButton}
        onClick={() => navigate("/login")}
      >
        Уже зарегистрированы? Войти
      </Button>
    </div>
  );
};

export default RegisterForm;
