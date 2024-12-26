import React from "react";
import { Box, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DislikeIcon from "@mui/icons-material/HeartBrokenOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import styles from "./SearchActions.module.scss";
import { LikeType } from "../../services/likeService";

interface SearchActionsProps {
  onLike: (type: LikeType) => Promise<void>;
  onDislike: () => void;
  onHiddenLike: () => void;
  likeType: LikeType;
  setLikeType: React.Dispatch<React.SetStateAction<LikeType>>;
}

const SearchActions: React.FC<SearchActionsProps> = ({
  onLike,
  onDislike,
  onHiddenLike,
  likeType,
  setLikeType,
}) => (
  <Box className={styles.actions}>
    <IconButton
      onClick={onDislike}
      className={styles.button}
      aria-label="Dislike"
    >
      <DislikeIcon className={styles.dislikeIcon} />
      <h6>Dislike</h6>
    </IconButton>

    <IconButton
      onClick={() => {
        setLikeType(1);
        onLike(1);
      }}
      className={`${styles.button} ${likeType === 1 ? styles.active : ""}`}
      aria-label="Like"
    >
      <FavoriteIcon className={styles.likeIcon} sx={{ fontSize: 25 }}/>
      <h6>Like</h6>
    </IconButton>
    
    <IconButton
      onClick={() => {
        setLikeType(2);
        onHiddenLike();
      }}
      className={`${styles.button} ${likeType === 2 ? styles.active : ""}`}
      aria-label="Hidden Like"
    >
      <FavoriteOutlinedIcon className={styles.hiddenLikeIcon} />
      <h6>Hidden Like</h6>
    </IconButton>
  </Box>
);

export default SearchActions;
