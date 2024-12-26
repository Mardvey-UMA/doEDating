import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import StickerIcon from "@mui/icons-material/StickyNote2";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import styles from "./AboutMe.module.scss";
import { AboutMeProps } from "./AboutMe.type";

const AboutMe: React.FC<AboutMeProps> = ({ text, onTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(text);

  const maxChars = 300;

  useEffect(() => {
    setLocalText(text || "");
  }, [text]);

  const handleEditClick = () => {
    if (isEditing) {
      onTextChange(localText);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setLocalText(value);
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <StickerIcon sx={{ mr: 1 }} />
        <Typography variant="h6">О себе</Typography>
      </Box>

      {isEditing ? (
        <>
          <TextField
            multiline
            fullWidth
            value={localText}
            onChange={handleChange}
            variant="outlined"
            className={styles.textField}
          />
          <Box className={styles.charCount}>
            {localText.length}/{maxChars}
          </Box>
        </>
      ) : (
        <Typography variant="body1" className={styles.typography}>
          {text}
        </Typography>
      )}

      <IconButton
        onClick={handleEditClick}
        className={`${styles.editButton} ${isEditing ? styles.editing : ""}`}
      >
        {isEditing ? <CheckIcon /> : <EditIcon />}
      </IconButton>
    </Box>
  );
};

export default AboutMe;
