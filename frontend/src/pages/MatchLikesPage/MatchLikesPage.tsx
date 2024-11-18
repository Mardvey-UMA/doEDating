// src/pages/MatchLikesPage/MatchLikesPage.tsx
import React from "react";
import { Typography, Box } from "@mui/material";
import styles from "./MatchLikesPage.module.scss";

const MatchLikesPage: React.FC = () => {
  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.header}>
        Match Likes Page
      </Typography>
      {/* Здесь будет ваш контент матчей и лайков */}
    </Box>
  );
};

export default MatchLikesPage;
