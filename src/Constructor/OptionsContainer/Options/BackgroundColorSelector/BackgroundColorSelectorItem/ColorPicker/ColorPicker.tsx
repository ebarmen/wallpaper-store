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
    onSelect: () => void;
    thisKey: number;
}

export function ColorPicker(props: IColorPickerProps) {
    const { price, premPrice, colors, premColors, name, isLastElem, selected, onSelect, thisKey } = props;
    const { backgroundData, setBackgroundData } = useContext(canvasBackgroundContext);
    const { imgData } = useContext(canvasTextureContext);
    const borderKey = 'arrowtop'+thisKey

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
        <div className={classNames(styles.container, styles.open, isLastElem && styles.last,  styles.arrow, styles.arrowtop, styles[borderKey])}>
            <div className={styles.header}>
            <div id={'js-background-group-name'} className={styles.colorName}>
                            {name}/{backgroundData.name}
                        </div>
                <div>Цвета базовые</div>
            </div>

            <div className={styles.colorsList} onClick={() => onSelect()}>
              
                {colors && colors.map((color, index) => {
                    return <div key={index}  onClick={() => {handleClick(color.img, color.name)}} className={styles.colorItem}>
                        <div className={classNames(styles.imageWrapper, color.img === backgroundData.img && styles.colorItemselected)}>
                            <div className={styles.imageContainer}>
                                <img src={color.img} alt='color'/>
                                    </div>
                                        </div>    
                        <div className={styles.name}>{color.name}</div>
                        <div className={styles.price}>0 р/м2</div>
                        
                    </div>;
                })}
            </div>

            {premColors && premColors.length > 0 && (
                <div>
                    <div className={styles.header}>
                        <span>Цвета премиальные</span>
                        
                    </div>
                    <div className={styles.colorsList} onClick={handleSelect}>
                        {premColors && premColors.map((color, index) => {
                            return  <div key={index} onClick={() => handleClick(color.img, color.name, true)} className={styles.colorItem}>
                               <div className={classNames(styles.imageWrapper, color.img === backgroundData.img && styles.colorItemselected)}>
                            <div className={styles.imageContainer}>
                                <img src={color.img} alt='color'/>
                                    </div>
                                        </div>    
                                <div className={styles.name}>{color.name}</div>
                                <div className={styles.price}>+{premPrice}р/м2</div>
                            </div>;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
