import React from "react";
import LoginForm from "../components/LoginForm";
import styles from "../../src/styles/loginPage.module.scss";

const LoginPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
