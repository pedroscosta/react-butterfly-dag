import {
    ElementRef,
    forwardRef,
    memo,
    ReactNode,
    useEffect,
    useImperativeHandle,
    useMemo,
    useReducer,
    useRef,
} from 'react';
import BaseReactCanvas from './classes/BaseReactCanvas';
import BaseReactNode from './classes/BaseReactNode';
import {CanvasMoveData, CanvasProps, ReactDagData, ReactNodeData} from './types';

import {ButterflyDagContextProvider} from '../contexts/ButterflyDagContext';
import ContextUpdater from './ContextUpdater';
import './dag.css';

const _transformReactToCanvasData: any = (data: ReactDagData) => {
    // TODO: Fix the return typing
    const nodes = data.nodes.map((node) => ({...node, Class: BaseReactNode}));
    return {nodes, edges: []};
};

const _transformCanvasToReactData = (data: any) => {
    const nodes: ReactNodeData[] = data.nodes.map((node: any) => {
        const nodeOpts = (({id, top, left, type, draggable, group, scope, data}) => ({
            id,
            top,
            left,
            type,
            draggable,
            group,
            scope,
            data,
        }))(node.reactOpts);

        return {...nodeOpts, left: node.left, top: node.top} as ReactNodeData;
    });
    return {nodes};
};

export interface ButterflyDagProps {
    data?: ReactDagData;
    transformReactToCanvasData?: (data: ReactDagData) => any;
    transformCanvasToReactData?: (data: any) => ReactDagData;
    canvasProps?: CanvasProps;
    onStateChange?: (state: any) => void;
    onInternalStateChange?: (state: any) => void;
    onCanvasMove?: (data: CanvasMoveData) => void;
    children?: ReactNode;
}

export interface ButterflyDagHandle {
    getCanvas: () => any;
}

export const ButterflyDag = memo(
    forwardRef<ButterflyDagHandle, ButterflyDagProps>(
        (
            {
                data = {nodes: []},
                transformReactToCanvasData = _transformReactToCanvasData,
                transformCanvasToReactData = _transformCanvasToReactData,
                canvasProps = {},
                onStateChange,
                onInternalStateChange,
                children,
                ...props
            },
            ref,
        ) => {
            const forceUpdate = useReducer((x) => x + 1, 0)[1]; // Workaround for functional components not having a forceUpdate

            const root = useRef<HTMLDivElement>(null);
            const canvas = useRef<BaseReactCanvas | null>(null);
            const contextUpdater = useRef<ElementRef<typeof ContextUpdater>>(null);

            const canvasData = useMemo(() => transformReactToCanvasData(data), [data]);

            useEffect(() => {
                if (canvas.current) updateCanvas(true);
            }, [data]);

            const updateCanvas = async (shoudForceUpdate = false, time = 500) => {
                await new Promise<void>((res, rej) => {
                    try {
                        canvas.current?.redraw(canvasData, () => {
                            canvas.current?.focusCenterWithAnimate(undefined, undefined, time);
                            res();
                        });
                    } catch (e) {
                        rej(e);
                    }
                });

                if (shoudForceUpdate) forceUpdate();
            };

            useImperativeHandle(ref, () => ({
                getCanvas: () => {
                    return canvas.current;
                },
            }));

            useEffect(() => {
                canvas.current =
                    canvas.current ||
                    new BaseReactCanvas({
                        ...canvasProps,
                        onStateChange: (newState: any) => {
                            if (onStateChange) onStateChange(transformCanvasToReactData(newState));

                            if (onInternalStateChange) onInternalStateChange(newState);
                        },
                        onCanvasMove: (data: CanvasMoveData) => {
                            contextUpdater.current?.onCanvasMove(data);
                            if (props.onCanvasMove) props.onCanvasMove(data);
                        },
                        root: root.current,
                    });

                updateCanvas(true, 0);
            }, []);

            return (
                <>
                    <div ref={root} style={{width: '100%', height: '100%'}}>
                        <ButterflyDagContextProvider>
                            <ContextUpdater ref={contextUpdater} />
                            {children}
                        </ButterflyDagContextProvider>
                    </div>
                </>
            );
        },
    ),
    (prev, next) => {
        if (!next.data || !prev.data) return false;
        if (!next.data.nodes || !prev.data.nodes) return false;
        if (next.data.nodes.length != prev.data.nodes.length) return false;

        for (let i = 0; i < next.data.nodes.length; i++) {
            const nextNode = (({id, type, draggable, group, scope, data}) => ({
                id,
                type,
                draggable,
                group,
                scope,
                data,
            }))(next.data.nodes[i]);
            const prevNode = (({id, type, draggable, group, scope, data}) => ({
                id,
                type,
                draggable,
                group,
                scope,
                data,
            }))(prev.data.nodes[i]);

            if (
                (prevNode.draggable == undefined && nextNode.draggable == true) ||
                (nextNode.draggable == undefined && prevNode.draggable == true)
            ) {
                // This fixes an render issue because draggable has a default value of true
                delete prevNode.draggable;
                delete nextNode.draggable;
            }

            if (JSON.stringify(nextNode) !== JSON.stringify(prevNode)) return false;
        }
        return true;
    },
);
