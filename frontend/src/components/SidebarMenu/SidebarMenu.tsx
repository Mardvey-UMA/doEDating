import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
//import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/StarRate";//import SettingsIcon from "@mui/icons-material/StarRate";
import styles from "./SidebarMenu.module.scss";
import { SidebarMenuProps } from "./SidebarMenu.type.ts";

const menuItems = [
  {
    path: "/myprofile",
    label: "Профиль",
    icon: <AccountCircleIcon className={styles.icon} />,
  },
  // {
  //   path: "/chat",
  //   label: "Сообщения",
  //   icon: <MailIcon className={styles.icon} />,
  // },
  {
    path: "/notifications",
    label: "События",
    icon: <NotificationsIcon className={styles.icon} />,
  },
  {
    path: "/search",
    label: "Рекомендации",
    icon: <SearchIcon className={styles.icon} />,
  },
  // {
  //   path: "/settings",
  //   label: "Настройки",
  //   icon: <SettingsIcon className={styles.icon} />,
  // },
];

const SidebarMenu: React.FC<SidebarMenuProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveClass = (path: string) =>
    location.pathname === path ? styles.active : "";

  return (
    <Box className={styles.sidebarMenu}>
      {menuItems.map((item) => (
        <Box
          key={item.path}
          className={`${styles.menuItem} ${getActiveClass(item.path)}`}
          onClick={() => navigate(item.path)}
        >
          <Box className={styles.iconContainer}>{item.icon}</Box>
          <Typography className={styles.label}>{item.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default SidebarMenu;
