import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import styles from "./InterestModal.module.scss";

import ScrollBox from "../../ScrollBox/index.ts";
import { InterestModalProps } from "./InterestModal.type.ts";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/index.ts";
import { setSelectedInterests } from "../../../store/userSlice";
import interestsData from "../../../data/interests.json";
const MAX_SELECTED_INTERESTS = 10;

const InterestModal: React.FC<InterestModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const dispatch = useDispatch();
  const reduxSelectedInterestIds = useSelector(
    (state: RootState) => state.user.selectedInterests
  );

  const [selectedIds, setSelectedIds] = useState<number[]>(
    reduxSelectedInterestIds
  );

  useEffect(() => {
    if (open) {
      setSelectedIds(reduxSelectedInterestIds);
    }
  }, [open, reduxSelectedInterestIds]);

  const handleChipClick = (interestId: number) => {
    setSelectedIds((prevSelected) => {
      const isSelected = prevSelected.includes(interestId);
      if (isSelected) {
        return prevSelected.filter((id) => id !== interestId);
      } else if (prevSelected.length < MAX_SELECTED_INTERESTS) {
        return [...prevSelected, interestId];
      }
      return prevSelected;
    });
  };

  const handleSave = () => {
    dispatch(setSelectedInterests(selectedIds));
    onSave(selectedIds);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalBox}>
        <Box className={styles.header}>
          <Typography variant="h6">Выберите категории</Typography>
          <Typography variant="body2" className={styles.counter}>
            {selectedIds.length} / {MAX_SELECTED_INTERESTS}
          </Typography>
          <IconButton className={styles.closeBtn} onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <ScrollBox maxHeight="80%">
          {Object.entries(interestsData.categories).map(
            ([categoryName, category]) => (
              <div key={categoryName} className={styles.categorySection}>
                <Typography variant="subtitle1">{categoryName}</Typography>
                <div className={styles.chipsContainer}>
                  {category.items.map((interest) => {
                    const isSelected = selectedIds.includes(interest.id);
                    return (
                      <Chip
                        key={interest.id}
                        label={interest.name}
                        style={{
                          backgroundColor: interest.color,
                          color: interest.textColor,
                          fontSize: "16px",
                          border: isSelected ? `2px solid black` : "none",
                        }}
                        onClick={() => handleChipClick(interest.id)}
                        className={isSelected ? styles.selectedChip : ""}
                        deleteIcon={isSelected ? <Close /> : undefined}
                        onDelete={
                          isSelected
                            ? () => handleChipClick(interest.id)
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              </div>
            )
          )}
        </ScrollBox>

        <Button
          className={styles.saveBtn}
          variant="contained"
          onClick={handleSave}
        >
          Сохранить
        </Button>
      </Box>
    </Modal>
  );
};

export default InterestModal;
