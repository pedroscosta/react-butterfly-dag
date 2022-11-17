import './App.css';

import {ElementRef, useRef, useState} from 'react';
import ReactJson from 'react-json-view';
import {Background, ButterflyDag, ReactNodeData} from 'react-butterfly-dag';
import Node from './components/Node';

const TestNode = ({data}: {data: any}) => {
    return (
        <div style={{width: '100px', height: '100px', background: 'red', color: 'white'}}>
            <div
                className="react-butterfly-dag-endpoint"
                id="1"
                style={{width: '10px', height: '10px', background: 'blue'}}
                {...{type: 'source'}}
            ></div>
            <p>Test Node 2</p>
            {data.name}
            <div
                className="react-butterfly-dag-endpoint"
                id="2"
                style={{width: '10px', height: '10px', background: 'blue'}}
                {...{type: 'target'}}
            ></div>
        </div>
    );
};

function App() {
    const ref = useRef<ElementRef<typeof ButterflyDag>>(null);

    const [nodes, setNodes] = useState<ReactNodeData[]>([
        {
            id: 'books',
            type: Node,
            left: 50,
            top: 50,
            data: {
                title: 'Books',
                fields: ['id', 'name', 'author-id'],
            },
        },
    ]);

    const canvasState = {nodes};

    return (
        <div className="App">
            <div style={{flex: '1 1 auto', maxHeight: '75vh', position: 'relative'}}>
                <ButterflyDag
                    canvasProps={{
                        disLinkable: true,
                        linkable: true,
                        draggable: true,
                        zoomable: true,
                        moveable: true,
                        theme: {
                            edge: {
                                shapeType: 'AdvancedBezier',
                            },
                        },
                    }}
                    data={{
                        nodes,
                    }}
                    ref={ref}
                    onStateChange={(state) => setNodes(() => state.nodes)}
                >
                    <Background type="line" />
                </ButterflyDag>
            </div>
            <div style={{minHeight: '25vh', maxHeight: '25vh'}}>
                <button
                    onClick={() => {
                        setNodes((prev) => [
                            ...prev,
                            {
                                id: 'test' + (prev.length + 1).toString(),
                                type: TestNode,
                                left: 50,
                                top: 50,
                                data: {
                                    name: 'test ' + (prev.length + 1).toString(),
                                },
                            },
                        ]);
                    }}
                >
                    Add Node
                </button>
                <ReactJson src={canvasState} />
            </div>
        </div>
    );
}

App.whyDidYouRender = true;

export default App;
