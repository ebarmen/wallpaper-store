import React, { useContext, useEffect, useState } from 'react';
import styles from './total.module.css';
import { canvasTotalPriceContext } from "../../../context/canvasTotalPriceContext";
import { canvasHandFrameDataContext } from "../../../context/canvasHandFrameDataContext";
import { canvasBackgroundContext } from "../../../context/canvasBackgroundContext";
import { canvasOptionsContext } from "../../../context/canvasOptionsContext";
import { canvasTextureContext } from "../../../context/canvasTextureContext";
import { LineSeparator } from "../../../LineSeparator";

type TCalculatePriceProps = {
    width: number,
    height: number,
    texturePrice: number,
    backgroundPrice: number,
    optionsPrice: number,
}

type TCalcTotalWidthProps = {
    width: number,
    height: number,
}

function calculatePrice(props: TCalculatePriceProps) {
    const { width, height, texturePrice, backgroundPrice, optionsPrice } = props;
    const totalWidth = calcTotalWidth({width, height});

    return totalWidth*(texturePrice + backgroundPrice) + optionsPrice;
}


function calcTotalWidth(props: TCalcTotalWidthProps) {
    const { width, height } = props;

    return (Math.round((Math.round(width)/100 * Math.round(height)/100)*10000))/10000;
}

export function Total() {
    const { price, setTotalPrice } = useContext(canvasTotalPriceContext);
    const { handFrameData } = useContext(canvasHandFrameDataContext);
    const { imgData } = useContext(canvasTextureContext);
    const { backgroundData } = useContext(canvasBackgroundContext);
    const { options } = useContext(canvasOptionsContext);

    const calcOptionSquare = () => {
        const width = handFrameData.width;
        const height = handFrameData.height;
        return Math.round(calcTotalWidth({ width, height }) * 100) / 100;
    }

    const calcOptionPrice = (options:{ name: string, price: number, priceExtra: number, priceCorrection: number, priceExtraCorrection: number, isSet: boolean, isPricePerMeter: boolean, isExtraPrice: boolean }[]):number => {
        let optionsPrice:number = 0;
        const width = handFrameData.width;
        const height = handFrameData.height;
        const totalWidth = calcTotalWidth({ width, height });

        options.forEach((item) => {
            if (item.isSet && !item.isPricePerMeter) optionsPrice += (item.isExtraPrice ? (item.priceExtra + item.priceExtraCorrection) : (item.price + item.priceCorrection));
            if (item.isSet && item.isPricePerMeter) optionsPrice += (item.isExtraPrice ? (item.priceExtra + item.priceExtraCorrection) : (item.price + item.priceCorrection))*totalWidth;
        })
        return optionsPrice;
    }

    // const url = new URL(window.location.href);
    // const getImgPrice = url.searchParams.get('imgPrice');
    // const getBackgroundPrice = url.searchParams.get('backgroundPrice');

    useEffect(() => {
        if (options) {
            const newPrice = calculatePrice({
                width: handFrameData.width,
                height: handFrameData.height,
                // texturePrice: getImgPrice ? parseInt(getImgPrice) : imgData.price,
                // backgroundPrice: getBackgroundPrice ? parseInt(getBackgroundPrice) : backgroundData.price,
                texturePrice: imgData.price,
                backgroundPrice: backgroundData.price,
                optionsPrice: calcOptionPrice(options.items),
            });
            
            setTotalPrice(Math.round(newPrice));
        }
    });

    return (
        <div>
            <div className={styles.container}>
                <div className={`${styles.list} row`}>
                    <div className={styles.text}>Итого: </div>
                    <div id={'price'} data-price={price} className={styles.price}><span>{price}</span> <span>р.</span><span className={styles.star}> *</span></div>
                </div>
                <div className={styles.bottomText}><span className={styles.star}>* </span>Цена может измениться после уточнения технического задания</div>
            </div>
        </div>
    );
}
