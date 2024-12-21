import React from 'react'
import { Favorite, FavoriteBorder, Loyalty} from '@mui/icons-material';
import styles from './NotificationItem.module.scss'

type NotificationType = 'match' | 'youliked' | 'liked';

interface NotificationItemProps {
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  onDismiss: () => void;
}

const iconMap = {
  match: Favorite,
  youliked: FavoriteBorder,
  liked: Loyalty,
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  title,
  message,
  time
}) => {
  const Icon = iconMap[type];
  
  return (
    <div className={`${styles.container} ${styles[type]}`}>
      <div className={styles.icon}>
        <Icon sx={{ fontSize: 50 }} color = "primary"/>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <span className={styles.time}>{time}</span>
      </div>
    </div>
  );
}