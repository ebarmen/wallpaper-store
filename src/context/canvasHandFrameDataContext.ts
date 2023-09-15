import React, { Dispatch, SetStateAction } from 'react';

type CanvasHandFrameDataContextType = {
    handFrameData: {
        width: number,
        height: number,
        x: number,
        y: number
    }

    setHandFrameData: Dispatch<SetStateAction<{
        width: number,
        height: number,
        x: number,
        y: number
    }>>
};

export const canvasHandFrameDataContext = React.createContext<CanvasHandFrameDataContextType>({
    handFrameData: {
        width: 0,
        height: 0,
        x: 0,
        y: 0
    },
    
    setHandFrameData: () => {},
});




