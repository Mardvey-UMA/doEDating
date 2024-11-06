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
  onEmailChange,
  onFirstNameChange,
  onLastNameChange,
  onBirthDateChange,
  onGenderChange,
  onCityChange,
  onJobChange,
  onEducationChange,
}) => {
  return (
    <Box className={styles.formContainer}>
      <InputFieldButton
        type="text"
        label="Email"
        value={email}
        //icon={<Mail />}
        onChange={(e) => onEmailChange(e.target.value)}
      />
      <InputFieldButton
        type="text"
        label="Имя"
        value={firstName}
        //icon={<Person />}
        onChange={(e) => onFirstNameChange(e.target.value)}
      />
      <InputFieldButton
        type="text"
        label="Фамилия"
        value={lastName}
        //icon={<Person />}
        onChange={(e) => onLastNameChange(e.target.value)}
      />

      <Box>
        <DateField value={birthDate} onChange={onBirthDateChange} />
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
    </Box>
  );
};

export default UserProfileFields;
