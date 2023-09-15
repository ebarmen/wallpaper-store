import React from 'react';
import styles from './icons.module.css';

interface IMinusIconProps {
    color?: string;
}

export function MinusIcon({ color = '#333' }: IMinusIconProps) {
    return (
        <div className={styles.iconWrap}>
            <svg viewBox="0 0 142 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M101 78H40.8C36.9 78 33.7 74.8 33.7 70.9C33.7 67 36.9 63.8 40.8 63.8H101C104.9 63.8 108.1 67 108.1 70.9C108.1 74.8 104.9 78 101 78Z" fill=""/>
            </svg>
        </div>
    );
}
