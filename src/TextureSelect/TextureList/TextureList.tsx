import React, { useContext } from "react";
import classNames from "classnames";
import styles from "./texturelist.module.css";
import { TextureElement } from "./TextureElement";
import { canvasTextureContext } from "../../context/canvasTextureContext";

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

interface ITextureListProps {
  dataListType?: "category" | "collection" | "texture";
  data?: { [key: string]: any };
  isOpen?: boolean;
  selectedCategoryId?: string;
  selectedCollectionId?: string;
  onHandleCategoryChange?: (newCategoryId: string) => void;
  onHandleCollectionChange?: (newCollectionId: string) => void;
  defaultBackgroundData?: BDType;
}

interface IPrices {
  [key: string]: number[];
}

export function TextureList(props: ITextureListProps) {
  const {
    dataListType,
    data,
    isOpen,
    onHandleCategoryChange,
    onHandleCollectionChange,
    defaultBackgroundData,
    selectedCategoryId,
  } = props;

  const { imgData } = useContext(canvasTextureContext);

  if (dataListType) {
    switch (dataListType) {
      case "category":
        const categoryData = [];
        const categoryPrices: IPrices = {};

        if (data) {
          for (let [key, value] of Object.entries(data)) {
            const newCategoryData: {
              id: string;
              name: string;
              img: string;
              sort: string;
            } = {
              id: key,
              name: value.name,
              img: value.img,
              sort: value.sort,
            };

            categoryData.push(newCategoryData);

            categoryPrices[key] = [];

            const collection = value["collection" as keyof typeof value];

            for (let [_key, value] of Object.entries(collection)) {
              const newValue: any = value;
              const texture = newValue[
                "texture_data" as keyof typeof newValue
              ] as any[];

              texture.forEach((el) => {
                if (el.price) categoryPrices[key].push(el.price);
              });
            }
          }
        }

        return (
          <ul
            className={classNames(
              styles.textureList,
              onHandleCategoryChange && styles.categoryList,
              isOpen && styles.open,
            )}
          >
            {categoryData &&
              categoryData
                .sort((a, b) => (a.sort > b.sort ? 1 : -1))
                .map((category) => {
                  return (
                    <TextureElement
                      key={category.id}
                      id={category.id}
                      name={category.name}
                      price={
                        categoryPrices[category.id].length
                          ? Math.min(...categoryPrices[category.id])
                          : 0
                      }
                      thisImg={category.img}
                      selected={selectedCategoryId === category.id}
                      onHandleCategoryChange={
                        onHandleCategoryChange &&
                        ((newCategoryId) => {
                          onHandleCategoryChange(newCategoryId);
                        })
                      }
                    />
                  );
                })}
          </ul>
        );

      case "collection":
        let collectionData = {
          collection: { name: "", img: "", sort: "", remove_background: [] },
        };
        const collectionPrices: IPrices = {};

        if (data) {
          collectionData = data["collection" as keyof typeof data];

          Object.keys(collectionData).forEach((collection) => {
            collectionPrices[collection] = [];

            const newValue =
              collectionData[collection as keyof typeof collectionData];
            const texture = newValue[
              "texture_data" as keyof typeof newValue
            ] as any[];

            texture.forEach((el) => {
              if (el.price) collectionPrices[collection].push(el.price);
            });
          });
        }

        return (
          <ul className={classNames(styles.textureList, isOpen && styles.open)}>
            {collectionData &&
              Object.keys(collectionPrices).length &&
              imgData.items[0] &&
              Object.keys(collectionData)
                .sort((a, b) =>
                  +collectionData[a as keyof typeof collectionData].sort >
                  +collectionData[b as keyof typeof collectionData].sort
                    ? 1
                    : -1,
                )
                .map((collection, index) => {
                  return (
                    <TextureElement
                      key={index}
                      id={collection}
                      name={
                        collectionData[
                          collection as keyof typeof collectionData
                        ].name
                      }
                      price={
                        collectionPrices[
                          collection as keyof typeof collectionPrices
                        ].length
                          ? Math.min(
                              ...collectionPrices[
                                collection as keyof typeof collectionPrices
                              ],
                            )
                          : 0
                      }
                      thisImg={
                        collectionData[
                          collection as keyof typeof collectionData
                        ].img
                      }
                      selected={
                        collectionData[
                          collection as keyof typeof collectionData
                        ].name === imgData.items[0].name
                      }
                      removeElements={
                        collectionData[
                          collection as keyof typeof collectionData
                        ].remove_background
                      }
                      onHandleCollectionChange={
                        onHandleCollectionChange &&
                        ((newCollectionId) => {
                          onHandleCollectionChange(newCollectionId);
                        })
                      }
                      textureData={collectionData}
                      defaultBackgroundData={defaultBackgroundData}
                    />
                  );
                })}
          </ul>
        );

      case "texture":
        let textureData = {
          collection: { name: "", id: "", img: "", price: "" },
        };

        if (data) {
          textureData = data["texture_data" as keyof typeof data];
        }

        return (
          <ul
            className={classNames(
              styles.textureList,
              styles.textureListTexture,
              isOpen && styles.open,
            )}
          >
            {textureData &&
              Object.keys(textureData).map((texture, index) => {
                return (
                  <TextureElement
                    key={index}
                    name={textureData[texture as keyof typeof textureData].name}
                    price={parseInt(
                      textureData[texture as keyof typeof textureData].price,
                    )}
                    id={textureData[texture as keyof typeof textureData].id}
                    thisImg={
                      textureData[texture as keyof typeof textureData].img
                    }
                    selected={
                      textureData[texture as keyof typeof textureData].img ===
                      imgData.img
                    }
                    textureData={textureData}
                  />
                );
              })}
          </ul>
        );

      default:
        return (
          <ul className={classNames(styles.textureList, isOpen && styles.open)}>
            {imgData &&
              imgData.items.map((texture, index) => {
                return (
                  <TextureElement
                    key={texture.id}
                    name={texture.name}
                    price={texture.price}
                    id={texture.id}
                    thisImg={texture.img}
                    selected={texture.img === imgData.img}
                  />
                );
              })}
          </ul>
        );
    }
  } else {
    return (
      <ul className={classNames(styles.textureList, styles.open)}>
        {imgData &&
          imgData.items.map((texture, index) => {
            return (
              <TextureElement
                key={texture.id}
                name={texture.name}
                price={texture.price}
                id={texture.id}
                thisImg={texture.img}
                selected={texture.img === imgData.img}
              />
            );
          })}
      </ul>
    );
  }
}
