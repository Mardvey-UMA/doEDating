// src/components/SearchAboutMe/SearchAboutMeContainer.tsx
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store"; // импортируем RootState для использования селектора
import styles from "./SearchAboutMeContainer.module.scss";
import SearchAboutMe from "../../components/SearchAboutMe/SearchAboutMe";

const SearchAboutMeContainer: React.FC = () => {
  const { users, currentIndex } = useSelector(
    (state: RootState) => state.search
  );

  const aboutMeText = users[currentIndex]?.aboutMe || "";

  return (
    <div className={styles.aboutMeContainer}>
      <SearchAboutMe text={aboutMeText} />
    </div>
  );
};

export default SearchAboutMeContainer;
