import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import { fetchUsers } from "../../store/searchSlice"; 
import styles from "./SearchPage.module.scss";
import PhotoCarouselContainer from "../../containers/PhotoCarouselContainer/PhotoCarouselContainer";
import SearchActionsContainer from "../../containers/SearchActionsContainer/SearchActionsContainer";
import SearchInterestsContainer from "../../containers/SearchInterestsContainer/SearchInterestsContainer";
import SearchAboutMeContainer from "../../containers/SearchAboutMeContainer/SearchAboutMeContainer";
import FiltersModal from "../../components/FiltersModal/FiltersModal";

const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [openFiltersModal, setOpenFiltersModal] = useState(false);

  const { users, isLoading } = useSelector((state: RootState) => state.search);
  
  useEffect(() => {
    console.log(users.length);
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  if (isLoading) {
    console.log('ЗАГРУЗКА!!!');
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress size={150} 
          color="error"
          thickness={8} />
      </Box>
    );
  }

  const handleOpenFiltersModal = () => {
    setOpenFiltersModal(true);
  };

  const handleCloseFiltersModal = () => {
    setOpenFiltersModal(false);
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.leftColumn}>
        {users.length > 0 && <PhotoCarouselContainer />}
        <SearchActionsContainer />
      </Box>
      <Box className={styles.rightColumn}>
        {users.length > 0 && <SearchInterestsContainer />}
        {users.length > 0 && <SearchAboutMeContainer />}
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenFiltersModal}
          sx={{ marginTop: 2, maxHeight: '50px' }}
        >
          Открыть фильтры
        </Button>
      </Box>

      <FiltersModal open={openFiltersModal} onClose={handleCloseFiltersModal} />
    </Box>
  );
};

export default SearchPage;
