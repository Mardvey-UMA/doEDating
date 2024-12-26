import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { fetchWithToken } from '../../services/fetchService';
import './NotificationPage.module.scss';

interface Like {
  id: number;
  firstUserId: number;
  secondUserId: number;
  typeOfLike: number;
  createdAt: string;
}

interface User {
  id: number;
  first_name: string;
  age: number;
  gender: string;
  city: string;
}

const NotificationPage: React.FC = () => {
  const [sentLikes, setSentLikes] = useState<Like[]>([]);
  const [receivedLikes, setReceivedLikes] = useState<Like[]>([]);
  const [usersInfo, setUsersInfo] = useState<Record<number, User>>({});

  // Функция для получения лайков
  const fetchLikes = useCallback(async () => {
    try {
      const sentLikesResponse = await fetchWithToken<Like[]>('/api/likes/myLikes');
      setSentLikes(sentLikesResponse || []);

      const receivedLikesResponse = await fetchWithToken<Like[]>('/api/likes');
      setReceivedLikes(receivedLikesResponse || []);
    } catch (error) {
      console.error('Ошибка при получении лайков', error);
    }
  }, []);

  // Функция для получения информации о пользователе
  const fetchUserInfo = async (userId: number) => {
    try {
      const userInfo = await fetchWithToken<User>(`/api/users/info/${userId}`);
      if (userInfo) {
        setUsersInfo((prev) => ({ ...prev, [userId]: userInfo }));
      }
    } catch (error) {
      console.error('Ошибка при получении информации о пользователе', error);
    }
  };

  // Загружаем лайки при монтировании компонента
  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  // Загружаем информацию о пользователях для полученных и отправленных лайков
  useEffect(() => {
    const userIds = [
      ...new Set([
        ...sentLikes.map((like) => like.secondUserId),
        ...receivedLikes.map((like) => like.firstUserId),
      ]),
    ];

    userIds.forEach((userId) => {
      if (!usersInfo[userId]) {
        fetchUserInfo(userId);
      }
    });
  }, [sentLikes, receivedLikes, usersInfo, fetchLikes]);

  // Отображаем иконку лайка
  const renderLikeIcon = (typeOfLike: number) => {
    return typeOfLike === 1 ? (
      <Favorite color="secondary" sx={{ fontSize: '28px' }} />
    ) : (
      <FavoriteBorder color="secondary" sx={{ fontSize: '28px' }} />
    );
  };

  // Отображаем информацию о пользователе
  const renderUserInfo = (userId: number) => {
    const user = usersInfo[userId];
    if (!user) return <Typography>Загрузка...</Typography>;

    return (
      <Box className="userInfo" sx={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
        <Box className="avatar" />
        <div>
          <Typography>{user.first_name}</Typography>
          <Typography>Возраст: {user.age}</Typography>
          <Typography>Город: {user.city}</Typography>
        </div>
      </Box>
    );
  };

  return (
    <Box className="pageContainer" sx={{ display: 'flex', flexDirection: 'row', gap: 2, padding: 2 }}>
      {/* Отправленные лайки */}
      <Box className="likeSection" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Отправленные лайки</Typography>
        {sentLikes.map((like) => (
          <Card key={like.id} className="likeCard" sx={{ marginBottom: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {renderUserInfo(like.secondUserId)}
              {renderLikeIcon(like.typeOfLike)}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Полученные лайки */}
      <Box className="likeSection" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Полученные лайки</Typography>
        {receivedLikes.map((like) => (
          <Card key={like.id} className="likeCard" sx={{ marginBottom: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {renderUserInfo(like.firstUserId)}
              {renderLikeIcon(like.typeOfLike)}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default NotificationPage;
