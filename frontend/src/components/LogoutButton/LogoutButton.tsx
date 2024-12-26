import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../store";
import { Button } from "@mui/material"; // Импорт MUI Button

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <Button 
      variant="contained" 
      color="primary" 
      onClick={handleLogout}
    >
      Выйти
    </Button>
  );
};

export default LogoutButton;
