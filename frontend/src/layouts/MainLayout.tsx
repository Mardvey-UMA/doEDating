// src/layouts/MainLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import HeaderAppBar from "../components/HeaderAppBar/HeaderAppBar";
import SidebarMenu from "../components/SidebarMenu/SidebarMenu";
import styles from "./MainLayout.module.scss";

const MainLayout: React.FC = () => {
  return (
    <div className={styles.mainLayout}>
      <HeaderAppBar />
      <SidebarMenu />
      <div className={styles.mainContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
