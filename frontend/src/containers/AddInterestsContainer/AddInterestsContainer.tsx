import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import AddInterests from "../../components/AddInterests";
import { setSelectedInterests } from "../../store/userSlice";
import styles from "./AddInterestsContainer.module.scss";
import { AddInterestsContainerProps } from "./AddInterestsContainer.type.ts";

const AddInterestsContainer: React.FC<AddInterestsContainerProps> = () => {
  // Получаем только id выбранных интересов
  const selectedInterests = useSelector(
    (state: RootState) => state.user.selectedInterests
  );
  const dispatch = useDispatch();

  // Сохраняем выбранные интересы по их id
  const handleSaveInterests = (interestIds: number[]) => {
    dispatch(setSelectedInterests(interestIds));
  };

  return (
    <div className={styles.container}>
      <AddInterests
        selectedInterests={selectedInterests || []} // Передаем id интересов
        onSaveInterests={handleSaveInterests} // Передаем функцию сохранения
      />
    </div>
  );
};

export default AddInterestsContainer;
