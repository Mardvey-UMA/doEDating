import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nextUser } from "../../store/searchSlice";

import styles from "./SearchActionsContainer.module.scss";
import SearchActions from "../../components/SearchActions/SearchActions";
import { LikeType, sendLike } from "../../services/likeService";
import { RootState} from "../../store";

const SearchActionsContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { currentIndex, users } = useSelector(
    (state: RootState) => state.search
  );

  const [likeType, setLikeType] = useState<LikeType>(1);

  const handleLike = async (type: LikeType) => {
    const targetId = users[currentIndex]?.id;
    if (targetId) {
      try {
        console.log(type);
        await sendLike(targetId, 1);
      } catch (error) {
        console.error("Ошибка при отправке лайка:", error);
      } finally {
        dispatch(nextUser());
      }
    }
  };

  const handleDislike = async () => {
    const targetId = users[currentIndex]?.id;
    if (targetId) {
      try {
        await sendLike(targetId, 3);
      } catch (error) {
        console.error("Ошибка при отправке лайка:", error);
      } finally {
        dispatch(nextUser());  // Перелистываем пользователя, независимо от ошибки
      }
    }
  };

  const handleHiddenLike = async () => {
    const targetId = users[currentIndex]?.id;
    if (targetId) {
      try {
        await sendLike(targetId, 2);
      } catch (error) {
        console.error("Ошибка при отправке лайка:", error);
      } finally {
        dispatch(nextUser());  // Перелистываем пользователя, независимо от ошибки
      }
    }
  };

  return (
    <div className={styles.actionsContainer}>
      <SearchActions
        onLike={handleLike}
        onDislike={handleDislike}
        onHiddenLike={handleHiddenLike}
        likeType={likeType}
        setLikeType={setLikeType}
      />
    </div>
  );
};

export default SearchActionsContainer;