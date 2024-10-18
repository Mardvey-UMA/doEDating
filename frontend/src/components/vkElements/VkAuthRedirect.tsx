import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VkAuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const userId = params.get("user_id");

    if (accessToken && userId) {
      navigate("/home");
    } else {
      console.error("Access token или User ID не найдены в URL");
    }
  }, [navigate]);

  return <div>Авторизация через VK успешно завершена, перенаправляем...</div>;
};

export default VkAuthCallback;
