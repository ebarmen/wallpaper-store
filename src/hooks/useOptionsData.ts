import { useState, useEffect } from 'react';
import { OptionNames } from '../types/namesList';
import axios from 'axios';

function getOptionsData() {
    return axios.get('https://dev.fresq.ru/app/ajax/?type=options').then(response => response);
};

const url = new URL(window.location.href);
// const modeURL = url.searchParams.get('mode');
const getSeamless = url.searchParams.get('seamless');
const getStandartSizes = url.searchParams.get('standartSizes');
const getSignature = url.searchParams.get('signature');
const getVarnish = url.searchParams.get('varnish');
const getInstall = url.searchParams.get('install');
const getExample = url.searchParams.get('example');
const getExamples = url.searchParams.get('examples');
const getHiddenOptions = url.searchParams.get('hidden');
const getExtraPrice = url.searchParams.get('extra');

type TOptions = {
    items: TOptionItem[];
}

type TOptionItem = {
    id: number;
    name: string;
    price: number;
    priceExtra: number;
    priceCorrection: number;
    priceExtraCorrection: number;
    isPricePerMeter: boolean;
    isSet: boolean;
    isHidden: boolean;
    isExtraPrice: boolean;
    dataText: string;
}

export const useOptionsData = () => {
    // const { mode } = useContext(canvasModeContext);
    const [optionsData, setOptionsData] = useState<TOptions|null>(null);

    useEffect(() => {
        let isSubscribed = true;

        getOptionsData()
            .then(response => {
                if (isSubscribed) {
                    if (response.status) {
                        const hiddenOptions = getHiddenOptions?.split(',');

                        response.data.forEach((item: any) => {
                            switch (item.name) {
                                case OptionNames.Seamless:
                                    item.isSet = getSeamless ? getSeamless === 'true' : item.isSet;
                                    item.isHidden = hiddenOptions?.includes(item.name) ? true : item.isHidden;
                                    break;
                                case OptionNames.StandartSizes:
                                    item.isSet = getStandartSizes ? getStandartSizes === 'true' : item.isSet;
                                    item.isHidden = hiddenOptions?.includes(item.name) ? true : item.isHidden;
                                    break;
                                case OptionNames.Signature:
                                    item.isSet = getSignature ? getSignature === 'true' : item.isSet;
                                    item.isHidden = hiddenOptions?.includes(item.name) ? true : item.isHidden;
                                    break;
                                case OptionNames.Varnish:
                                    item.isSet = getVarnish ? getVarnish === 'true' : item.isSet;
                                    item.isHidden = hiddenOptions?.includes(item.name) ? true : item.isHidden;
                                    break;
                                case OptionNames.Install:
                                    item.isSet = getInstall ? getInstall === 'true' : item.isSet;
                                    item.isHidden = hiddenOptions?.includes(item.name) ? true : item.isHidden;
                                    break;
                                case OptionNames.Example:
                                    item.isSet = getExample ? getExample === 'true' : item.isSet;
                                    item.isHidden = hiddenOptions?.includes(item.name) ? true : item.isHidden;
                                    item.isExtraPrice = getExtraPrice ? getExtraPrice === 'true' : item.isExtraPrice;
                                    break;
                                case OptionNames.Examples:
                                    item.isSet = getExamples ? getExamples === 'true' : item.isSet;
                                    item.isHidden = hiddenOptions?.includes(item.name) ? true : item.isHidden;
                                    break;
                            }
                        });

                        const newOptionsData = {
                            items: [...response.data]
                        };
        
                        setOptionsData(newOptionsData);
                    }
                }
            }
        );
        
        return () => {
            isSubscribed = false;
        };
    }, []);

    return [optionsData];
}