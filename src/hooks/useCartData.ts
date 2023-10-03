import { useState, useEffect } from 'react';


export const useCartData = () => {
    const domContainer = document.querySelector('#constructor_app');
    const [cartImgData, setCarImgtData] = useState<any>();
  

useEffect(() => {
     const domContainer = document.querySelector('#constructor_app');
    const JSONCartData = domContainer?.getAttribute('data-cartimgdata');
    const CartData = JSONCartData ? JSON.parse(JSONCartData) : '';
    let srcData = CartData && CartData.map((i:any)=> 'https://dev.fresq.ru/' + i)
   
    setCarImgtData(srcData);
}, []);


return [cartImgData];
};

export const useCartInfoData = () => {
    
    const domContainer = document.querySelector('#constructor_app');
    const [cartInfoData, setCarInfotData] = useState<any>();

    useEffect(() => {
        
        const JSONnfoData = domContainer?.getAttribute('data-catrinfodata');
        const JSONInfoData = JSONnfoData ? JSON.parse(JSONnfoData): '';
        setCarInfotData(JSONInfoData)
    }, []);
    return [cartInfoData]
}