import React, { useContext } from 'react';
import styles from './header.module.css';
import { canvasTextureContext } from "../../context/canvasTextureContext";
import { SizeSelector } from '../OptionsContainer/Options/SizeSelector';

const url = new URL(window.location.href);
const name = url.searchParams.get('name');

interface IHeaderProps {
  mode: string;
}

export function Header(props :IHeaderProps ) {
    // const { imgData } = useContext(canvasTextureContext);
    const {mode} = props

    return (
      <div className={`${styles.container} row`}>
        {/*<div id={'element_name'} className={styles.heading}>{name ? name : imgData.items[0].name}</div>*/}
        <div id={'element_name'} className={styles.heading}><div className={styles.number_container}><span className={styles.span}></span><span className={styles.number}>3</span></div> Укажите размер стены  </div>
        <SizeSelector mode={mode}/>
      </div>
  );
}
