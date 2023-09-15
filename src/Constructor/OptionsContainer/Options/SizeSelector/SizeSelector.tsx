import { ChangeEvent, useContext, useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './sizeselector.module.css';
import { canvasHandFrameDataContext } from '../../../../context/canvasHandFrameDataContext';
import { ModeNames } from '../../../../types/namesList';

interface SizeSelectorProps {
    mode: string;
}

export function SizeSelector({mode}:SizeSelectorProps) {
    const { handFrameData, setHandFrameData } = useContext(canvasHandFrameDataContext);

    const [wallWidth, setWallWidth] = useState(Math.round(handFrameData.width));
    const [wallHeight, setWallHeight] = useState(Math.round(handFrameData.height));
    const [wallArea, setWallArea]= useState(((handFrameData.height*handFrameData.width)/10000).toFixed(2))

    const setNewSizes = () => {
        const wallX = Math.round(handFrameData.x - ((wallWidth - handFrameData.width) / 2));
        const wallY = Math.round(handFrameData.y - ((wallHeight - handFrameData.height) / 2));

        setHandFrameData({
            width: wallWidth,
            height: wallHeight,
            x: wallX >= 0 ? wallX : 0,
            y: wallY >= 0 ? wallY : 0
        });
    }

    const handleChangeWidth = (e: ChangeEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.replace(/^0+/, '');
        const value = e.target.value;

        if (value.length <= 4) setWallWidth(Math.round(+value));
    }

    const handleChangeHeight = (e: ChangeEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.replace(/^0+/, '');
        const value = e.target.value;

        if (value.length <= 4) setWallHeight(Math.round(+e.target.value));
    }

    const handleBlur = () => setNewSizes();

    const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') setNewSizes();
    }

    useEffect(() => {
        setWallWidth(Math.round(handFrameData.width));
        setWallHeight(Math.round(handFrameData.height));
        setWallArea(((handFrameData.height*handFrameData.width)/10000).toFixed(2))
    }, [handFrameData]);

    return (
        <div>
            {(handFrameData.width) && (
                <div>
                    <div className={classNames(styles.sizeInputs, 'row')}>
                        <div className={classNames(styles.sizeInput, mode === ModeNames.Panels && styles.standartOption, wallWidth > 1140 && styles.sizeInputError)}>
                            <label htmlFor='width'>Ширина(см)</label>
                            <input id={'width'} type='number' disabled={mode === ModeNames.Panels} value={wallWidth} onChange={handleChangeWidth} onBlur={handleBlur} onKeyDown={handleKeyDown}/>
                            {mode === ModeNames.Panels && <svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 155.9 155.9' xmlSpace='preserve'>
                                <path d='M105.2,67.6c0-9.3,0-22.4-0.1-23c-1-14.1-12.9-25.1-27-25.1c-14.1,0-26,11-27,25.1c0,0.6-0.1,14.1-0.1,22.9
                                    c-4.5,0.5-8,4.3-8,8.9v27.3c0,18,14.6,32.6,32.6,32.6h4.4c18,0,32.6-14.6,32.6-32.6V76.4C112.8,71.9,109.5,68.3,105.2,67.6z
                                    M81.4,101.1v11.3c0,1.8-1.4,3.2-3.2,3.2s-3.2-1.4-3.2-3.2v-11.3c-1.6-1-2.7-2.8-2.7-4.9c0-3.2,2.6-5.8,5.8-5.8s5.8,2.6,5.8,5.8
                                    C84,98.2,83,100,81.4,101.1z M59.9,67.5c0-8.4,0-21,0-22.3c0.7-9.5,8.7-16.8,18.2-16.8c9.5,0,17.5,7.4,18.2,16.8
                                    c0,1.3,0,13.5,0,22.3H59.9z'/>
                            </svg>}
                            {wallWidth > 665 && mode === ModeNames.Handmode && <p className={styles.sizeError}>Нестандартная ширина. Необходим индивидуальный раскрой панелей.</p>}
                        </div>
                        <div className={classNames(styles.sizeInput, mode === ModeNames.Panels && styles.standartOption, wallHeight > 290 && styles.sizeInputError)}>
                            <label htmlFor='height'>Высота(см)</label>
                            <input id={'height'} type='number' disabled={mode === ModeNames.Panels} value={wallHeight} onChange={handleChangeHeight} onBlur={handleBlur} onKeyDown={handleKeyDown}/>
                            {mode === ModeNames.Panels && <svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 155.9 155.9' xmlSpace='preserve'>
                                <path d='M105.2,67.6c0-9.3,0-22.4-0.1-23c-1-14.1-12.9-25.1-27-25.1c-14.1,0-26,11-27,25.1c0,0.6-0.1,14.1-0.1,22.9
                                    c-4.5,0.5-8,4.3-8,8.9v27.3c0,18,14.6,32.6,32.6,32.6h4.4c18,0,32.6-14.6,32.6-32.6V76.4C112.8,71.9,109.5,68.3,105.2,67.6z
                                    M81.4,101.1v11.3c0,1.8-1.4,3.2-3.2,3.2s-3.2-1.4-3.2-3.2v-11.3c-1.6-1-2.7-2.8-2.7-4.9c0-3.2,2.6-5.8,5.8-5.8s5.8,2.6,5.8,5.8
                                    C84,98.2,83,100,81.4,101.1z M59.9,67.5c0-8.4,0-21,0-22.3c0.7-9.5,8.7-16.8,18.2-16.8c9.5,0,17.5,7.4,18.2,16.8
                                    c0,1.3,0,13.5,0,22.3H59.9z'/>
                            </svg>}
                           
                            {wallHeight > 290 && mode === ModeNames.Handmode && <p className={styles.sizeError}>
                                Нестандартная высота. Необходим индивидуальный раскрой панелей.
                            </p>
                        }
                        </div>
                        <div>{wallArea}м2</div>
                    </div>
                </div>
            )}
        </div>

    );
}
