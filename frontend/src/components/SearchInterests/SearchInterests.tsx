// src/components/SearchInterests/SearchInterests.tsx
import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { Interest } from "../../store/userSlice";
import styles from "./SearchInterests.module.scss";
import ScrollBox from "../ScrollBox";

interface SearchInterestsProps {
  interests: Interest[];
}

const SearchInterests: React.FC<SearchInterestsProps> = ({ interests }) => (
  <Box className={styles.container}>
    <Box className={styles.header}>
      <StarIcon className={styles.icon} />
      <Typography variant="h6" className={styles.title}>
        Интересы
      </Typography>
    </Box>
    <ScrollBox>
      <Box className={styles.chipsContainer}>
        {interests.map((interest, index) => (
          <Chip
            key={index}
            label={interest.name}
            style={{
              backgroundColor: interest.color,
              color: interest.textColor,
            }}
          />
        ))}
      </Box>
    </ScrollBox>
  </Box>
);

export default SearchInterests;
