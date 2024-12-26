import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { vkAuthSuccess } from "../../store/authSlice";
import { fetchUserInfo } from "../../services/userService";

const VkAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const accessExpiresAt = params.get("access_expires_at");

    if (accessToken && accessExpiresAt) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("accessExpiresAt", accessExpiresAt);

      const fetchUserData = async () => {
        try {
          await fetchUserInfo();
          dispatch(vkAuthSuccess({ token: accessToken }));
        } catch (error) {
          console.error("Ошибка при получении данных о пользователе:", error);
        }
      };

      fetchUserData();

      navigate("/myprofile");
    } else {
      console.error("Access token или access_expires_at не найдены в URL");
    }
  }, [dispatch, navigate]);

  return null;
};

export default VkAuthCallback;
