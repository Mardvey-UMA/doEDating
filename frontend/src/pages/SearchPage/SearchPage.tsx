// src/pages/SearchPage/SearchPage.tsx
import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { setUsers } from "../../store/searchSlice";
import styles from "./SearchPage.module.scss";
import usersData from "../../data/users.json";
import PhotoCarouselContainer from "../../containers/PhotoCarouselContainer/PhotoCarouselContainer";
import SearchActionsContainer from "../../containers/SearchActionsContainer/SearchActionsContainer";
import SearchInterestsContainer from "../../containers/SearchInterestsContainer/SearchInterestsContainer";
import SearchAboutMeContainer from "../../containers/SearchAboutMeContainer/SearchAboutMeContainer";

const SearchPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUsers(usersData));
  }, [dispatch]);

  return (
    <Box className={styles.container}>
      <Box className={styles.leftColumn}>
        <PhotoCarouselContainer />
        <SearchActionsContainer />
      </Box>
      <Box className={styles.rightColumn}>
        <SearchInterestsContainer />
        <SearchAboutMeContainer />
      </Box>
    </Box>
  );
};

export default SearchPage;
