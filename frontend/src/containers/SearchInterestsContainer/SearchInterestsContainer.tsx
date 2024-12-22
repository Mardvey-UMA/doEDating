// src/components/SearchInterests/SearchInterestsContainer.tsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Interest } from "../../store/searchSlice"; // типы интересов
import SearchInterests from "../../components/SearchInterests/SearchInterests";
import styles from "./SearchInterestsContainer.module.scss";
import { fetchInterests } from "../../services/fetchInterests";

const SearchInterestsContainer: React.FC = () => {
  const { users, currentIndex } = useSelector(
    (state: RootState) => state.search
  );

  const [interests, setInterests] = useState<Interest[]>([]);

  useEffect(() => {
    const loadInterests = async () => {
      const userInterests = await fetchInterests(users[currentIndex]?.id || 0);
      setInterests(userInterests);
    };

    if (users.length > 0 && users[currentIndex]) {
      loadInterests();
    }
  }, [users, currentIndex]);

  return (
    <div className={styles.interestsContainer}>
      <SearchInterests interests={interests} />
    </div>
  );
};

export default SearchInterestsContainer;
