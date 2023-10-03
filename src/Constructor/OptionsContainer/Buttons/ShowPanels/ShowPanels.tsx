import React, { useContext, useState } from "react";
import styles from "./showpanels.module.css";
import { canvasModeContext } from "../../../../context/canvasModeContext";
import { ModeNames } from "../../../../types/namesList";

export function ShowPanels() {
  const [isUsed, setIsUsed] = useState(true);
  const { setMode } = useContext(canvasModeContext);

  const handleClick = () => {
    isUsed ? setMode(ModeNames.Handmode) : setMode(ModeNames.Panels);
    setIsUsed(!isUsed);
  };

  return (
    <div className={styles.button} onClick={handleClick}>
      Показать панели
    </div>
  );
}
