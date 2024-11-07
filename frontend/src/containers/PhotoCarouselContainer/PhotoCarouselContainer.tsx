// src/components/PhotoCarousel/PhotoCarouselContainer.tsx
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import styles from "./PhotoCarouselContainer.module.scss";
import PhotoCarousel from "../../components/PhotoCarousel/PhotoCarousel";

const PhotoCarouselContainer: React.FC = () => {
  const { users, currentIndex } = useSelector(
    (state: RootState) => state.search
  );

  if (!users.length) return null;

  return (
    <div className={styles.carouselContainer}>
      <PhotoCarousel user={users[currentIndex]} />
    </div>
  );
};

export default PhotoCarouselContainer;
