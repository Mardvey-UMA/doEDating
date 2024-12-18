// src/containers/LoginContainer/LoginContainer.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import Login from "../../components/Login";
import { login } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

const LoginContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Используем типизированный dispatch
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);

  const handleLogin = async (email: string, password: string) => {
    const resultAction = await dispatch(login({ username: email, password }));
    if (login.fulfilled.match(resultAction)) {
      navigate("/admin");
    } else {
      // Ошибка уже обработана в состоянии authState.error
    }
  };

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  return (
    <Login
      onLogin={handleLogin}
      onNavigateToRegister={handleNavigateToRegister}
      loading={authState.loading}
      error={authState.error}
    />
  );
};

export default LoginContainer;
