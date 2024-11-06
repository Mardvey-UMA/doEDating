// src/pages/LoginPage.tsx
import React from "react";
import styles from "./LoginPage.module.scss";
import LoginContainer from "../../containers/LoginContainer/LoginContainer";

const LoginPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <LoginContainer />
    </div>
  );
};

export default LoginPage;
