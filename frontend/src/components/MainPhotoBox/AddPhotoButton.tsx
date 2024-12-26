// src/components/AddPhotoButton/AddPhotoButton.tsx
import React from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import styles from "./AddPhotoButton.module.scss";
import { AddPhotoButtonProps } from "./AddPhotoButton.type.ts";

const AddPhotoButton: React.FC<AddPhotoButtonProps> = ({ onAdd }) => (
  <Box className={styles.addPhotoButton}>
    <input
      accept="image/*"
      type="file"
      onChange={onAdd} 
      className={styles.inputFile}
    />
    <AddIcon className={styles.addIcon} />
  </Box>
);

export default AddPhotoButton;