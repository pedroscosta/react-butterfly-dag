import './App.css';

import {ButterflyDag} from '../../src/index';

const TestNode = () => {
    return (
        <div style={{width: '100px', height: '100px', background: 'red', color: 'white'}}>
            <div
                className="react-butterfly-dag-endpoint"
                id="1"
                style={{width: '10px', height: '10px', background: 'blue'}}
                {...{type: 'source'}}
            ></div>
            <p>Test Node 2</p>
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
    return (
        <div className="App">
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
                initialData={{
                    nodes: [
                        {
                            id: 'test-1',
                            type: TestNode,
                            left: 50,
                            top: 50,
                        },
                    ],
                }}
            />
        </div>
    );
}

export default App;
