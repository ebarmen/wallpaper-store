import { useContext, useEffect } from 'react';
import classNames from 'classnames';
import {isEmpty} from 'lodash';
import styles from './textureelement.module.css';
import { canvasTextureContext } from '../../../context/canvasTextureContext';
import { canvasBackgroundContext } from '../../../context/canvasBackgroundContext';

type BDType = {
    img: string;
    name: string;
    price: number;
    groupName: string;
    items: {
        price: number;
        premPrice: number;
        groupName: string;
        excludedOptions: any;
        installPrice: number;
        examplePrice: number;
        exampleExtraPrice: number;
        examplesPrPrice: number,
        id: string;
        colors: {
            img: string;
            name: string;
        }[];
        premColors: {
            img: string;
            name: string;
        }[];
    }[];
};

interface ITextureElementProps {
    name: string;
    price?: number;
    id?: string;
    thisImg: string;
    selected?: boolean;
    onHandleCategoryChange?: (newCategoryId: string) => void;
    onHandleCollectionChange?: (newCollectionId: string) => void;
    textureData?: any;
    removeElements?: any;
    defaultBackgroundData?: BDType;
}

const domContainer = document.querySelector('#constructor_app');
// const isFullMode = domContainer?.getAttribute('data-is-fullMode');
const isFullMode = true;

export function TextureElement(props: ITextureElementProps) {
    const {
        name,
        price,
        id,
        thisImg,
        selected,
        onHandleCategoryChange,
        onHandleCollectionChange,
        textureData,
        removeElements,
        defaultBackgroundData
    } = props;

    const { imgData, setImgData } = useContext(canvasTextureContext);
    const { backgroundData, setBackgroundData } = useContext(canvasBackgroundContext);

    const setNewBackgroundData = () => {
        if(removeElements && defaultBackgroundData) {
            const newBackgroundDataItems = defaultBackgroundData.items.filter((backgroundGroup) => {
                return !removeElements.includes(backgroundGroup.id);
            });

            let isChangeBackground = true;

            newBackgroundDataItems.forEach(item => {
                if(item.groupName === backgroundData.groupName) {
                    isChangeBackground = false;
                }
            });

            setBackgroundData({
                img: isChangeBackground ? newBackgroundDataItems[0].colors[0].img : backgroundData.img,
                name: isChangeBackground ? newBackgroundDataItems[0].colors[0].name : backgroundData.name,
                price: isChangeBackground ? newBackgroundDataItems[0].price : backgroundData.price,
                groupName: isChangeBackground ? newBackgroundDataItems[0].groupName : backgroundData.groupName,
                items: newBackgroundDataItems
            });
        } else {
            if (defaultBackgroundData) {
                setBackgroundData({
                    img: backgroundData.img,
                    name: backgroundData.name,
                    price: backgroundData.price,
                    groupName: backgroundData.groupName,
                    items: defaultBackgroundData.items
                });
            }
        }

        // костыль для раздела "Каталог"
        if (id && +id) {
            document.getElementById('element')?.setAttribute('data-id', id ? id : '');
        }
    }

    const handleClick = () => {
        if(onHandleCategoryChange && id) {
            onHandleCategoryChange(id);

            if (!isEmpty(imgData.fullData))
                setImgData({
                    img: imgData.img,
                    price: imgData.price,
                    catalog: imgData.fullData[id].name,
                    items: imgData.items,
                    fullData: imgData.fullData
                });
        } else if(onHandleCollectionChange && id) {
            setNewBackgroundData();
            onHandleCollectionChange(id);

            if(textureData[id as keyof typeof textureData].texture_data) {
                setImgData({
                    img: imgData.img,
                    price: imgData.price,
                    catalog: imgData.catalog,
                    items: textureData[id as keyof typeof textureData].texture_data,
                    fullData: imgData.fullData
                });
            }
        } else {
            setImgData({
                img: thisImg,
                price: price ? price : 0,
                catalog: imgData.catalog,
                items: textureData ? textureData : imgData.items,
                fullData: imgData.fullData
            });
        }
    }

    // Добавляем id для дефолтной коллекции
    useEffect(() => {
        if (isFullMode && id && onHandleCollectionChange && selected)
            document.getElementById('element')?.setAttribute('data-id', id);
    }, []);

    return (
        <div
            className={classNames(
                styles.container,
                onHandleCategoryChange && styles.categoryContainer,
                onHandleCollectionChange && styles.collectionContainer,
                !onHandleCategoryChange && !onHandleCollectionChange && styles.textureContainer,
                selected && 'texture_element_selected'
            )}
            onClick={handleClick}>

            <div className={classNames(styles.imageWrap, selected && styles.imageWrapSelected)}>
                <div className={classNames(styles.imageContainer,
                    (!onHandleCategoryChange && selected) && styles.selected,
                    (onHandleCategoryChange && selected) && 'texture_element_selected',
                    onHandleCategoryChange && 'texture_element',
                    (!onHandleCategoryChange && !onHandleCollectionChange) && styles.textureImageContainer)}
                >
                    <img src={thisImg} alt={name} className={classNames((!onHandleCategoryChange && !onHandleCollectionChange) && 'texture_image')}/>
                </div>
            </div>

            <div
                id={selected && !onHandleCategoryChange && !onHandleCollectionChange
                    ? 'element_name'
                    : selected && onHandleCategoryChange ? 'element_category' : ''
                } 
                className={classNames(styles.name, selected && 'element_name')}
            >
                {name}
            </div>

            {price && (onHandleCategoryChange || onHandleCollectionChange) && (
                <div>
                    <div className={classNames(styles.text, styles.centerPrice, 'price_font')}>от {price} р./м2</div>
                </div>
            )}

            {price && !onHandleCategoryChange && !onHandleCollectionChange && (
                <div>
                    <div className={classNames(styles.text, 'price_font')}>{price} р./м2</div>
                    <div className={`${styles.text}${selected ? ' js-selected-texture-name' : ''}`}>ID {id}</div>
                </div>
            )}
        </div>
    );
}
