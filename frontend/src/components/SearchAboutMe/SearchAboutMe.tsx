// src/components/SearchAboutMe/SearchAboutMe.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import styles from "./SearchAboutMe.module.scss";

interface SearchAboutMeProps {
  text: string;
}

const SearchAboutMe: React.FC<SearchAboutMeProps> = ({ text }) => (
  <Box className={styles.container}>
    <Box className={styles.header}>
      <EmojiEmotionsIcon className={styles.icon} />
      <Typography variant="h6" className={styles.title}>
        О себе
      </Typography>
    </Box>
    <Typography className={styles.text}>{text}</Typography>
  </Box>
);

export default SearchAboutMe;
