import React, {ReactNode} from 'react';
import {EndpointProps} from './types';

export const Endpoint = ({
    type,
    id,
    children,
    style,
    endpointProps,
}: {
    type: 'source' | 'target';
    id: string;
    children?: ReactNode;
    style?: React.CSSProperties;
    endpointProps: EndpointProps;
}) => {
    const endpointProps_: EndpointProps =
        typeof endpointProps?.expandArea === 'number'
            ? {
                  ...endpointProps,
                  expandArea: {
                      left: endpointProps.expandArea,
                      right: endpointProps.expandArea,
                      top: endpointProps.expandArea,
                      bottom: endpointProps.expandArea,
                  },
              }
            : endpointProps;

    return (
        <div
            className="react-butterfly-dag-endpoint"
            id={`dag-endpoint-${id}`}
            {...{type, 'endpoint-props': JSON.stringify(endpointProps)}}
            style={style}
        >
            {children}
        </div>
    );
};
