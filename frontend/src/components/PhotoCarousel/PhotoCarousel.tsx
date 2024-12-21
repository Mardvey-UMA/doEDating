import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import GroupsIcon from "@mui/icons-material/Groups"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import { Box, IconButton, Typography } from "@mui/material"
import { motion } from "framer-motion"
import React, { useEffect, useState } from "react"
import { fetchWithTokenPhoto } from "../../services/fetchService"
import { User } from "../../store/searchSlice"
import styles from "./PhotoCarousel.module.scss"

interface PhotoCarouselProps {
  user: User;
}

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ user }) => {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(Math.floor(user.photos.length / 2));

  //const positions = ["center", "left", "right"];

  const imageVariants = {
    center: { x: "0%", scale: 1, zIndex: 5, filter: "blur(0px)" },
    left: { x: "-60%", scale: 0.8, zIndex: 3, filter: "blur(8px)" },
    right: { x: "60%", scale: 0.8, zIndex: 3, filter: "blur(8px)" },
  };

  const overlayVariants = {
    center: { opacity: 1 },
    left: { opacity: 0 },
    right: { opacity: 0 },
  };

  useEffect(() => {
    const loadAllPhotos = async () => {
      const urls: string[] = [];
      for (const photoId of user.photos) {
        const photoName = photoId.split("/").pop();
        const photoUrl = `/api/users/${user.id}/photo/${photoName}`;
        try {
          const response = await fetchWithTokenPhoto(photoUrl, {
            method: "GET",
            credentials: "include",
          });
          const url = URL.createObjectURL(response);
          urls.push(url);
        } catch (error) {
          console.error("Failed to load photo:", error);
        }
      }
      setPhotoUrls(urls);
    };

    if (user.photos.length > 0) {
      loadAllPhotos();
    }
  }, [user.id, user.photos]);

  const handleNext = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photoUrls.length);
  };

  const handleBack = () => {
    setCurrentPhotoIndex(
      (prevIndex) => (prevIndex - 1 + photoUrls.length) % photoUrls.length
    );
  };

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carousel}>
        {photoUrls.map((photoUrl, index) => (
          <motion.div
            key={index}
            className={styles.slide}
            initial="center"
            animate={
              index === currentPhotoIndex
                ? "center"
                : index < currentPhotoIndex
                ? "left"
                : "right"
            }
            variants={imageVariants}
            transition={{ duration: 0.5 }}
          >
            <img
              src={photoUrl}
              alt={`Photo ${index}`}
              className={styles.photo}
            />
            {index === currentPhotoIndex && (
              <motion.div
                className={styles.overlay}
                variants={overlayVariants}
                transition={{ duration: 1 }}
              >
                <Box className={styles.buttonsContainer}>
                  <IconButton
                    onClick={handleBack}
                    className={`${styles.navButton} ${styles.prevButton}`}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleNext}
                    className={`${styles.navButton} ${styles.nextButton}`}
                  >
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Box>
                <Typography variant="h5" className={styles.name}>
                  {user.firstName} {user.age}
                </Typography>
                <Box className={styles.infoRow}>
                  <LocationOnIcon className={styles.icon} />
                  <Typography variant="body2">{user.city}</Typography>
                </Box>
                <Box className={styles.infoRow}>
                  <GroupsIcon className={styles.icon} />
                  <Typography variant="body2">{user.education}</Typography>
                </Box>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PhotoCarousel;
