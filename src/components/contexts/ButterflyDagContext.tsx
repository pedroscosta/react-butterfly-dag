import React, {createContext, ReactNode, useState} from 'react';
import {CanvasMoveData} from '../types';

interface ButterflyDagContextType extends CanvasMoveData {
    onCanvasMove: (data: any) => void;
}

const initialValue: ButterflyDagContextType = {
    position: [0, 0],
    zoom: 1,
    realPosition: [0, 0],
    onCanvasMove: () => {},
};

const ButterflyDagContext = createContext<ButterflyDagContextType>(initialValue);

export const ButterflyDagContextProvider = ({children}: {children: ReactNode}) => {
    const [position, setPosition] = useState(initialValue.position);
    const [zoom, setZoom] = useState(initialValue.zoom);
    const [realPosition, setRealPosition] = useState(initialValue.realPosition);

    const onCanvasMove = (data: CanvasMoveData) => {
        setPosition(data.position);
        setZoom(data.zoom);
        setRealPosition(data.realPosition);
    };

    return (
        <ButterflyDagContext.Provider value={{position, zoom, realPosition, onCanvasMove}}>
            {children}
        </ButterflyDagContext.Provider>
    );
};

export default ButterflyDagContext;
