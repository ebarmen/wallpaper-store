import React, { Dispatch, SetStateAction } from 'react';

type CanvasTextureContextType = {
    imgData: {
        img: string,
        price: number,
        catalog: string,
        items:
            {
                id: string,
                name: string,
                img: string,
                price: number,
            }[],
        fullData: any
    };
    setImgData: Dispatch<SetStateAction<
        {
            img: string;
            price: number;
            catalog: string;
            items:
                {
                    id: string,
                    name: string,
                    img: string,
                    price: number,
                }[],
            fullData: any
        }>>
}
export const canvasTextureContext = React.createContext<CanvasTextureContextType>({
    imgData: {
        img: '',
        price: 0,
        catalog: '',
        items: [
            {
                id: '',
                name: '',
                img: '',
                price: 0,
            }
        ],
        fullData: {}
    },
    setImgData: () => {},
});




