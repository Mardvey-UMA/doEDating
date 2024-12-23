import React, { useState } from 'react';
import { NotificationList } from '../../components/Notifications/NotificationList';
import styles from './NotificationPage.module.scss'

interface Notification {
  id: string;
  type: 'match' | 'youliked' | 'liked';
  title: string;
  message: string;
  time: string;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'match',
    title: 'У вас Мэтч!',
    message: 'Кто-то лайкнул вас в ответ! Посмотрите, кто это: id',
    time: '2 minutes ago'
  },
  {
    id: '2',
    type: 'youliked',
    title: 'Вы лайкнули',
    message: 'Вы лайкнули пользователя id',
    time: '5 minutes ago'
  },
  {
    id: '3',
    type: 'liked',
    title: 'Вас лайкнули',
    message: 'Вас кто-то лайкнул: id',
    time: '10 minutes ago'
  },
];

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.badge}>
              {notifications.length} new
          </span>
        </div>
          
          {notifications.length > 0 ? (
            <NotificationList
              notifications={notifications}
              onDismiss={handleDismiss}
            />
          ) : (
            <div className={styles.emptyState}>
              <p>Пока что здесь пусто...</p>
            </div>
          )}
      </div>
  );
}

export default NotificationPage