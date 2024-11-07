import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import MainPhotoBox from "../../components/MainPhotoBox";
import { addPhoto, deletePhoto } from "../../store/userSlice";
import { MainPhotoBoxContainerProps } from "./MainPhotoBoxContainer.type";
import styles from "./MainPhotoBoxContainer.module.scss";

const MainPhotoBoxContainer: React.FC<MainPhotoBoxContainerProps> = () => {
  const photos = useSelector((state: RootState) => state.user.photos);
  const dispatch = useDispatch();

  const handleAddPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newPhotoUrl = URL.createObjectURL(event.target.files[0]);
      dispatch(addPhoto(newPhotoUrl));
    }
  };

  const handleDeletePhoto = (index: number) => {
    dispatch(deletePhoto(index));
  };

  return (
    <div className={styles.container}>
      <MainPhotoBox
        photos={photos}
        onAddPhoto={handleAddPhoto}
        onDeletePhoto={handleDeletePhoto}
      />
    </div>
  );
};

export default MainPhotoBoxContainer;
