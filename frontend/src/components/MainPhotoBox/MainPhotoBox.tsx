import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import PhotoIcon from "@mui/icons-material/Photo";
import styles from "./MainPhotoBox.module.scss";
import PhotoItem from "./PhotoItem";
import AddPhotoButton from "./AddPhotoButton";
import { MainPhotoBoxProps } from "./MainPhotoBox.type.ts";

const MainPhotoBox: React.FC<MainPhotoBoxProps> = ({
  photos,
  onAddPhoto,
  onDeletePhoto,
}) => {
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);

  const handleDeletePhoto = (index: number) => {
    setExitingIndex(index); // Устанавливаем индекс удаляемого фото для анимации выхода
    setTimeout(() => {
      onDeletePhoto(index);
      setExitingIndex(null); // Сбрасываем индекс после удаления
    }, 300); // Длительность анимации выхода
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <PhotoIcon className={styles.icon} />
        <Typography variant="h6" className={styles.title}>
          Ваши фото
        </Typography>
      </Box>

      <Box className={styles.photosContainer}>
        {photos.map((photo, index) => (
          <PhotoItem
            key={index}
            src={photo}
            isExiting={index === exitingIndex} // Флаг для анимации удаления
            onDelete={() => handleDeletePhoto(index)}
          />
        ))}
        {photos.length < 9 && <AddPhotoButton onAdd={onAddPhoto} />}
      </Box>
    </Box>
  );
};

export default MainPhotoBox;
