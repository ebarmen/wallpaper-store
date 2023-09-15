import React, { useContext, useEffect, useState } from 'react';
import { Header } from './Header';
import { LineSeparator } from '../LineSeparator';
import { TextureList } from './TextureList';
import { canvasTextureContext } from '../context/canvasTextureContext';

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

interface ITextureSelectProps {
    defaultBackgroundData: BDType;
    defaultCategoryIndex: number;
    defaultCollectionIndex: number;
}

const domContainer = document.querySelector('#constructor_app');
// const isFullMode = domContainer?.getAttribute('data-is-fullMode');
const isFullMode = true;

export function TextureSelect({defaultBackgroundData, defaultCategoryIndex, defaultCollectionIndex}:ITextureSelectProps) {
    const [isOpenCategory, setIsOpenCategory] = useState(true);
    const [isOpenCollection, setIsOpenCollection] = useState(true);
    const [textureData, setTextureData] = useState({});
    const [categoryId, setCategoryId] = useState('');
    const [collectionId, setCollectionId] = useState('');
    const { imgData } = useContext(canvasTextureContext);

    useEffect(() => {
        if(isFullMode) {
            if(categoryId || collectionId) return;
            setTextureData(imgData.fullData);
            const defaultCategoryId = Object.keys(imgData.fullData)[defaultCategoryIndex];
            setCategoryId(defaultCategoryId);

            if(defaultCategoryId) {
                const defaultCollectionId = Object.keys(imgData.fullData[defaultCategoryId].collection)[defaultCollectionIndex];
                setCollectionId(defaultCollectionId);
            }
        }
    }, [imgData]);

    const keyTypedCollection = categoryId as keyof typeof textureData;
    const collectionData = textureData[keyTypedCollection];

    let newTextureData;
    if(collectionData) {
        const textureList = collectionData['collection' as keyof typeof collectionData];
        const keyTypedTexture = collectionId as keyof typeof textureList;
        newTextureData = textureList[keyTypedTexture as keyof typeof textureList];
    }

    if(isFullMode && textureData) {

        return (
            <div>
                <Header text={'Выбор каталога'} isOpen={isOpenCategory} onHandleOpen={(newState) => {setIsOpenCategory(newState)}}/>
                <LineSeparator />
                <div>
                    <TextureList
                        dataListType={'category'}
                        data={textureData}
                        isOpen={isOpenCategory}
                        onHandleCategoryChange={newCategoryId => {setCategoryId(newCategoryId)}}
                        selectedCategoryId={categoryId}
                    />
                </div>
                <Header text={'Выбор коллекции'} isOpen={isOpenCollection} onHandleOpen={(newState) => {setIsOpenCollection(newState)}}/>
                <LineSeparator />
                <div>
                    <TextureList
                        dataListType={'collection'}
                        data={collectionData}
                        isOpen={isOpenCollection}
                        onHandleCollectionChange={newCollectionId => {setCollectionId(newCollectionId)}}
                        selectedCollectionId={collectionId}
                        defaultBackgroundData={defaultBackgroundData}
                    />
                </div>
                <Header text={'Выбор текстуры'} isTextureImage={true}/>
                <LineSeparator />
                <div>
                    <TextureList
                        dataListType={'texture'}
                        data={newTextureData}
                        isOpen={!!newTextureData}
                    />
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <Header text={'Выбор текстуры'} isTextureImage={true}/>
                <LineSeparator />
                <TextureList />
            </div>
        );
    }
}
