import React, { useState, useEffect, useContext } from "react";
import classNames from "classnames";
import styles from "./backgroundcolorselectoritem.module.css";
import Tippy from "@tippyjs/react";
import "tippy.js/animations/scale.css";
import { ColorPicker } from "./ColorPicker";
import { DownIcon } from "../../../../../Icons";
import { CategoryNames } from "../../../../../types/namesList";
import { canvasTextureContext } from "../../../../../context/canvasTextureContext";
import { canvasBackgroundContext } from "../../../../../context/canvasBackgroundContext";

interface IBackgroundColorSelectorItemProps {
  name: string;
  price: number;
  premPrice: number;
  colors: { img: string; name: string }[];
  premColors: { img: string; name: string }[];
  open: boolean;
  onOpen: (key: any) => void;
  selected: boolean;
  onSelect: (key: number) => void;
  thisKey: number;
  isLastElem: boolean;
  img: string;
}

export function BackgroundColorSelectorItem(
  props: IBackgroundColorSelectorItemProps,
) {
  const {
    name,
    price,
    premPrice,
    colors,
    premColors,
    open,
    onOpen,
    selected,
    onSelect,
    thisKey,
    isLastElem,
    img,
  } = props;
  const { imgData } = useContext(canvasTextureContext);
  const { backgroundData, setBackgroundData } = useContext(
    canvasBackgroundContext,
  );
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(open);

  const handleOpen = () => {
    setIsColorPickerOpen(!isColorPickerOpen);
    onOpen(thisKey);
  };

  const handleSelectCategory = () => {
    if (imgData.catalog === CategoryNames.Pr) {
      onSelect(thisKey);

      setBackgroundData({
        img: colors[0].img,
        name: colors[0].name,
        price: price,
        groupName: name,
        items: backgroundData.items,
      });
    }

    if (imgData.catalog !== CategoryNames.Pr) handleOpen();
  };

  const handleSelectColor = () => {
    onSelect(thisKey);
  };

  // Закрытие остальных дропдаунов
  useEffect(() => {
    if (!open) {
      setIsColorPickerOpen(false);
    }
  }, [open]);

  return (
    <>
      <div className={styles.container} onClick={handleSelectCategory}>
        <div
          className={classNames(
            styles.imageWrap,
            selected && styles.imageWrapSelected,
          )}
        >
          <div className={classNames(styles.imageContainer)}>
            {selected && <img src={backgroundData.img} />}
          </div>
        </div>
        <div className={styles.backgroundName}>
          {name}{" "}
          <Tippy
            className={styles.info}
            content={<BackgroundTooltipContent />}
            interactive={true}
            interactiveBorder={10}
            delay={100}
            duration={100}
            animation={"scale"}
            allowHTML={true}
          >
            <a
              href={`/info/materials/#material_${name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              (?)
            </a>
          </Tippy>
        </div>

        <div className={styles.backgroundprice}>{price} р./м2</div>
      </div>
    </>
  );
}

const BackgroundTooltipContent = () => {
  return (
    <div className={styles.tooltipContent}>
      <p>Перейти на подробное описание материала</p>
      {/* <DownIcon className={styles.tooltipArrow} color={'#FFFFFF'}/> */}
    </div>
  );
};

{
  /* <div className={styles.container}>
            <div className={styles.contentRow}>
                <div className={styles.row}>
                    <div className={styles.dataContainer}>
                        <div className={styles.nameWrap}>
                            <img src={img}/>
                            <p className={classNames(selected && styles.chosenTitle)} onClick={handleSelectCategory}>{name}</p>
                            <Tippy
                                className={styles.info}
                                content={<BackgroundTooltipContent/>}
                                interactive={true}
                                interactiveBorder={20}
                                delay={100}
                                duration={100}
                                animation={'scale'}
                                allowHTML={true}
                            >
                                <a href={`/info/materials/#material_${name}`} target='_blank' rel='noopener noreferrer'>(?)</a>
                            </Tippy>
                        </div>
                        {imgData.catalog !== CategoryNames.Pr &&
                            <button onClick={handleOpen} className={classNames(isColorPickerOpen && styles.open, isColorPickerOpen && 'open')}>
                                <DownIcon color={'#FF5100'}/>
                                Выбрать цвет
                            </button>
                        }
                    </div>
                </div>
                <div className={styles.dataContainer}>
                    <p>{price} р./м2</p>
                </div>
            </div> */
}
