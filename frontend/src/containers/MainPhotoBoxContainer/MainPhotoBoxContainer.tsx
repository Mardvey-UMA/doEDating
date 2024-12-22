import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import MainPhotoBox from "../../components/MainPhotoBox";
import { removePhoto, uploadPhoto } from "../../store/userSlice";
import { MainPhotoBoxContainerProps } from "./MainPhotoBoxContainer.type";
import styles from "./MainPhotoBoxContainer.module.scss";
import { AppDispatch } from "../../store";
const MainPhotoBoxContainer: React.FC<MainPhotoBoxContainerProps> = () => {
  const photos = useSelector((state: RootState) => state.user.photos);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const dispatchApp: AppDispatch = useDispatch();
  const handleAddPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      dispatchApp(uploadPhoto(file));
    }
  };

  const handleDeletePhoto = (index: number) => {
    const photoUrl = photos[index];
    dispatchApp(removePhoto(index, photoUrl));
  };

  return (
    <div className={styles.container}>
      <MainPhotoBox
        userId={userId ?? 0}
        photos={photos}
        onAddPhoto={handleAddPhoto}
        onDeletePhoto={handleDeletePhoto}
      />
    </div>
  );
};

export default MainPhotoBoxContainer;
