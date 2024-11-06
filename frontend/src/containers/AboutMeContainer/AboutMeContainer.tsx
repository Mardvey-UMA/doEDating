import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import AboutMe from "../../components/AboutMe";
import { setAboutMe } from "../../store/userSlice";
import { AboutMeContainerProps } from "./AboutMeContainer.type";
import styles from "./AboutMeContainer.module.scss";

const AboutMeContainer: React.FC<AboutMeContainerProps> = () => {
  const text = useSelector((state: RootState) => state.user.aboutMe);
  const dispatch = useDispatch();

  const handleTextChange = (newText: string) => {
    dispatch(setAboutMe(newText));
  };

  return (
    <div className={styles.container}>
      <AboutMe text={text} onTextChange={handleTextChange} />
    </div>
  );
};

export default AboutMeContainer;
