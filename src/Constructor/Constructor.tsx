import React, { useState } from 'react';
import styles from './constructor.module.css';
import { LineSeparator } from "../LineSeparator";
import { Header } from "./Header";
import { CanvasContainer } from "./CanvasContainer";
import { OptionsContainer } from "./OptionsContainer";
import { SizeSelector } from './OptionsContainer/Options/SizeSelector';

interface IConstructorProps {
    mode: string;
    isSeamless: boolean;
    isSigned: boolean;
}

export function Constructor(props: IConstructorProps) {
    const { mode, isSeamless, isSigned} = props;

    const [flipped, setIsFlipped] = useState(false)

    const handleFlip = () =>{
        setIsFlipped(prev=> !prev)
    } 

    return (
        <div>
            <Header mode={mode}/>
            
            <LineSeparator />
            <div className={`${styles.container} row`}>
                
                <CanvasContainer mode={mode} isSeamless={isSeamless} isFlipped={flipped} isSigned={isSigned}/>
                <OptionsContainer mode={mode} handleFlip={handleFlip} />
            </div>
        </div>
    );
}
