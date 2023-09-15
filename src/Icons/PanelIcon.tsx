import React from 'react';
import styles from './icons.module.css';

interface IPlusIconProps {
    color?: string;
}

export function PanelIcon({ color = '#333' }: IPlusIconProps) {
    return (
        <div className={styles.panelIconWrap}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.5 204.2" xmlSpace="preserve">
                <path d="M57.4,0H14.9C7,0,0.6,6.4,0.6,14.3v176.5c0,7.9,6.4,14.3,14.3,14.3h92.8c7.9,0,14.3-6.4,14.3-14.3V64L57.4,0z M59.9,14.5
                l47.5,47.1H65.7c-3.2,0-5.8-2.6-5.8-5.8V14.5z M107.7,196.5H14.9c-3.2,0-5.8-2.6-5.8-5.8V14.3c0-3.2,2.6-5.8,5.8-5.8h36.5v47.3
                c0,7.9,6.4,14.3,14.3,14.3h47.8v120.7C113.4,193.9,110.9,196.5,107.7,196.5z" fill=""/>
            </svg>
        </div>
    );
}
