// src/components/PhotoCarousel/PhotoCarousel.tsx
import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { User } from "../../store/searchSlice";
import styles from "./PhotoCarousel.module.scss";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupsIcon from "@mui/icons-material/Groups";

interface PhotoCarouselProps {
  user: User;
}

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ user }) => {
  const [currentPhoto, setCurrentPhoto] = useState(0);

  const nextPhoto = () => {
    setCurrentPhoto((currentPhoto + 1) % user.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhoto(
      (currentPhoto - 1 + user.photos.length) % user.photos.length
    );
  };

  const showBlurredSidePhotos = user.photos.length >= 3;

  return (
    <Box className={styles.carousel}>
      {showBlurredSidePhotos && (
        <img
          src={
            user.photos[
              (currentPhoto - 1 + user.photos.length) % user.photos.length
            ]
          }
          alt="Previous blurred"
          className={`${styles.photo} ${styles.blurredPhoto} ${styles.leftBlurredPhoto}`}
        />
      )}

      <Box
        className={`${styles.photoWrapper} ${
          showBlurredSidePhotos ? styles.mainPhotoWrapper : ""
        }`}
      >
        <img
          src={user.photos[currentPhoto]}
          alt="User photo"
          className={`${styles.photo} ${styles.mainPhoto}`}
        />
        <Box className={styles.overlay}>
          <Box className={styles.buttonsContainer}>
            <IconButton
              onClick={prevPhoto}
              className={`${styles.navButton} ${styles.prevButton}`}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton
              onClick={nextPhoto}
              className={`${styles.navButton} ${styles.nextButton}`}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
          <Typography variant="h5" className={styles.name}>
            {user.name} {user.age}
          </Typography>
          <Box className={styles.infoRow}>
            <LocationOnIcon className={styles.icon} />
            <Typography variant="body2">{user.city}</Typography>
          </Box>
          <Box className={styles.infoRow}>
            <GroupsIcon className={styles.icon} />
            <Typography variant="body2">{user.education}</Typography>
          </Box>
        </Box>
      </Box>

      {showBlurredSidePhotos && (
        <img
          src={user.photos[(currentPhoto + 1) % user.photos.length]}
          alt="Next blurred"
          className={`${styles.photo} ${styles.blurredPhoto} ${styles.rightBlurredPhoto}`}
        />
      )}
    </Box>
  );
};

export default PhotoCarousel;
