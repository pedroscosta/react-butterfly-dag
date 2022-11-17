import {Endpoint} from 'react-butterfly-dag';
import './Node.css';

const Node = ({data: {title, fields}}: {data: any}) => {
    return (
        <div className="table-node-root">
            <div className="table-node-header">{title}</div>
            {fields.map((field: string) => (
                <div className="table-node-item" key={field}>
                    <Endpoint
                        type="target"
                        id={`${field}-target`}
                        style={{
                            background: '#fff',
                            width: '0.5rem',
                            height: '0.5rem',
                            borderRadius: '0.5rem',
                            position: 'absolute',
                            left: '0.2rem',
                        }}
                        endpointProps={{expandArea: 10}}
                    />
                    {field}
                    <Endpoint
                        type="source"
                        id={`${field}-source`}
                        style={{
                            background: '#fff',
                            width: '0.5rem',
                            height: '0.5rem',
                            borderRadius: '0.5rem',
                            position: 'absolute',
                            right: '0.2rem',
                        }}
                        endpointProps={{expandArea: 10}}
                    />
                </div>
            ))}
        </div>
    );
};

export default Node;
