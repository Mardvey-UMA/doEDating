import React, { useState } from "react";
import { Button, Chip } from "@mui/material";
import InterestModal from "./InterestModal";
import styles from "../../src/styles/userProfileForm.module.scss";

interface Interest {
  name: string;
  color: string;
  textColor: string;
}

const UserProfileForm = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleSaveInterests = (interests: Interest[]) => {
    setSelectedInterests(interests);
  };

  return (
    <div className={styles.userProfileForm}>
      <h2>Выбранные интересы</h2>
      <div className={styles.selectedInterests}>
        {selectedInterests.map((interest) => (
          <Chip
            key={interest.name}
            label={interest.name}
            style={{
              backgroundColor: interest.color,
              color: interest.textColor,
              fontSize: "16px",
            }}
            onDelete={() =>
              setSelectedInterests((prev) =>
                prev.filter((i) => i.name !== interest.name)
              )
            }
          />
        ))}
      </div>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Добавить интересы
      </Button>

      {/* Модальное окно для выбора интересов */}
      <InterestModal
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleSaveInterests}
        selectedInterests={selectedInterests}
      />
    </div>
  );
};

export default UserProfileForm;
