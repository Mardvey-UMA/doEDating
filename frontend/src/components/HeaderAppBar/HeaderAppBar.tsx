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
//import { RootState } from "../../store";
import { setTheme, ThemeType } from "../../store/themeSlice";

const HeaderAppBar: React.FC = () => {
  //const currentTheme = useSelector((state: RootState) => state.theme.theme);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleThemeChange = (theme: ThemeType) => {
    dispatch(setTheme(theme));
    handleClose();
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
            <Typography variant="h6" className={styles.logoText}>
              DD
            </Typography>
          </Box>
          <Typography variant="h6" noWrap className={styles.title}>
            doedating
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
          <MenuItem onClick={() => handleThemeChange("cake")}>Кекс</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderAppBar;
