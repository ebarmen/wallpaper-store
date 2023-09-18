import React from "react";
import styles from "./optionscontainer.module.css";
import { Options } from "./Options";
import { Total } from "./Total";
import { Buttons } from "./Buttons";

interface IOptionsContainerProps {
  mode: string;
  handleFlip: () => void;
}

export function OptionsContainer({ mode, handleFlip }: IOptionsContainerProps) {
  return (
    <div className={styles.container}>
      <div>
        <Options mode={mode} handleFlip={handleFlip} />
      </div>
      <div>
        <Total />
        <Buttons />
      </div>
    </div>
  );
}
