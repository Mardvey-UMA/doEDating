import { initTokenRefresh } from "../../services/refreshService";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VkAuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const accessExpiresAt = params.get("access_expires_at");
    if (accessToken && accessExpiresAt) {
      localStorage.setItem("accessToken", accessToken.toString());
      localStorage.setItem(
        "accessTokenExpirationTime",
        accessExpiresAt.toString()
      );
      initTokenRefresh();
      navigate("/home");
    } else {
      console.error("Access token или User ID не найдены в URL");
    }
  }, [navigate]);

  return <></>;
};

export default VkAuthCallback;
