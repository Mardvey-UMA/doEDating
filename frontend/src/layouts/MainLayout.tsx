// src/layouts/MainLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import SidebarMenu from "../components/SidebarMenu/SidebarMenu";
import styles from "./MainLayout.module.scss";

const MainLayout: React.FC = () => {
  return (
    <div className={styles.mainLayout}>
      <SidebarMenu />
      <div className={styles.mainContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
