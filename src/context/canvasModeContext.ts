import React from 'react';
import { ModeNames } from '../types/namesList';

type CanvasModeContextType = {
    mode: string;
    setMode: (value: string) => void;
    isSeamless: boolean;
    setIsSeamless: (value: boolean) => void;
    isSigned: boolean;
    setIsSigned: (value: boolean) => void;
}

export const canvasModeContext = React.createContext<CanvasModeContextType>({
    mode: ModeNames.Handmode,
    setMode: () => {},
    isSeamless: true,
    setIsSeamless: () => {},
    isSigned: false,
    setIsSigned: () => {}
});
