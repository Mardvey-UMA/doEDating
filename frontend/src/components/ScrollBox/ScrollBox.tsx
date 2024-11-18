import React from "react";
import styles from "./ScrollBox.module.scss";
import { ScrollBoxProps } from "./ScrollBox.type.ts";

const ScrollBox: React.FC<ScrollBoxProps> = ({
  children,
  height = "auto",
  maxHeight = "400px",
}) => {
  return (
    <div className={styles.scrollBox} style={{ height, maxHeight }}>
      {children}
    </div>
  );
};

export default ScrollBox;
