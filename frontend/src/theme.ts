// src/theme.ts
import { createTheme } from "@mui/material/styles";

// Функция для получения значения CSS-переменной с проверкой на пустую строку
const getCSSVariable = (name: string, fallback: string) => {
  const value = getComputedStyle(document.body).getPropertyValue(name).trim();
  return value || fallback;
};

// Функция для создания темы Material UI на основе CSS-переменных
export const createAppTheme = () =>
  createTheme({
    palette: {
      primary: {
        main: getCSSVariable("--primary-main", "#3f51b5"),
        light: getCSSVariable("--primary-light", "#757de8"),
        dark: getCSSVariable("--primary-dark", "#002984"),
        contrastText: getCSSVariable("--primary-contrast-text", "#ffffff"),
      },
      secondary: {
        main: getCSSVariable("--secondary-main", "#f50057"),
        light: getCSSVariable("--secondary-light", "#ff5983"),
        dark: getCSSVariable("--secondary-dark", "#bb002f"),
        contrastText: getCSSVariable("--secondary-contrast-text", "#ffffff"),
      },
      error: {
        main: getCSSVariable("--error-main", "#f44336"),
        light: getCSSVariable("--error-light", "#e57373"),
        dark: getCSSVariable("--error-dark", "#d32f2f"),
        contrastText: getCSSVariable("--error-contrast-text", "#ffffff"),
      },
      warning: {
        main: getCSSVariable("--warning-main", "#ff9800"),
        light: getCSSVariable("--warning-light", "#ffb74d"),
        dark: getCSSVariable("--warning-dark", "#f57c00"),
        contrastText: getCSSVariable("--warning-contrast-text", "#ffffff"),
      },
      info: {
        main: getCSSVariable("--info-main", "#2196f3"),
        light: getCSSVariable("--info-light", "#64b5f6"),
        dark: getCSSVariable("--info-dark", "#1976d2"),
        contrastText: getCSSVariable("--info-contrast-text", "#ffffff"),
      },
      success: {
        main: getCSSVariable("--success-main", "#4caf50"),
        light: getCSSVariable("--success-light", "#81c784"),
        dark: getCSSVariable("--success-dark", "#388e3c"),
        contrastText: getCSSVariable("--success-contrast-text", "#ffffff"),
      },
      background: {
        default: getCSSVariable("--background-default", "#fafafa"),
        paper: getCSSVariable("--background-paper", "#ffffff"),
      },
      text: {
        primary: getCSSVariable("--text-primary", "#111111"),
        secondary: getCSSVariable("--text-secondary", "#757575"),
        disabled: getCSSVariable("--text-disabled", "#9e9e9e"),
      },
      action: {
        active: getCSSVariable("--action-active", "#3f51b5"),
        hover: getCSSVariable("--action-hover", "rgba(63, 81, 181, 0.08)"),
        selected: getCSSVariable(
          "--action-selected",
          "rgba(63, 81, 181, 0.16)"
        ),
        disabled: getCSSVariable("--action-disabled", "rgba(0, 0, 0, 0.26)"),
        disabledBackground: getCSSVariable(
          "--action-disabled-background",
          "rgba(0, 0, 0, 0.12)"
        ),
        focus: getCSSVariable("--action-focus", "rgba(63, 81, 181, 0.12)"),
      },
    },
  });
