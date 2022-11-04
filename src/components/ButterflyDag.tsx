import {Canvas} from 'butterfly-dag';
import {useEffect, useMemo, useRef, useState} from 'react';
import BaseReactNode from './classes/BaseReactNode';
import {CanvasProps, ReactDagData} from './types';

const _transformReactToCanvasData: any = (data: ReactDagData) => {
    // TODO: Fix the return typing
    const nodes = data.nodes.map((node) => ({...node, Class: BaseReactNode}));
    return {nodes, edges: []};
};

export interface ButterflyDagProps {
    initialData?: ReactDagData;
    transformReactToCanvasData?: (data: ReactDagData) => any;
    canvasProps?: CanvasProps;
}

export const ButterflyDag = ({
    initialData = {nodes: []},
    transformReactToCanvasData = _transformReactToCanvasData,
    canvasProps = {},
}: ButterflyDagProps) => {
    const [reactData, setReactData] = useState<ReactDagData>(initialData);

    const root = useRef(null);
    const canvas = useRef<any>(null);

    const canvasData = useMemo(() => transformReactToCanvasData(reactData), [reactData]);

    useEffect(() => {
        console.log(canvas);
        canvas.current =
            canvas.current ||
            new Canvas({
                ...canvasProps,
                root: root.current,
            });

        canvas.current.draw(canvasData, () => {
            canvas.current.focusCenterWithAnimate();
        });
    }, []);

    return <div ref={root} style={{width: '100%', height: '100%'}}></div>;
};
