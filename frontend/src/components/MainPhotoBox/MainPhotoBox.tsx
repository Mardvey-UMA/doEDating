import React, { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import PhotoIcon from "@mui/icons-material/Photo";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { uploadPhoto, removePhoto } from "../../store/userSlice";
import styles from "./MainPhotoBox.module.scss";
import PhotoItem from "./PhotoItem";
import AddPhotoButton from "./AddPhotoButton";
import { MainPhotoBoxProps } from "./MainPhotoBox.type.ts";

const MainPhotoBox: React.FC<MainPhotoBoxProps> = ({ userId, photos = [] }) => {
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false); 
  const [initialPhotoCount, setInitialPhotoCount] = useState(photos.length);
  const dispatch: AppDispatch = useDispatch();

  const handleDeletePhoto = (index: number) => {
    setExitingIndex(index);
    const photoUrl = photos[index];
    setTimeout(() => {
      dispatch(removePhoto(index, photoUrl));
      setExitingIndex(null);
    }, 300);
  };

  const handleAddPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);

      await dispatch(uploadPhoto(file));

      if (photos.length === initialPhotoCount) {
        alert("Ошибка: На фото не обнаружено лицо.");
      } else {
        setInitialPhotoCount(photos.length); 
      }

      setIsUploading(false);
    }
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
        {photos.map((photoId, index) => (
          <PhotoItem
            key={index}
            userId={userId}
            photoId={photoId}
            isExiting={index === exitingIndex}
            isLoading={false}
            onDelete={() => handleDeletePhoto(index)}
          />
        ))}
        {photos.length < 9 && (
          <Box className={styles.addPhotoContainer}>
            {isUploading ? (
              <CircularProgress sx={{ color: 'black' }}/>
            ) : (
              <AddPhotoButton onAdd={handleAddPhoto} />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MainPhotoBox;
