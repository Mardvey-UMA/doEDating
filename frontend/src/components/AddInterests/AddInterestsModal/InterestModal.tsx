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
import interestsData from "../interests.json";
import { invert } from "polished";
import ScrollBox from "../../ScrollBox/index.ts";
import { InterestModalProps, Interest } from "./InterestModal.type.ts";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/index.ts";
import { setSelectedInterests } from "../../../store/userSlice";

const MAX_SELECTED_INTERESTS = 10;

const InterestModal: React.FC<InterestModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.theme);
  const reduxSelectedInterests = useSelector(
    (state: RootState) => state.user.selectedInterests
  );

  const [selected, setSelected] = useState<Interest[]>(reduxSelectedInterests);

  // Синхронизация с Redux при открытии модального окна
  useEffect(() => {
    if (open) {
      setSelected(reduxSelectedInterests);
    }
  }, [open, reduxSelectedInterests]);

  const handleChipClick = (interest: Interest) => {
    setSelected((prevSelected) => {
      const isSelected = prevSelected.some((i) => i.name === interest.name);

      // Удаление, если уже выбрано, или ограничение на 10 тегов
      if (isSelected) {
        return prevSelected.filter((i) => i.name !== interest.name);
      } else if (prevSelected.length < MAX_SELECTED_INTERESTS) {
        return [...prevSelected, interest];
      }
      return prevSelected; // Если 10 уже выбрано, не добавляем новый тег
    });
  };

  const handleSave = () => {
    dispatch(setSelectedInterests(selected));
    onSave(selected);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalBox}>
        {/* Счетчик выбранных интересов */}
        <Box className={styles.header}>
          <Typography variant="h6">Выберите категории</Typography>
          <Typography variant="body2" className={styles.counter}>
            {selected.length} / {MAX_SELECTED_INTERESTS}
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
                    const isSelected = selected.some(
                      (i) => i.name === interest.name
                    );
                    const backgroundColor =
                      currentTheme === "dark"
                        ? invert(interest.color)
                        : interest.color;

                    const textColor =
                      currentTheme === "dark"
                        ? invert(interest.textColor)
                        : interest.textColor;

                    return (
                      <Chip
                        key={interest.name}
                        label={interest.name}
                        style={{
                          backgroundColor: backgroundColor,
                          color: textColor,
                          fontSize: "16px",
                          border: isSelected
                            ? `2px solid ${invert(backgroundColor)}`
                            : "none",
                        }}
                        onClick={() => handleChipClick(interest)}
                        className={isSelected ? styles.selectedChip : ""}
                        deleteIcon={isSelected ? <Close /> : undefined}
                        onDelete={
                          isSelected
                            ? () => handleChipClick(interest)
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
