import React from 'react';
import { NotificationItem } from './NotificationItem';
import styles from './NotificationList.module.scss';

interface Notification {
  id: string;
  type: 'match' | 'youliked' | 'liked';
  title: string;
  message: string;
  time: string;
}

interface NotificationListProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onDismiss
}) => {
  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          {...notification}
          onDismiss={() => onDismiss(notification.id)}
        />
      ))}
    </div>
  );
}