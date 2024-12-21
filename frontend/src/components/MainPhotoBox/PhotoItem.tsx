import React, { useEffect, useState } from "react";
import { Box, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./PhotoItem.module.scss";
import { PhotoItemProps } from "./PhotoItem.type.ts";
import { fetchWithTokenPhoto } from "../../services/fetchService";

const PhotoItem: React.FC<PhotoItemProps> = ({
  userId,
  photoId,
  onDelete,
  isLoading,
  isExiting,
}) => {
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(isLoading);

  useEffect(() => {
    const loadPhoto = async () => {
      setLoading(true);
      try {
        const photoName = photoId.split("/").pop();
        const photoUrl = `/api/users/${userId}/photo/${photoName}`;
        const response = await fetchWithTokenPhoto(photoUrl, {
          method: "GET",
          credentials: "include",
        });

        const url = URL.createObjectURL(response);
        setPhotoSrc(url);
      } catch (error) {
        console.error("Ошибка загрузки фото в интерфейс:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading) loadPhoto();

    return () => {
      if (photoSrc) {
        URL.revokeObjectURL(photoSrc);
      }
    };
  }, [userId, photoId]);

  return (
    <Box className={`${styles.photoItem} ${isExiting ? styles.exiting : ""}`}>
      {loading ? (
        <CircularProgress />
      ) : (
        <img src={photoSrc!} alt="uploaded" className={styles.image} />
      )}
      <IconButton onClick={onDelete} className={styles.deleteButton}>
        <CloseIcon className={styles.deleteIcon} />
      </IconButton>
    </Box>
  );
};

export default PhotoItem;
