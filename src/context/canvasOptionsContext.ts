import React, { Dispatch, SetStateAction } from 'react';

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

type CanvasOptionsContextType = {
    options: TOptions|null;
    setOptions: Dispatch<SetStateAction<TOptions|null>>;
}

export const canvasOptionsContext = React.createContext<CanvasOptionsContextType>({
    options: {
        items: [
            {
                id: 0,
                name: '',
                price: 0,
                priceExtra: 0,
                priceCorrection: 0,
                priceExtraCorrection: 0,
                isPricePerMeter: false,
                isSet: false,
                isHidden: false,
                isExtraPrice: false,
                dataText: ''
            }
        ]
    },

    setOptions: () => {},
});




