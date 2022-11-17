import React, {forwardRef, useContext, useImperativeHandle} from 'react';
import ButterflyDagContext from './contexts/ButterflyDagContext';
import {CanvasMoveData} from './types';

interface ContextUpdaterHandle {
    onCanvasMove: (data: CanvasMoveData) => void;
}

const ContextUpdater = forwardRef<ContextUpdaterHandle>((props, ref) => {
    const {onCanvasMove} = useContext(ButterflyDagContext);

    useImperativeHandle(ref, () => ({
        onCanvasMove: (data) => {
            onCanvasMove(data);
        },
    }));

    return <></>;
});

export default ContextUpdater;
