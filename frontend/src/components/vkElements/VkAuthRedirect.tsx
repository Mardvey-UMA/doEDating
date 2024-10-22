import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VkAuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user_id");
    const accessToken = params.get("access_token");
    if (userId && accessToken) {
      localStorage.setItem("accessToken", accessToken.toString());
      navigate("/home");
    } else {
      console.error("Access token или User ID не найдены в URL");
    }
  }, [navigate]);

  return <></>;
};

export default VkAuthCallback;
