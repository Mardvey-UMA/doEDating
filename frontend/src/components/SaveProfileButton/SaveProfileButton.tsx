// SaveProfileButton.tsx
import React from "react";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { updateUser } from "../../services/userService";
import styles from "./SaveProfileButton.module.scss";

const SaveProfileButton: React.FC = () => {
  const userProfile = useSelector((state: RootState) => state.user);

  const isProfileComplete = () => {
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
      "selectedInterests",
      "telegramId",
    ];
    const hasRequiredFields = requiredFields.every((field) =>
      Boolean(userProfile[field as keyof typeof userProfile])
    );
    const hasEnoughInterests = userProfile.selectedInterests.length >= 3;
    const hasPhoto = userProfile.photos.length > 0;

    return hasRequiredFields && hasEnoughInterests && hasPhoto;
  };

  const handleSave = async () => {
    if (!userProfile.id) {
      alert("Не удалось сохранить профиль: ID пользователя отсутствует");
      return;
    }

    if (isProfileComplete()) {
      try {
        await updateUser(userProfile.id, {
          email: userProfile.email,
          first_name: userProfile.firstName,
          last_name: userProfile.lastName,
          birth_date: userProfile.birthDate,
          gender: userProfile.gender,
          city: userProfile.city,
          job: userProfile.job,
          education: userProfile.education,
          telegram_id: userProfile.telegramId,
          about_me: userProfile.aboutMe,
          selected_interests: userProfile.selectedInterests,
          photos: userProfile.photos,
        });
        console.log("Профиль пользователя успешно обновлен");
        console.log(
          userProfile.birthDate,
          userProfile.aboutMe,
          userProfile.selectedInterests
        );
      } catch (error) {
        console.error("Ошибка при обновлении профиля пользователя:", error);
      }
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
