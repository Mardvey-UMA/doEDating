// src/pages/RegisterPage.tsx
import React from "react";
import styles from "./RegisterPage.module.scss";
import RegistrationContainer from "../../containers/RegistrationContainer/RegistrationContainer";

const RegisterPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <RegistrationContainer />
    </div>
  );
};

export default RegisterPage;
