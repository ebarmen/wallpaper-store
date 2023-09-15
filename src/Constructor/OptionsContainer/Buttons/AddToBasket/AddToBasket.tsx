import React from 'react';
import classNames from 'classnames';
import styles from './addtobasket.module.css';

export function AddToBasket() {
    return (
        <div>
            <div id={'addToBasketButton'} className={classNames(styles.button, styles.addToBasketButton)}>
                <svg width="20" height="20" viewBox="0 0 142 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M104.6 63.6H79.1V22.1C79.1 20.6 77.9 19.4 76.4 19.4H64.9C63.4 19.4 62.2 20.6 62.2 22.1V63.6H36.7C34.2 63.6 33 66.6 34.8 68.3L68.8 100.3C69.9 101.3 71.5 101.3 72.5 100.3L106.5 68.3C108.3 66.6 107.1 63.6 104.6 63.6Z" fill="black"/>
                    <path d="M13.1 100.6V107C13.1 115.5 20 122.4 28.5 122.4H113.3C121.8 122.4 128.7 115.5 128.7 107V100.6" stroke="black" strokeWidth="8.5039" strokeMiterlimit="10" strokeLinecap="round"/>
                </svg>
                Добавить в корзину
            </div>
            <div id={'basketLink'} className={classNames(styles.button, styles.basketLink)}>
                <svg x="0px" y="0px" width="20" height="20" viewBox="0 0 142 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M120.8 70.4C120.8 68.1 119.7 66 118 64.8C117.7 64.4 117.4 64 117 63.6L86.5 30C83.9 27.1 79.4 26.9 76.5 29.5C73.6 32.1 73.4 36.6 76 39.5L97.7 63.3H28C24.1 63.3 20.9 66.5 20.9 70.4C20.9 74.3 24.1 77.5 28 77.5H98.3L77 102.4C74.5 105.4 74.8 109.8 77.8 112.4C79.1 113.5 80.8 114.1 82.4 114.1C84.4 114.1 86.4 113.3 87.8 111.6L117.3 77.2C117.6 76.8 117.9 76.4 118.2 75.9C119.7 74.7 120.8 72.7 120.8 70.4Z" fill="black"></path>
                </svg>
                Перейти в корзину
            </div>
        </div>
    );
}
