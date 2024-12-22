import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import UserProfileFields from "../../components/UserProfileFields";
import {
  updateEmail,
  updateFirstName,
  updateLastName,
  updateBirthDate,
  updateGender,
  updateCity,
  updateJob,
  updateEducation,
  updateTelegramId,
} from "../../store/userSlice";
import { UserProfileFieldsContainerProps } from "./UserProfileFieldsContainer.type";
import styles from "./UserProfileFieldsContainer.module.scss";

const UserProfileFieldsContainer: React.FC<
  UserProfileFieldsContainerProps
> = () => {
  const dispatch = useDispatch();
  const {
    email,
    firstName,
    lastName,
    birthDate,
    gender,
    city,
    job,
    education,
    telegramId,
  } = useSelector((state: RootState) => state.user);

  return (
    <div className={styles.container}>
      <UserProfileFields
        email={email}
        firstName={firstName}
        lastName={lastName}
        birthDate={birthDate}
        gender={gender}
        city={city}
        job={job}
        education={education}
        telegramId={telegramId}
        onEmailChange={(value) => dispatch(updateEmail(value))}
        onFirstNameChange={(value) => dispatch(updateFirstName(value))}
        onLastNameChange={(value) => dispatch(updateLastName(value))}
        onBirthDateChange={(date) => dispatch(updateBirthDate(date))}
        onGenderChange={(value) => dispatch(updateGender(value))}
        onCityChange={(value) => dispatch(updateCity(value))}
        onJobChange={(value) => dispatch(updateJob(value))}
        onEducationChange={(value) => dispatch(updateEducation(value))}
        onTelegramIdChange={(value) => dispatch(updateTelegramId(value))}
      />
    </div>
  );
};

export default UserProfileFieldsContainer;
