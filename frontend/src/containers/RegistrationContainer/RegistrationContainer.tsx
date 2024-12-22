// src/containers/RegistrationContainer/RegistrationContainer.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import Registration from "../../components/Registration";
import { register } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

const RegistrationContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Используем типизированный dispatch
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);

  const handleRegister = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const resultAction = await dispatch(
      register({
        username: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
      })
    );
    if (register.fulfilled.match(resultAction)) {
      navigate("/login");
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <Registration
      onRegister={handleRegister}
      onNavigateToLogin={handleNavigateToLogin}
      loading={authState.loading}
      error={authState.error}
    />
  );
};

export default RegistrationContainer;
