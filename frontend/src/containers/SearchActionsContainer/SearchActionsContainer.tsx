// src/components/SearchActions/SearchActionsContainer.tsx
import React from "react";
import { useDispatch } from "react-redux";
import { nextUser } from "../../store/searchSlice";
import styles from "./SearchActionsContainer.module.scss";
import SearchActions from "../../components/SearchActions/SearchActions";

const SearchActionsContainer: React.FC = () => {
  const dispatch = useDispatch();

  const handleAction = () => {
    dispatch(nextUser());
  };

  return (
    <div className={styles.actionsContainer}>
      <SearchActions
        onLike={handleAction}
        onDislike={handleAction}
        onSuperLike={handleAction}
      />
    </div>
  );
};

export default SearchActionsContainer;
