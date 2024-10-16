import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 10,
    h1: {
      fontSize: "2rem",
    },
    button: {
      textTransform: "none", // Отключение заглавных букв для кнопок
      fontSize: 12, // Размер текста в кнопках
    },
  },
  palette: {
    primary: {
      main: "#1976d2", // Основной цвет
    },
    secondary: {
      main: "#ff4081", // Вторичный цвет
    },
  },
  spacing: 8, // Базовая единица для отступов
});

export default theme;
