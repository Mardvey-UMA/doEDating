import React from "react";
import InputFieldButton from "../InputFieldButton";
import GenderField from "../GenderField";
import DateField from "../DateField";
import { Box } from "@mui/material";
// import {
//   Mail,
//   Person,
//   LocationOn,
//   AttachFile,
//   Bookmark,
// } from "@mui/icons-material";
import styles from "./UserProfileFields.module.scss";
import { UserProfileFieldsProps } from "./UserProfileFields.type.ts";

const UserProfileFields: React.FC<UserProfileFieldsProps> = ({
  email,
  firstName,
  lastName,
  birthDate,
  gender,
  city,
  job,
  education,
  telegramId,
  onEmailChange,
  onFirstNameChange,
  onLastNameChange,
  onBirthDateChange,
  onGenderChange,
  onCityChange,
  onJobChange,
  onEducationChange,
  onTelegramIdChange,
}) => {
  console.log("Тип данных birthDate:", typeof birthDate);
  console.log("Значение birthDate:", birthDate);

  const correctedBirthDate = birthDate ? new Date(birthDate) : new Date();

  return (
    <Box className={styles.formContainer}>
      <InputFieldButton
        type="text"
        label="Email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
      />
      <InputFieldButton
        type="text"
        label="Имя"
        value={firstName}
        onChange={(e) => onFirstNameChange(e.target.value)}
      />
      <InputFieldButton
        type="text"
        label="Фамилия"
        value={lastName}
        onChange={(e) => onLastNameChange(e.target.value)}
      />

      <Box>
        <DateField value={correctedBirthDate} onChange={onBirthDateChange} />
      </Box>

      <Box>
        <GenderField
          value={gender}
          onChange={(e) => onGenderChange(e.target.value)}
        />
      </Box>

      <InputFieldButton
        type="text"
        label="Город"
        value={city}
        //icon={<LocationOn />}
        onChange={(e) => onCityChange(e.target.value)}
      />
      <InputFieldButton
        type="text"
        label="Работа"
        value={job}
        //icon={<AttachFile />}
        onChange={(e) => onJobChange(e.target.value)}
      />
      <InputFieldButton
        type="text"
        label="Образование"
        value={education}
        //icon={<Bookmark />}
        onChange={(e) => onEducationChange(e.target.value)}
      />
      <InputFieldButton
        type="text"
        label="Telegram ID"
        value={telegramId} 
        onChange={(e) => onTelegramIdChange(e.target.value)} 
      />
    </Box>
  );
};

export default UserProfileFields;
