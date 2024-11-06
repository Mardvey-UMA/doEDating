import React, { useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import InterestModal from "./AddInterestsModal/InterestModal.tsx";
import { AddInterestsProps } from "./AddInterests.type.ts";
import styles from "./AddInterests.module.scss";
import ScrollBox from "../ScrollBox/index.ts";
const MAX_SELECTED_INTERESTS = 10;
const AddInterests: React.FC<AddInterestsProps> = ({
  selectedInterests,
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

  const handleDeleteInterest = (interestToDelete: string, index: number) => {
    setRemovingIndex(index); // Устанавливаем индекс для анимации удаления
    setTimeout(() => {
      const updatedInterests = selectedInterests.filter(
        (interest) => interest.name !== interestToDelete
      );
      onSaveInterests(updatedInterests);
      setRemovingIndex(null); // Сбрасываем индекс после удаления
    }, 300); // Длительность анимации
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
          {selectedInterests.map((interest, index) => (
            <Chip
              key={index}
              label={interest.name}
              className={`${styles.chip} ${
                index === removingIndex ? styles.removing : ""
              }`}
              onDelete={() => handleDeleteInterest(interest.name, index)}
              deleteIcon={<CloseIcon sx={{ fontSize: "16px" }} />}
              style={{
                backgroundColor: interest.color,
                color: interest.textColor,
              }}
            />
          ))}

          {selectedInterests.length <= MAX_SELECTED_INTERESTS && (
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
