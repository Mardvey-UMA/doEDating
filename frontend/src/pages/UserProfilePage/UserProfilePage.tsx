// src/pages/UserProfilePage.tsx
import React from "react";
import styles from "./UserProfilePage.module.scss";
import { Box } from "@mui/material";
import UserProfileFieldsContainer from "../../containers/UserProfileFieldsContainer/UserProfileFieldsContainer";
import MainPhotoBoxContainer from "../../containers/MainPhotoBoxContainer/MainPhotoBoxContainer";
import AddInterestsContainer from "../../containers/AddInterestsContainer/AddInterestsContainer";
import AboutMeContainer from "../../containers/AboutMeContainer/AboutMeContainer";
import SaveProfileButton from "../../components/SaveProfileButton/SaveProfileButton";

const UserProfilePage: React.FC = () => {
  return (
    <Box className={styles.profileContainer}>
      <div className={styles.profileFields}>
        <UserProfileFieldsContainer />
      </div>
      <div className={styles.photoBox}>
        <MainPhotoBoxContainer />
      </div>
      <div className={styles.extraInfo}>
        <div className={styles.interests}>
          <AddInterestsContainer />
        </div>
        <div className={styles.aboutMe}>
          <AboutMeContainer />
        </div>
        <div className={styles.saveButton}>
          <SaveProfileButton />
        </div>
      </div>
    </Box>
  );
};

export default UserProfilePage;
