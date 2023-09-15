import { useState, useEffect } from 'react';
import axios from 'axios';

function getTextureData() {
    return axios.get('https://dev.fresq.ru/app/ajax/?type=image').then(response => response);
};

const url = new URL(window.location.href);
const getCategory = url.searchParams.get('category');
const getName = url.searchParams.get('name');
const getImg = url.searchParams.get('img');
const getPrice = url.searchParams.get('imgPrice');

export const useTextureData = () => {
    const domContainer = document.querySelector('#constructor_app');
    // const isFullMode = domContainer?.getAttribute('data-is-fullMode');
    const isFullMode = true;

    const [textureData, setTextureData] = useState({ img: '', price: 0, catalog: '', items: [{ id: '', name: '', img: '', price: 0 }], fullData: {} });

    useEffect(() => {
        if(isFullMode) {
            getTextureData()
                .then(response => {
                        const defaultImgData = getCategory && getName
                            ? (Object.values((Object.values(response.data.items).filter((el: any) => el.name === getCategory)[0] as any).collection).filter((el: any) => el.name === getName)[0] as any).texture_data
                            : response.data.items[Object.keys(response.data.items)[0]].collection[Object.keys(response.data.items[Object.keys(response.data.items)[0]].collection)[0]].texture_data;

                        const JSONImgData = {
                            img: getImg ? getImg
                                : response.data.items[Object.keys(response.data.items)[0]].collection[Object.keys(response.data.items[Object.keys(response.data.items)[0]].collection)[0]].texture_data[0].img,
                            price: getPrice
                                    ? parseInt(getPrice)
                                    : response.data.items[Object.keys(response.data.items)[0]].collection[Object.keys(response.data.items[Object.keys(response.data.items)[0]].collection)[0]].texture_data[0].price
                            ,
                            catalog: getCategory ?? response.data.items[Object.keys(response.data.items)[0]].name,
                            items: defaultImgData ?? {},
                            fullData: response.data.items
                        };
                        setTextureData(JSONImgData);
                    }
                );
        } else {
            const JSONImgData = domContainer?.getAttribute('data-imgData');
            const ImgData =
                {
                    img: getImg
                        ? getImg
                        : JSONImgData
                            ? JSON.parse(JSONImgData)[0].img
                            : ''
                    ,
                    price: getPrice
                        ? parseInt(getPrice)
                        : JSONImgData
                            ? JSON.parse(JSONImgData)[0].price
                            : 0
                    ,
                    items: JSONImgData
                        ? JSON.parse(JSONImgData)
                        : {}
                    ,
                    catalog: JSONImgData
                        ? JSON.parse(JSONImgData)[0].catalog
                        : {}
                    ,
                    fullData: {}
                };
            setTextureData(ImgData);
        }
    }, []);

    return [textureData];
};