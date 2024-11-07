// src/components/SearchAboutMe/SearchAboutMeContainer.tsx
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

import styles from "./SearchAboutMeContainer.module.scss";
import SearchAboutMe from "../../components/SearchAboutMe/SearchAboutMe";

const SearchAboutMeContainer: React.FC = () => {
  const { users, currentIndex } = useSelector(
    (state: RootState) => state.search
  );

  return (
    <div className={styles.aboutMeContainer}>
      <SearchAboutMe text={users[currentIndex]?.aboutMe || ""} />
    </div>
  );
};

export default SearchAboutMeContainer;
