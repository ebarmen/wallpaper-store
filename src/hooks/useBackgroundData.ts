import { useState, useEffect } from 'react';
import axios from 'axios';

function getBackgroundData() {
    return axios.get('https://dev.fresq.ru/app/ajax/?type=background').then(response => response);
};

const url = new URL(window.location.href);
const getImg = url.searchParams.get('background');
const getName = url.searchParams.get('backgroundName');
const getPrice = url.searchParams.get('backgroundPrice');
const getGroupName = url.searchParams.get('groupName');

export const useBackgroundData = () => {
    const domContainer = document.querySelector('#constructor_app');
    // const isFullMode = domContainer?.getAttribute('data-is-fullMode');
    const isFullMode = true;

    const [backgroundData, setBackgroundData] = useState({ img: '', name: '', price: 0, groupName: '', items: [{ id: '', groupName: '', premPrice: 0, price: 0, excludedOptions: false, installPrice: 0, examplePrice: 0, exampleExtraPrice: 0, examplesPrPrice: 0, colors: [{ img: '', name: '' }], premColors: [{ img: '', name: '' }] }] });

    useEffect(() => {
        if(isFullMode) {
            getBackgroundData()
                .then(response => {
                    const newBackgroundData = {
                        img: getImg ? getImg : response.data[0].colors[0].img,
                        name: getName ? getName : response.data[0].colors[0].name,
                        price: getPrice ? parseInt(getPrice) : response.data[0].price,
                        groupName: getGroupName ? getGroupName : response.data[0].groupName,
                        items: response.data
                    };

                    setBackgroundData(newBackgroundData);
                });
        } else {
            const JSONBackgroundData = domContainer?.getAttribute('data-backgroundData');
            const newBackgroundData = {
                img: getImg
                    ? getImg
                    : JSONBackgroundData
                        ? JSON.parse(JSONBackgroundData)[0].colors[0].img
                        : ''
                ,
                name: getName
                    ? getName
                    : JSONBackgroundData
                        ? JSON.parse(JSONBackgroundData)[0].colors[0].name
                        : ''
                ,
                price: getPrice
                    ? parseInt(getPrice)
                    : JSONBackgroundData
                        ? JSON.parse(JSONBackgroundData)[0].price
                        : 0
                ,
                groupName: getGroupName
                    ? getGroupName
                    : JSONBackgroundData
                        ? JSON.parse(JSONBackgroundData)[0].groupName
                        : ''
                ,
                items: JSONBackgroundData
                    ? JSON.parse(JSONBackgroundData)
                    : {}
            }
            setBackgroundData(newBackgroundData);
        }
    }, []);

    return [backgroundData];
};