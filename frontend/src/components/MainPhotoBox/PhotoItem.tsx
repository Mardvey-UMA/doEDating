import React from "react";
import { Box, IconButton, keyframes } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./PhotoItem.module.scss";
import { PhotoItemProps } from "./PhotoItem.type.ts";

// Создаем анимации появления и исчезновения
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
`;

const PhotoItem: React.FC<PhotoItemProps & { isExiting: boolean }> = ({
  src,
  onDelete,
  isExiting,
}) => (
  <Box
    className={styles.photoItem}
    sx={{
      animation: `${isExiting ? fadeOut : fadeIn} 300ms ease`,
    }}
  >
    <img src={src} alt="uploaded" className={styles.image} />
    <IconButton onClick={onDelete} className={styles.deleteButton}>
      <CloseIcon className={styles.deleteIcon} />
    </IconButton>
  </Box>
);

export default PhotoItem;
