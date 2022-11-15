export interface ReactNodeData {
    id: string;
    type: (props: {data: any}) => JSX.Element;
    left: number;
    top: number;

    draggable?: boolean;
    group?: string;
    scope?: string;

    data?: any;
}

export interface ReactDagData {
    nodes: ReactNodeData[];
}

export interface CanvasProps {
    zoomable?: boolean;
    moveable?: boolean;
    draggable?: boolean;
    linkable?: boolean;
    disLinkable?: boolean;
    layout?: any; // TODO: Add a more precise type
    layoutOptions?: any; // TODO: Add a more precise type
    theme?: {
        edge?: {
            type?: string;
            shapeType?: string;
            hasRadius?: boolean;
            label?: string | (() => JSX.Element);
            labelPosition?: number;
            labelOffset?: number;
            isAllowLinkInSameNode?: boolean;
            arrow?: boolean;
            arrowPosition?: number;
            arrowOffset?: number;
            isExpandWidth?: boolean;
            defaultAnimate?: boolean;
            Class?: any;
            dragEdgeZindex?: number;
        };
        endPoint?: {
            linkableHighlight?: boolean;
            limitNum?: number;
            expandArea?: {
                left?: number;
                top?: number;
                right?: number;
                bottom?: number;
            };
        };
        group?: {
            type?: string;
            includedGroups?: boolean;
            dragGroupZIndex?: number;
        };
        node?: {
            dragNodeZIndex?: number;
        };
        autoFixCanvas?: {
            enable?: boolean;
            autoMovePadding?: [number, number, number, number];
        };
        zoomGap?: number;
        autoResizeRootSize?: boolean;
    };
}

export interface CanvasMoveData {
    position: [number, number];
    zoom: number;
    realPosition: [number, number];
}
