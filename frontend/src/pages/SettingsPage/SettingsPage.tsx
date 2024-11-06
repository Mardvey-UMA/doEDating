// src/pages/SettingsPage/SettingsPage.tsx
import React from "react";
import { Typography, Box } from "@mui/material";
import styles from "./SettingsPage.module.scss";

const SettingsPage: React.FC = () => {
  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.header}>
        Settings Page
      </Typography>
      {/* Здесь будет ваш контент настроек */}
    </Box>
  );
};

export default SettingsPage;
