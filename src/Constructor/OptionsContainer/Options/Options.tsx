import { useEffect, useState, useContext } from 'react';
import classNames from 'classnames';
import { SizeSelector } from './SizeSelector';
import { BackgroundColorSelector } from './BackgroundColorSelector';
import { SingleOption } from './SingleOption';
import { canvasOptionsContext } from '../../../context/canvasOptionsContext';
import { canvasBackgroundContext } from '../../../context/canvasBackgroundContext';
import { canvasTextureContext } from '../../../context/canvasTextureContext';
import { OptionNames, CategoryNames, ColorPickersNames } from '../../../types/namesList';
import { LineSeparator } from '../../../LineSeparator';
import styles from './options.module.css';

interface IOptionsProps {
    mode: string;
    handleFlip: ()=> void
}

export function Options({mode, handleFlip}:IOptionsProps) {
    const { options } = useContext(canvasOptionsContext);
    const { backgroundData } = useContext(canvasBackgroundContext);
    const { imgData } = useContext(canvasTextureContext);

    const [excludedOptions, setExcludedOptions] = useState<number[]>([]);
    // Корректировки цены опций
    const [installCorrection, setInstallCorrection] = useState<number>(0);
    const [exampleCorrection, setExampleCorrection] = useState<number>(0);
    const [exampleExtraCorrection, setExampleExtraCorrection] = useState<number>(0);
    const [examplesPrCorrection, setExamplesPrCorrection] = useState<number>(0);

    useEffect(() => {
        backgroundData.items.forEach(item => {
            if (item.groupName === backgroundData.groupName) {
                setInstallCorrection(item.installPrice);
                setExampleCorrection(item.examplePrice);
                setExamplesPrCorrection(item.examplesPrPrice);
                // Добавляем корректировку +2000 образцу 45х55 для категории CLASSIC и цветов Стандарт, Перламутр и Текстура
                setExampleExtraCorrection(item.exampleExtraPrice + (((imgData.catalog === CategoryNames.Classic) && ((backgroundData.groupName === ColorPickersNames.Standart) || (backgroundData.groupName === ColorPickersNames.Pearl) || (backgroundData.groupName === ColorPickersNames.Texture))) ? 2000 : 0));
            }

            if (item.groupName === backgroundData.groupName && item.excludedOptions) {
                const excludedArr: number[] = item.excludedOptions.map((option: string) => +option);
                setExcludedOptions(_state => excludedArr);
            } else if (item.groupName === backgroundData.groupName) setExcludedOptions(_state => []);
        });
    }, [backgroundData]);

    return (
        <div className={styles.container}>
           
            <div className={styles.heading}>Основа обоев</div>
            <BackgroundColorSelector selectedColorPicker={backgroundData.groupName}/>
            <div className={styles.heading}>Опции</div>
            {options && options.items && options.items.map((option, key) => {
                let correction, extraCorrection;

                switch (option.name) {
                    case OptionNames.Install:
                        correction = installCorrection;
                        extraCorrection = 0;
                        break;
                    case OptionNames.Example:
                        correction = exampleCorrection;
                        extraCorrection = exampleExtraCorrection;
                        break;
                    case OptionNames.Examples:
                        correction = examplesPrCorrection;
                        extraCorrection = 0;
                        break;
                    default:
                        correction = 0;
                        extraCorrection = 0;
                        break;
                }

                return (
                    <div key={key} className={classNames(excludedOptions.includes(option.id) && styles.singleOptionDisabled)}>
                        <div className={styles.separator}/>
                        <SingleOption
                            handleFlip={handleFlip}
                            name={option.name}
                            price={option.price}
                            priceExtra={option.priceExtra}
                            correction={correction}
                            extraCorrection={extraCorrection}
                            checked={option.isSet}
                            indexKey={key}
                            isPricePerMeter={option.isPricePerMeter}
                            dataText={option.dataText}
                            excluded={excludedOptions.includes(option.id)
                        }/>
                    </div>
                )
            })}
            <LineSeparator/>
        </div>
    );
}
