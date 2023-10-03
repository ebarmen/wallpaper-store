import React from 'react';
import styles from './header.module.css';
import { DownIcon } from "../../Icons";
import classNames from 'classnames';

interface IHeaderProps {
    text: string,
    isTextureImage?: boolean,
    isOpen?: boolean,
    onHandleOpen?: (newState: boolean) => void;
    isMaterial?: boolean;
    isFullMode: boolean;
    number: string
}

export function Header(props: IHeaderProps) {
    const { text, isTextureImage, isOpen, onHandleOpen, isMaterial, isFullMode, number } = props;

    const handleDownloadTextures = () => {
        const textures: string[] = [];
        document.querySelectorAll('.texture_image').forEach((img) => {
            if(img instanceof HTMLImageElement) {
                textures.push(img.src);
            }
        })
        saveImage(textures);
    }

    const handleTabState = () => {
        if(onHandleOpen && !isTextureImage) onHandleOpen(!isOpen);
    }

    return (
        <div className={`${styles.container} row ${isTextureImage ? styles.texture : ''}`} onClick={handleTabState}>
            <div className={`${styles.heading}`}><div className={styles.number_container}><span className={styles.span}></span><span className={styles.number}>{number}</span></div>{text}</div>
            {isMaterial &&  <a href={`/info/materials/`} target='_blank' rel='noopener noreferrer' className={styles.link_materials}>Подробнее про материалы</a>}
            {isTextureImage && isFullMode && (
    <button id={'textureDownloadApp'} className={classNames(styles.button, styles.buttonDonwloadTexture)} onClick={handleDownloadTextures}>
        <svg width="20" height="20" viewBox="0 0 142 142" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M104.6 63.6H79.1V22.1C79.1 20.6 77.9 19.4 76.4 19.4H64.9C63.4 19.4 62.2 20.6 62.2 22.1V63.6H36.7C34.2 63.6 33 66.6 34.8 68.3L68.8 100.3C69.9 101.3 71.5 101.3 72.5 100.3L106.5 68.3C108.3 66.6 107.1 63.6 104.6 63.6Z" fill="black"/>
            <path d="M13.1 100.6V107C13.1 115.5 20 122.4 28.5 122.4H113.3C121.8 122.4 128.7 115.5 128.7 107V100.6" stroke="black" strokeWidth="8.5039" strokeMiterlimit="10" strokeLinecap="round"/>
        </svg>
        <span>Скачать 3D текстуры</span>
    </button>
)}
            {!isTextureImage && (
                <div className={`${styles.iconContainer} ${isOpen ? 'open' : ''}`}>
                    <DownIcon className={styles.headerIcon} />
                </div>
            )}
        </div>
    );
}

function saveImage(urls: string[]) {
    const link = document.createElement('a');

    link.setAttribute('download', 'texture.jpg');
    link.style.display = 'none';
    document.body.appendChild(link);

    urls.forEach((url) => {
        link.href = url;
        link.click();
    })

    document.body.removeChild(link);
}
/* {isTextureImage && (
    <button id={'textureDownloadApp'} className={styles.button} onClick={handleDownloadTextures}>
        <svg width="20" height="20" viewBox="0 0 142 142" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M104.6 63.6H79.1V22.1C79.1 20.6 77.9 19.4 76.4 19.4H64.9C63.4 19.4 62.2 20.6 62.2 22.1V63.6H36.7C34.2 63.6 33 66.6 34.8 68.3L68.8 100.3C69.9 101.3 71.5 101.3 72.5 100.3L106.5 68.3C108.3 66.6 107.1 63.6 104.6 63.6Z" fill="black"/>
            <path d="M13.1 100.6V107C13.1 115.5 20 122.4 28.5 122.4H113.3C121.8 122.4 128.7 115.5 128.7 107V100.6" stroke="black" strokeWidth="8.5039" strokeMiterlimit="10" strokeLinecap="round"/>
        </svg>
        <span>Скачать 3D текстуры</span>
    </button>
)} */