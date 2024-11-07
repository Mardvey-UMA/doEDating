import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import AddInterests from "../../components/AddInterests";
import { setSelectedInterests, Interest } from "../../store/userSlice";
import styles from "./AddInterestsContainer.module.scss";
import { AddInterestsContainerProps } from "./AddInterestsContainer.type.ts";

const AddInterestsContainer: React.FC<AddInterestsContainerProps> = () => {
  const selectedInterests = useSelector(
    (state: RootState) => state.user.selectedInterests
  );
  const dispatch = useDispatch();

  const handleSaveInterests = (interests: Interest[]) => {
    dispatch(setSelectedInterests(interests));
  };

  return (
    <div className={styles.container}>
      <AddInterests
        selectedInterests={selectedInterests}
        onSaveInterests={handleSaveInterests}
      />
    </div>
  );
};

export default AddInterestsContainer;
