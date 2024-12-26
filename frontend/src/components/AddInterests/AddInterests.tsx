import React, { useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import InterestModal from "./AddInterestsModal/InterestModal.tsx";
import { AddInterestsProps } from "./AddInterests.type.ts";
import styles from "./AddInterests.module.scss";
import ScrollBox from "../ScrollBox/index.ts";
import interestsData from "../../data/interests.json";

const MAX_SELECTED_INTERESTS = 10;

const AddInterests: React.FC<AddInterestsProps> = ({
  selectedInterests = [], // Добавляем значение по умолчанию для безопасности
  onSaveInterests,
}) => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleDeleteInterest = (interestId: number, index: number) => {
    setRemovingIndex(index);
    setTimeout(() => {
      const updatedInterests = selectedInterests.filter(
        (id) => id !== interestId
      );
      onSaveInterests(updatedInterests);
      setRemovingIndex(null);
    }, 300);
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <StarIcon className={styles.icon} />
        <Typography variant="h6" className={styles.title}>
          Интересы
        </Typography>
      </Box>
      <ScrollBox>
        <Box className={styles.chipsContainer}>
          {(selectedInterests || []).map((interestId, index) => {
            const interest = Object.values(interestsData.categories)
              .flatMap((category) => category.items)
              .find((item) => item.id === interestId);
            if (!interest) return null;

            return (
              <Chip
                key={index}
                label={interest.name}
                className={`${styles.chip} ${
                  index === removingIndex ? styles.removing : ""
                }`}
                onDelete={() => handleDeleteInterest(interest.id, index)}
                deleteIcon={<CloseIcon sx={{ fontSize: "16px" }} />}
                style={{
                  backgroundColor: interest.color,
                  color: interest.textColor,
                }}
              />
            );
          })}

          {(selectedInterests?.length || 0) < MAX_SELECTED_INTERESTS && (
            <Chip
              label=""
              onClick={handleOpenModal}
              className={styles.addChip}
              icon={<AddIcon />}
            />
          )}
        </Box>
      </ScrollBox>
      <InterestModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={onSaveInterests}
        selectedInterests={selectedInterests}
      />
    </Box>
  );
};

export default AddInterests;
