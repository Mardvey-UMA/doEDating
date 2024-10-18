import React from "react";
import RegisterForm from "../components/auth/RegisterForm";
import styles from "../../src/styles/registerPage.module.scss"; // Подключаем стили

const RegisterPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
