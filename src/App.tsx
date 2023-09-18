import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import './App.css';
import { TextureSelect } from './TextureSelect';
import { Constructor } from './Constructor';
import { canvasTextureContext } from './context/canvasTextureContext';
import { canvasBackgroundContext } from './context/canvasBackgroundContext';
import { canvasModeContext } from './context/canvasModeContext';
import { canvasHandFrameDataContext } from './context/canvasHandFrameDataContext';
import { canvasTotalPriceContext } from './context/canvasTotalPriceContext';
import { canvasOptionsContext } from './context/canvasOptionsContext';
import { useTextureData } from './hooks/useTextureData';
import { useBackgroundData } from './hooks/useBackgroundData';
import { useOptionsData } from './hooks/useOptionsData';
import { CategoryNames, ModeNames } from './types/namesList';
import { Converter } from './Converter';

const initialHandFrame = { width: 140, height: 220, x: 0, y: 35 };

// Костыль для ограничения дефолтных бэкграундов
const defaultExcludedBackgrounds = {
    classic: [1210, 1211, 1177, 1175],
    geo: [1210, 1211, 1177, 1175, 1030],
    pr: [1018, 1005, 978, 1030, 977, 1029]
}

function App() {
    const [isConverter, setIsConverter] = useState(false);

    const [initialImgData] = useTextureData();
    const [initialBackgroundData] = useBackgroundData();
    const [initialOptionsData] = useOptionsData();

    const [newImgData, setNewImgData] = useState(initialImgData);
    const [newBackgroundData, setNewBackgroundData] = useState(initialBackgroundData);
    const [newOptionsData, setNewOptionsData] = useState(initialOptionsData);
    const [handFrameData, setNewHandFrameData] = useState(initialHandFrame);

    const [totalPrice, setNewTotalPrice] = useState(0);

    const url = new URL(window.location.href);
    const defaultCategory = url.searchParams.get('category') ?? '';
    const defaultName = url.searchParams.get('name') ?? '';
    const defaultMode = url.searchParams.get('mode') ?? ModeNames.Handmode;
    const defaultIsSeamless = url.searchParams.get('isSeamless') === 'true' ?? false;
    const defaultIsSigned = url.searchParams.get('isSigned') === 'true' ?? false;
    const getConverter = url.searchParams.get('converter') === 'true' ?? false;

    const [mode, setNewMode ]:[string, Dispatch<SetStateAction<any>>] = useState(defaultMode ? defaultMode : ModeNames.Handmode);
    const [isSeamless, setIsSeamless]:[boolean, Dispatch<SetStateAction<any>>] = useState(defaultIsSeamless);
    const [isSigned, setIsSigned]:[boolean, Dispatch<SetStateAction<any>>] = useState(defaultIsSigned);
    const [defaultCategoryIndex, setDefaultCategoryIndex] = useState<number>(0);
    const [defaultCollectionIndex, setDefaultCollectionIndex] = useState<number>(0);

    const CanvasImgProvider = canvasTextureContext.Provider;
    const CanvasBackgroundProvider = canvasBackgroundContext.Provider;
    const CanvasModeProvider = canvasModeContext.Provider;
    const CanvasHandFrameSizeProvider = canvasHandFrameDataContext.Provider;
    const CanvasTotalPriceProvider = canvasTotalPriceContext.Provider;
    const CanvasOptionsProvider = canvasOptionsContext.Provider;

    // временный преобразователь данных с почты
    useEffect(() => {
        if (getConverter)
            setIsConverter(true);
        else
            setIsConverter(false);
    }, []);

    useEffect(() => {
        setNewImgData(initialImgData);
        setNewOptionsData(initialOptionsData);
        switch (initialImgData.catalog) {
            case CategoryNames.Classic:
                setNewBackgroundData({
                    ...initialBackgroundData,
                    items: initialBackgroundData.items.filter(item => !defaultExcludedBackgrounds.classic.includes(+item.id))
                });
                break;
            case CategoryNames.Geo:
                setNewBackgroundData({
                    ...initialBackgroundData,
                    items: initialBackgroundData.items.filter(item => !defaultExcludedBackgrounds.geo.includes(+item.id))
                });
                break;
            case CategoryNames.Pr:
                setNewBackgroundData({
                    ...initialBackgroundData,
                    items: initialBackgroundData.items.filter(item => !defaultExcludedBackgrounds.pr.includes(+item.id))
                });
                break;
        }

        // Дефолтно выбранные Категория и Коллекция
        for (let i = 0; i < Object.keys(initialImgData.fullData).length; i++) {
            if ((Object.values(initialImgData.fullData)[i] as any).name === defaultCategory) {
                setDefaultCategoryIndex(i);

                for (let j = 0; j < Object.keys((Object.values(initialImgData.fullData)[i] as any).collection).length; j++) {
                    if ((Object.values((Object.values(initialImgData.fullData)[i] as any).collection)[j] as any).name === defaultName) {
                        setDefaultCollectionIndex(j);
                    }
                }
            }
        }
    }, [initialImgData, initialBackgroundData, initialOptionsData]);

    return (
        <CanvasTotalPriceProvider value={{ price: totalPrice, setTotalPrice: setNewTotalPrice }}>
            <CanvasModeProvider value={{ mode: mode, setMode: setNewMode, isSeamless: isSeamless, setIsSeamless: setIsSeamless, isSigned: isSigned, setIsSigned: setIsSigned}}>
                <CanvasOptionsProvider value={{ options: newOptionsData, setOptions: setNewOptionsData }}>
                    <CanvasHandFrameSizeProvider value={{ handFrameData: handFrameData, setHandFrameData: setNewHandFrameData }}>
                        <CanvasImgProvider value={{ imgData: {img: newImgData.img, price: newImgData.price, catalog: newImgData.catalog, items: newImgData.items, fullData: newImgData.fullData}, setImgData: setNewImgData }}>
                            <CanvasBackgroundProvider value={{ backgroundData: {img: newBackgroundData.img, name: newBackgroundData.name, price: newBackgroundData.price, groupName: newBackgroundData.groupName, items: newBackgroundData.items}, setBackgroundData: setNewBackgroundData }}>
                                {initialImgData && !isConverter && (<div className='App'>
                                    <TextureSelect defaultBackgroundData={initialBackgroundData} defaultCategoryIndex={defaultCategoryIndex} defaultCollectionIndex={defaultCollectionIndex}/>
                                    <Constructor mode={mode} isSeamless={isSeamless} isSigned={isSigned}/>
                                </div>)}
                                {isConverter && <Converter />}
                            </CanvasBackgroundProvider>
                        </CanvasImgProvider>
                    </CanvasHandFrameSizeProvider>
                </CanvasOptionsProvider>
            </CanvasModeProvider>
        </CanvasTotalPriceProvider>
    );
}

export default App;
