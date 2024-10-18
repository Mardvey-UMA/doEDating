// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../src/styles/themes/theme";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage"; // Добавляем импорт
import VkAuthCallback from "./components/vkElements/VkAuthRedirect";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login/oauth2/callback" element={<VkAuthCallback />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
