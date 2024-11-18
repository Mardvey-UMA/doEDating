// src/pages/NotificationPage/NotificationPage.tsx
import React from "react";
import { Typography, Box } from "@mui/material";
import styles from "./NotificationPage.module.scss";

const NotificationPage: React.FC = () => {
  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.header}>
        Notification Page
      </Typography>
      {/* Здесь будет ваш контент уведомлений */}
    </Box>
  );
};

export default NotificationPage;
