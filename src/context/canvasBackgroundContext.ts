import React, { Dispatch, SetStateAction } from 'react';

type CanvasBackgroundContextType = {
    backgroundData: {
        img: string,
        name: string,
        price: number,
        groupName: string,
        items:
            {
                price: number,
                premPrice: number,
                groupName: string,
                excludedOptions: any,
                installPrice: number,
                examplePrice: number,
                exampleExtraPrice: number,
                examplesPrPrice: number,
                id: string,
                colors: {
                    img: string,
                    name: string
                }[],
                premColors: {
                    img: string,
                    name: string
                }[],
            }[]
    };

    setBackgroundData: Dispatch<SetStateAction<
        {
            img: string,
            name: string,
            price: number,
            groupName: string,
            items:
                {
                    price: number,
                    premPrice: number,
                    groupName: string,
                    excludedOptions: any,
                    installPrice: number,
                    examplePrice: number,
                    exampleExtraPrice: number,
                    examplesPrPrice: number,
                    id: string,
                    colors: {
                        img: string,
                        name: string
                    }[],
                    premColors: {
                        img: string,
                        name: string
                    }[],
                }[]
        }>>
}

export const canvasBackgroundContext = React.createContext<CanvasBackgroundContextType>({
    backgroundData: {
        img: '',
        name: '',
        price: 0,
        groupName: '',
        items: [
            {
                price: 0,
                premPrice: 0,
                groupName: '',
                excludedOptions: false,
                installPrice: 0,
                examplePrice: 0,
                exampleExtraPrice: 0,
                examplesPrPrice: 0,
                id: '',
                colors: [{
                    img: '',
                    name: ''
                }],
                premColors: [{
                    img: '',
                    name: ''
                }]
            }
        ]
    },
    
    setBackgroundData: () => {},
});
