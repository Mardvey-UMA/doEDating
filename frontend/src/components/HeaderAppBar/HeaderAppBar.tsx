import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import styles from "./HeaderAppBar.module.scss";
import { useDispatch } from "react-redux";
import { setTheme, ThemeType } from "../../store/themeSlice";
import { updateUser } from "../../services/userService";

const HeaderAppBar: React.FC = () => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleThemeChange = async (theme: ThemeType) => {
    try {
      await updateUser({ theme });
  
      dispatch(setTheme(theme));
    } catch (error) {
      console.error("Ошибка при обновлении темы:", error);
      alert("Не удалось изменить тему. Попробуйте ещё раз.");
    } finally {
      handleClose();
    }
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        <Box className={styles.logoContainer}>
          <Box className={styles.logo}>
            <Typography variant="body1" className={styles.logoText}>
              DD
            </Typography>
          </Box>
          <Typography variant="h4" noWrap className={styles.title}>
            Doedating
          </Typography>
        </Box>

        {/* Кнопка для выбора темы */}
        <IconButton
          edge="end"
          className={styles.themeButton}
          onClick={handleOpenMenu}
        >
          <PaletteIcon />
          <Typography variant="body2" className={styles.themeButtonText}>
            Тема
          </Typography>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleThemeChange("light")}>
            Светлая
          </MenuItem>
          <MenuItem onClick={() => handleThemeChange("dark")}>Тёмная</MenuItem>
          <MenuItem onClick={() => handleThemeChange("cake")}>Малина</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderAppBar;
