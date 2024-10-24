import React, { useState } from "react";
import { Modal, Box, Button, Chip, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import styles from "../../src/styles/interestModal.module.scss"; // Импортируем стили как объект
import interestsData from "./interests.json";
import { darken } from "polished"; // Импортируем polished для затемнения цвета

interface Interest {
  name: string;
  color: string;
  textColor: string;
}

interface Category {
  items: Interest[];
}

interface InterestsJSON {
  categories: Record<string, Category>;
}

interface InterestModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (selected: Interest[]) => void;
  selectedInterests: Interest[];
}

const InterestModal: React.FC<InterestModalProps> = ({
  open,
  onClose,
  onSave,
  selectedInterests,
}) => {
  const [selected, setSelected] = useState<Interest[]>(selectedInterests);
  const [data] = useState<InterestsJSON>(interestsData);

  const handleChipClick = (interest: Interest) => {
    setSelected((prevSelected) =>
      prevSelected.some((i) => i.name === interest.name)
        ? prevSelected.filter((i) => i.name !== interest.name)
        : [...prevSelected, interest]
    );
  };

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalBox}>
        <h2>Выберите категории</h2>
        <IconButton className={styles.closeBtn} onClick={onClose}>
          <Close />
        </IconButton>
        <div className={styles.categoriesContainer}>
          {Object.entries(data.categories).map(([categoryName, category]) => (
            <div key={categoryName} className={styles.categorySection}>
              <h3>{categoryName}</h3>
              <div className={styles.chipsContainer}>
                {category.items.map((interest) => (
                  <Chip
                    key={interest.name}
                    label={interest.name}
                    style={{
                      backgroundColor: interest.color,
                      color: interest.textColor,
                      fontSize: "16px", 
                      border: selected.some((i) => i.name === interest.name)
                        ? `2px solid ${darken(0.15, interest.color)}`
                        : "none",
                    }}
                    onClick={() => handleChipClick(interest)}
                    className={
                      selected.some((i) => i.name === interest.name)
                        ? styles.selectedChip
                        : ""
                    }
                    deleteIcon={
                      selected.some((i) => i.name === interest.name) ? (
                        <Close />
                      ) : undefined
                    }
                    onDelete={
                      selected.some((i) => i.name === interest.name)
                        ? () => handleChipClick(interest)
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button
          className={styles.saveBtn}
          variant="contained"
          color="primary"
          onClick={handleSave}
        >
          Сохранить
        </Button>
      </Box>
    </Modal>
  );
};

export default InterestModal;
