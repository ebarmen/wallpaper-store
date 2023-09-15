import React from 'react';
import styles from './buttons.module.css';
import { AddToBasket } from "./AddToBasket";
import { ShowPanels } from "./ShowPanels";

export function Buttons() {

    return (
        <div className={styles.container}>
            <AddToBasket />
            {/*<ShowPanels/>*/}
        </div>
    );
}
