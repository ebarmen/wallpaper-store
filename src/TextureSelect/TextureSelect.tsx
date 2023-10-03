import React, { useContext, useEffect, useState } from "react";
import { Header } from "./Header";
import { LineSeparator } from "../LineSeparator";
import { TextureList } from "./TextureList";
import { canvasTextureContext } from "../context/canvasTextureContext";
import { BackgroundColorSelector } from "../Constructor/OptionsContainer/Options/BackgroundColorSelector";
import { canvasOptionsContext } from "../context/canvasOptionsContext";
import { canvasBackgroundContext } from "../context/canvasBackgroundContext";
import { CategoryNames, ColorPickersNames } from "../types/namesList";
import { EmblaOptionsType } from "embla-carousel-react";
import EmblaCarousel from "../Gallery/Gallery";
import Info from "../Info/Info";
import styles from "./textureselect.module.css";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

const OPTIONS: EmblaOptionsType = {};

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
    examplesPrPrice: number;
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

interface ITextureSelectProps {
  defaultBackgroundData: BDType;
  defaultCategoryIndex: number;
  defaultCollectionIndex: number;
}

const domContainer = document.querySelector("#constructor_app");
const isFullModee = domContainer?.getAttribute("data-is-fullMode");
const isFullMode = isFullModee ? true : false;
//const isFullMode = false;

export function TextureSelect({
  defaultBackgroundData,
  defaultCategoryIndex,
  defaultCollectionIndex,
}: ITextureSelectProps) {
  const [isOpenCategory, setIsOpenCategory] = useState(true);
  const [isOpenCollection, setIsOpenCollection] = useState(true);
  const [textureData, setTextureData] = useState({});
  const [categoryId, setCategoryId] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const { imgData } = useContext(canvasTextureContext);
  const { backgroundData } = useContext(canvasBackgroundContext);

  useEffect(() => {
    if (isFullMode) {
      if (categoryId || collectionId) return;
      setTextureData(imgData.fullData);
      const defaultCategoryId = Object.keys(imgData.fullData)[
        defaultCategoryIndex
      ];
      setCategoryId(defaultCategoryId);

      if (defaultCategoryId) {
        const defaultCollectionId = Object.keys(
          imgData.fullData[defaultCategoryId].collection,
        )[defaultCollectionIndex];
        setCollectionId(defaultCollectionId);
      }
    }
  }, [imgData]);

  const keyTypedCollection = categoryId as keyof typeof textureData;
  const collectionData = textureData[keyTypedCollection];

  let newTextureData;
  if (collectionData) {
    const textureList =
      collectionData["collection" as keyof typeof collectionData];
    const keyTypedTexture = collectionId as keyof typeof textureList;
    newTextureData = textureList[keyTypedTexture as keyof typeof textureList];
  }

  if (isFullMode && textureData) {
    return (
      <div>
        <Header
          isFullMode={isFullMode}
          text={"Выбор каталога"}
          number={""}
          isOpen={isOpenCategory}
          onHandleOpen={(newState) => {
            setIsOpenCategory(newState);
          }}
        />
        <LineSeparator />
        <div>
          <TextureList
            dataListType={"category"}
            data={textureData}
            isOpen={isOpenCategory}
            onHandleCategoryChange={(newCategoryId) => {
              setCategoryId(newCategoryId);
            }}
            selectedCategoryId={categoryId}
          />
        </div>
        <Header
          isFullMode={isFullMode}
          text={"Выбор коллекции"}
          number={""}
          isOpen={isOpenCollection}
          onHandleOpen={(newState) => {
            setIsOpenCollection(newState);
          }}
        />
        <LineSeparator />
        <div>
          <TextureList
            dataListType={"collection"}
            data={collectionData}
            isOpen={isOpenCollection}
            onHandleCollectionChange={(newCollectionId) => {
              setCollectionId(newCollectionId);
            }}
            selectedCollectionId={collectionId}
            defaultBackgroundData={defaultBackgroundData}
          />
        </div>
        <Header
          isFullMode={isFullMode}
          text={"1. Выберите материал основы"}
          number={""}
          isTextureImage={true}
          isMaterial={true}
        />

        <BackgroundColorSelector
          selectedColorPicker={backgroundData.groupName}
        />
        <Header
          isFullMode={isFullMode}
          text={"2. Выберите цвет рисунка"}
          number={""}
          isTextureImage={true}
        />
        <LineSeparator />
        <div>
          <TextureList
            dataListType={"texture"}
            data={newTextureData}
            isOpen={!!newTextureData}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="container_fresq">
          <Breadcrumbs />
          <EmblaCarousel slides={[]} options={OPTIONS} />
          <Info isTextureImage={true} />
          <div className={styles.calc_price}>расчет стоимости</div>
          <LineSeparator />
          <Header
            text={" Выберите материал основы"}
            isFullMode={isFullMode}
            number={"1"}
            isTextureImage={true}
            isMaterial={true}
          />
          <BackgroundColorSelector
            selectedColorPicker={backgroundData.groupName}
          />
          <Header
            isFullMode={isFullMode}
            text={" Выберите цвет рисунка"}
            number={"2"}
            isTextureImage={true}
          />
          <TextureList />
        </div>
      </div>
    );
  }
}
