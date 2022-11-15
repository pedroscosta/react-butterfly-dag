import {ReactNode} from 'react';

export const Endpoint = ({
    type,
    id,
    children,
}: {
    type: 'source' | 'target';
    id: string;
    children?: ReactNode;
}) => {
    return (
        <div
            className="react-butterfly-dag-endpoint"
            id={`dag-endpoint-${id}`}
            style={{width: '10px', height: '10px', background: 'blue'}}
            {...{type}}
        >
            {children}
        </div>
    );
};
