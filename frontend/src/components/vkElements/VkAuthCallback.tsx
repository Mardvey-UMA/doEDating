import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { vkAuthSuccess } from "../../store/authSlice";

const VkAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const accessExpiresAt = params.get("access_expires_at");

    if (accessToken && accessExpiresAt) {
      // Сохраняем токен в Redux
      dispatch(vkAuthSuccess(accessToken));

      // Если необходимо, можно сохранить время истечения токена в Redux
      // и настроить автообновление токена через middleware или эффекты

      // Перенаправляем пользователя
      navigate("/home");
    } else {
      console.error("Access token или access_expires_at не найдены в URL");
    }
  }, [dispatch, navigate]);

  return null;
};

export default VkAuthCallback;
