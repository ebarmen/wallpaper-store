import { useContext, useState } from 'react';
import classNames from 'classnames';
import { Dropdown } from '../../../../Dropdown';
import { BackgroundColorSelectorItem } from './BackgroundColorSelectorItem';
import { DownIcon } from '../../../../Icons';
import { canvasBackgroundContext } from '../../../../context/canvasBackgroundContext';
import { canvasTextureContext } from '../../../../context/canvasTextureContext';
import { CategoryNames } from '../../../../types/namesList';
import styles from './backgroundcolorselector.module.css';

interface IBackgroundColorSelectorProps {
    selectedColorPicker: string;
}

export function BackgroundColorSelector({selectedColorPicker}:IBackgroundColorSelectorProps) {
    const { backgroundData, setBackgroundData } = useContext(canvasBackgroundContext);
    const { imgData } = useContext(canvasTextureContext);
    const [openColorPickerKey, setOpenColorPickerKey] = useState<number|null>(null);

    const domContainer = document.querySelector('#constructor_app');
    const isFullMode = domContainer?.getAttribute('data-is-fullMode');
    // const isFullMode = false;

    const handleOpenColorPicker = (key: number) => {
        setOpenColorPickerKey(key);
    }

    const handleSelectColorPicker = (key: number) => {
        // setBackgroundData({
        //     ...backgroundData,
        //     groupName: backgroundData.items[key].groupName
        // });
    }

    return (
        <div className={`${styles.container} row`}>
                {backgroundData.items.map((item, key) => {
                    return <BackgroundColorSelectorItem
                        img={backgroundData.img}
                        key={key}
                        price={item.price}
                        premPrice={item.premPrice}
                        name={item.groupName}
                        colors={item.colors}
                        open={(openColorPickerKey === key)}
                        onOpen={(key) => handleOpenColorPicker(key)}
                        selected={selectedColorPicker === item.groupName}
                        onSelect={(key) => handleSelectColorPicker(key)}
                        premColors={item.premColors}
                        thisKey={key}
                        isLastElem={key === backgroundData.items.length - 1}
                    />
                })}
               
           
        </div>
    );
}
