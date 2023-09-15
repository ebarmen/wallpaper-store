import { useEffect, useContext } from 'react';
import classNames from 'classnames';
import styles from './colorpicker.module.css';
import { CategoryNames } from '../../../../../../types/namesList';
import { canvasBackgroundContext } from '../../../../../../context/canvasBackgroundContext';
import { canvasTextureContext } from '../../../../../../context/canvasTextureContext';

interface IColorPickerProps {
    price: number;
    premPrice: number;
    colors: { img: string; name: string; }[];
    premColors?: { img: string; name: string; }[];
    name: string;
    isLastElem: boolean;
    selected: boolean;
    onSelect: () => void
}

export function ColorPicker(props: IColorPickerProps) {
    const { price, premPrice, colors, premColors, name, isLastElem, selected, onSelect } = props;
    const { backgroundData, setBackgroundData } = useContext(canvasBackgroundContext);
    const { imgData } = useContext(canvasTextureContext);

    const handleClick = (image:any, imageName: string, isPrem: boolean = false) => {
        setBackgroundData({
            img: image,
            name: imageName,
            price: !isPrem ? price : price + premPrice,
            groupName: name,
            items: backgroundData.items
        });
    }

    // костыль для битрикса
    const handleSelect = () => {
        onSelect();
    }

    useEffect(() => {
        if (selected && imgData.catalog === CategoryNames.Pr) setBackgroundData({
            img: colors[0].img,
            name: colors[0].name,
            price: price,
            groupName: name,
            items: backgroundData.items
        });
    }, [selected, imgData]);

    return (
        <div className={classNames(styles.container, styles.open, isLastElem && styles.last)}>
            <div className={styles.header}>
                <span>Цвета базовые</span>
            </div>

            <div className={styles.colorsList} onClick={() => onSelect()}>
                {colors && colors.map((color, index) => {
                    return <div key={index} className={styles.colorItem}>
                        <img className={classNames(color.img === backgroundData.img && styles.selected)} src={color.img} alt='color' onClick={() => {handleClick(color.img, color.name)}}/>
                        <div className={styles.name}>{color.name}</div>
                        {color.img === backgroundData.img && <div className={styles.mark}>
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 141.7 141.7" xmlSpace="preserve">
                                <path d="M62.4,106.2c-2.9,0-5.6-1.1-7.7-3L31.4,81.9c-2.9-2.6-3.1-7.1-0.5-10c2.6-2.9,7.1-3.1,10-0.5l21.2,19.4 l47.1-53.2c2.6-2.9,7.1-3.2,10-0.6c2.9,2.6,3.2,7.1,0.6,10l-49.1,55.3c-2,2.3-4.9,3.6-7.9,3.8C62.7,106.2,62.6,106.2,62.4,106.2z M64.3,92.7L64.3,92.7C64.3,92.7,64.3,92.7,64.3,92.7z" fill="#ffffff"></path>
                            </svg>
                        </div>}
                    </div>;
                })}
            </div>

            {premColors && premColors.length > 0 && (
                <div>
                    <div className={styles.header}>
                        <span>Цвета премиальные</span>
                        <span className={styles.premPrice}>+{premPrice} р./м2</span>
                    </div>
                    <div className={styles.colorsList} onClick={handleSelect}>
                        {premColors && premColors.map((color, index) => {
                            return  <div key={index} className={styles.colorItem}>
                                <img className={classNames(color.img === backgroundData.img && styles.selected)} src={color.img} alt='color' onClick={() => handleClick(color.img, color.name, true)}/>
                                <div className={styles.name}>{color.name}</div>
                                {color.img === backgroundData.img && <div className={styles.mark}>
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 141.7 141.7" xmlSpace="preserve">
                                        <path d="M62.4,106.2c-2.9,0-5.6-1.1-7.7-3L31.4,81.9c-2.9-2.6-3.1-7.1-0.5-10c2.6-2.9,7.1-3.1,10-0.5l21.2,19.4 l47.1-53.2c2.6-2.9,7.1-3.2,10-0.6c2.9,2.6,3.2,7.1,0.6,10l-49.1,55.3c-2,2.3-4.9,3.6-7.9,3.8C62.7,106.2,62.6,106.2,62.4,106.2z M64.3,92.7L64.3,92.7C64.3,92.7,64.3,92.7,64.3,92.7z" fill="#ffffff"></path>
                                    </svg>
                                </div>}
                            </div>;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
