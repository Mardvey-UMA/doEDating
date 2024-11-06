// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "./store";
import { ThemeProvider } from "@mui/material/styles";
import { createAppTheme } from "./theme"; // Импортируем функцию создания темы
import AdminPage from "./pages/AdminPage/AdminPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import VkAuthCallback from "./components/VkElements";
import ChatPage from "./pages/ChatPage/ChatPage";
import NotificationPage from "./pages/NotificationPage/NotificationsPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import MatchLikesPage from "./pages/MatchLikesPage/MatchLikesPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import MainLayout from "./layouts/MainLayout";
import HeaderAppBarContainer from "./containers/HeaderAppBarContainer/HeaderAppBarContainer";

const AppContent: React.FC = () => {
  const currentTheme = useSelector((state: RootState) => state.theme.theme);
  const [theme, setTheme] = useState(createAppTheme());

  useEffect(() => {
    document.body.className = `${currentTheme}-theme`;
    setTheme(createAppTheme());
  }, [currentTheme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <HeaderAppBarContainer />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<MainLayout />}>
            <Route index element={<UserProfilePage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="notifications" element={<NotificationPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="matches" element={<MatchLikesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="login/oauth2/callback" element={<VkAuthCallback />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
