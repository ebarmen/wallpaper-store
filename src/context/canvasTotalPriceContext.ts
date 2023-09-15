import React from 'react';

type CanvasTotalPriceContextType = {
    price: number;
    setTotalPrice: (value: number) => void;
}
export const canvasTotalPriceContext = React.createContext<CanvasTotalPriceContextType>({
    price: 0,
    setTotalPrice: () => {},
});




