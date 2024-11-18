// src/components/SearchInterests/SearchInterestsContainer.tsx
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import styles from "./SearchInterestsContainer.module.scss";
import SearchInterests from "../../components/SearchInterests/SearchInterests";

const SearchInterestsContainer: React.FC = () => {
  const { users, currentIndex } = useSelector(
    (state: RootState) => state.search
  );

  return (
    <div className={styles.interestsContainer}>
      <SearchInterests interests={users[currentIndex]?.interests || []} />
    </div>
  );
};

export default SearchInterestsContainer;
