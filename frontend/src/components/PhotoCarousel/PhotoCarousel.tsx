import React, { useState } from "react";
import { motion } from "framer-motion";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupsIcon from "@mui/icons-material/Groups";
import styles from "./PhotoCarousel.module.scss";
import { User } from "../../store/searchSlice";

interface PhotoCarouselProps {
  user: User;
}

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ user }) => {
  const [positionIndexes, setPositionIndexes] = useState(
    user.photos.map((_, index) => index % 3) // Только три позиции
  );

  const positions = ["center", "left", "right"];

  const handleNext = () => {
    setPositionIndexes((prevIndexes) =>
      prevIndexes.map((idx) => (idx + 1) % user.photos.length)
    );
  };

  const handleBack = () => {
    setPositionIndexes((prevIndexes) =>
      prevIndexes.map(
        (idx) => (idx - 1 + user.photos.length) % user.photos.length
      )
    );
  };

  const imageVariants = {
    center: { x: "0%", scale: 1, zIndex: 5, filter: "blur(0px) brightness(1)" },
    left: {
      x: "-45%",
      scale: 0.8,
      zIndex: 3,
      filter: "blur(8px) brightness(0.5)",
    },
    right: {
      x: "45%",
      scale: 0.8,
      zIndex: 3,
      filter: "blur(8px) brightness(0.5)",
    },
  };
  const overlayVariants = {
    center: { opacity: 1 },
    left: { opacity: 0 },
    right: { opacity: 0 },
  };

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carousel}>
        {user.photos.map((photo, index) => (
          <motion.div
            key={index}
            className={styles.slide}
            initial="center"
            animate={positions[positionIndexes[index]]}
            variants={imageVariants}
            transition={{ duration: 0.2 }}
          >
            <img src={photo} alt={`Photo ${index}`} className={styles.photo} />
            {positions[positionIndexes[index]] === "center" && (
              <motion.div
                className={styles.overlay}
                variants={overlayVariants}
                transition={{ duration: 1 }}
              >
                // {/* {*<Box className={styles.overlay}>*} */}
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
                {/* </Box> */}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PhotoCarousel;
