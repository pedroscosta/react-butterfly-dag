import {forwardRef, memo, useEffect, useImperativeHandle, useMemo, useReducer, useRef} from 'react';
import {createPortal} from 'react-dom';
import BaseReactCanvas from './classes/BaseReactCanvas';
import BaseReactNode from './classes/BaseReactNode';
import {CanvasProps, ReactDagData, ReactNodeData} from './types';

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
            },
            ref,
        ) => {
            const forceUpdate = useReducer((x) => x + 1, 0)[1]; // Workaround for functional components not having a forceUpdate

            const root = useRef<HTMLDivElement>(null);
            const canvas = useRef<any>(null);

            const canvasData = useMemo(() => transformReactToCanvasData(data), [data]);

            useEffect(() => {
                if (canvas.current) updateCanvas(true);
            }, [data]);

            const updateCanvas = async (shoudForceUpdate = false) => {
                await new Promise<void>((res, rej) => {
                    try {
                        canvas.current.redraw(canvasData, () => {
                            canvas.current.focusCenterWithAnimate();
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
                        root: root.current,
                    });

                updateCanvas(true);
            }, []);

            return (
                <>
                    {canvas.current && (
                        <>
                            {data.nodes.map((node) => {
                                const dom = root.current?.querySelector(`#${node.id}`);

                                if (!dom) return;

                                return createPortal(node.type({data: node.data}), dom);
                            })}
                        </>
                    )}
                    <div ref={root} style={{width: '100%', height: '100%'}}></div>
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

            if (JSON.stringify(nextNode) != JSON.stringify(prevNode))
                console.log('props change', JSON.stringify(nextNode), JSON.stringify(prevNode));
            if (JSON.stringify(nextNode) !== JSON.stringify(prevNode)) return false;
        }
        // console.log('props change', prev, next);
        return true;
    },
);
