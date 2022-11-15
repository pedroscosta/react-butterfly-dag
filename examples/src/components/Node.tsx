import {Endpoint} from '../../../src/index';
import './Node.css';

const Node = ({data: {title, fields}}: {data: any}) => {
    return (
        <div className="table-node-root">
            <div className="table-node-header">{title}</div>
            {fields.map((field: string) => (
                <div className="table-node-item" key={field}>
                    <Endpoint type="target" id={`${field}-target`} />
                    {field}
                    <Endpoint type="source" id={`${field}-source`} />
                </div>
            ))}
        </div>
    );
};

export default Node;
