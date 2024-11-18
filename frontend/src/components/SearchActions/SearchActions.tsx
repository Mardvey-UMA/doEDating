// src/components/SearchActions/SearchActions.tsx
import React from "react";
import { Box, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import styles from "./SearchActions.module.scss";

interface SearchActionsProps {
  onLike: () => void;
  onDislike: () => void;
  onSuperLike: () => void;
}

const SearchActions: React.FC<SearchActionsProps> = ({
  onLike,
  onDislike,
  onSuperLike,
}) => (
  <Box className={styles.actions}>
    <IconButton
      onClick={onDislike}
      className={styles.button}
      aria-label="Dislike"
    >
      <CloseIcon className={styles.dislikeIcon} />
    </IconButton>
    <IconButton
      onClick={onSuperLike}
      className={styles.button}
      aria-label="Super Like"
    >
      <StarIcon className={styles.superLikeIcon} />
    </IconButton>
    <IconButton onClick={onLike} className={styles.button} aria-label="Like">
      <FavoriteIcon className={styles.likeIcon} />
    </IconButton>
  </Box>
);

export default SearchActions;
