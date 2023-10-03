import React from "react";
import styles from "./icons.module.css";

interface IPlusIconProps {
  color?: string;
}

export function PlusIcon({ color = "#333" }: IPlusIconProps) {
  return (
    <div className={styles.iconWrap}>
      <svg viewBox="0 0 142 142" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M101 63.8H78V40.8C78 36.9 74.8 33.7 70.9 33.7C67 33.7 63.8 36.9 63.8 40.8V63.8H40.8C36.9 63.8 33.7 67 33.7 70.9C33.7 74.8 36.9 78 40.8 78H63.8V101C63.8 104.9 67 108.1 70.9 108.1C74.8 108.1 78 104.9 78 101V78H101C104.9 78 108.1 74.8 108.1 70.9C108.1 67 104.9 63.8 101 63.8Z"
          fill=""
        />
      </svg>
    </div>
  );
}
