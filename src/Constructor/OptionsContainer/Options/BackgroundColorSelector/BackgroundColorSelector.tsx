import { useContext, useState } from "react";
import classNames from "classnames";

import { BackgroundColorSelectorItem } from "./BackgroundColorSelectorItem";
import { canvasBackgroundContext } from "../../../../context/canvasBackgroundContext";
import { canvasTextureContext } from "../../../../context/canvasTextureContext";
import { CategoryNames } from "../../../../types/namesList";
import styles from "./backgroundcolorselector.module.css";
import { ColorPicker } from "./BackgroundColorSelectorItem/ColorPicker";

interface IBackgroundColorSelectorProps {
  selectedColorPicker: string;
}

export function BackgroundColorSelector({
  selectedColorPicker,
}: IBackgroundColorSelectorProps) {
  const { backgroundData, setBackgroundData } = useContext(
    canvasBackgroundContext
  );
  const { imgData } = useContext(canvasTextureContext);
  const [openColorPickerKey, setOpenColorPickerKey] = useState<number | null>(
    null
  );

  const domContainer = document.querySelector("#constructor_app");
  const isFullMode = domContainer?.getAttribute("data-is-fullMode");
  // const isFullMode = false;

  const handleOpenColorPicker = (key: number) => {
    setOpenColorPickerKey(key);
  };

  const handleSelectColorPicker = (key: number) => {
   /*   setBackgroundData({
         ...backgroundData,
        groupName: backgroundData.items[key].groupName
     }); */
  };
  
  return (
    <>
     
      <div className={`${styles.container} row`}>
      <ul className={classNames(styles.materialList)}>
        {backgroundData.items.map((item, key) => {
          return (
            <BackgroundColorSelectorItem
              img={backgroundData.img}
              key={key}
              price={item.price}
              premPrice={item.premPrice}
              name={item.groupName}
              colors={item.colors}
              open={openColorPickerKey === key}
              onOpen={(key) => handleOpenColorPicker(key)}
              selected={selectedColorPicker === item.groupName}
              onSelect={(key) => handleSelectColorPicker(key)}
              premColors={item.premColors}
              thisKey={key}
              isLastElem={key === backgroundData.items.length - 1}
            />
          );
        })}
        </ul>
      </div>
      {backgroundData.items.map((item, key) => {
        if (key == openColorPickerKey && item.colors) {
          return (
            <ColorPicker
             key={key}
              price={item.price}
              premPrice={item.premPrice}
              colors={item.colors}
              premColors={item.premColors}
              name={item.groupName}
              isLastElem={key === backgroundData.items.length - 1}
              selected={selectedColorPicker === item.groupName}
              onSelect={() => handleSelectColorPicker(key)}
              thisKey={key}
            />
          );
        }
      })}
    </>
  );
}
