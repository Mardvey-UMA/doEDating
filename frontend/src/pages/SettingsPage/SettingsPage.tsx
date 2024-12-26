import React from "react";
import { Typography, Box } from "@mui/material";
import LogoutButton from "../../components/LogoutButton/LogoutButton"; // Импорт кнопки
import styles from "./SettingsPage.module.scss";

const SettingsPage: React.FC = () => {
  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.header}>
        Настройки
      </Typography>
      <LogoutButton />
    </Box>
  );
};

export default SettingsPage;
