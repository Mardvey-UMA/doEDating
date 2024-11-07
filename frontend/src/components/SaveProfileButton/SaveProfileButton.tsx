// src/components/SaveProfileButton/SaveProfileButton.tsx
import React from "react";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import styles from "./SaveProfileButton.module.scss";

const SaveProfileButton: React.FC = () => {
  const userProfile = useSelector((state: RootState) => state.user);

  const isProfileComplete = () => {
    // Проверка обязательных полей пользователя
    const requiredFields = [
      "email",
      "firstName",
      "lastName",
      "birthDate",
      "gender",
      "city",
      "job",
      "education",
      "aboutMe",
    ];

    const hasRequiredFields = requiredFields.every((field) =>
      Boolean(userProfile[field as keyof typeof userProfile])
    );

    // Проверка на минимум 3 интереса и хотя бы одно фото
    const hasEnoughInterests = userProfile.selectedInterests.length >= 3;
    const hasPhoto = userProfile.photos.length > 0;

    return hasRequiredFields && hasEnoughInterests && hasPhoto;
  };

  const handleSave = () => {
    if (isProfileComplete()) {
      console.log(
        "Профиль пользователя:",
        JSON.stringify(userProfile, null, 2)
      );
    } else {
      alert(
        "Заполните все поля, выберите хотя бы 3 интереса и добавьте хотя бы одно фото."
      );
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleSave}
      className={styles.saveButton}
    >
      Сохранить
    </Button>
  );
};

export default SaveProfileButton;
