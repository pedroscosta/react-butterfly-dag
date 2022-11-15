import {Endpoint, Node} from 'butterfly-dag';

import $ from 'jquery';
import {flushSync} from 'react-dom';
import {createRoot} from 'react-dom/client';
import {ReactDagData} from '../types';

export default class BaseReactNode extends Node {
    public dom: any; // Just to stop TS from complaining about this.dom not existing, although it would't raise an error.
    public reactOpts: ReactDagData;

    constructor(opts: any) {
        super(opts);
        this.reactOpts = opts;
    }

    draw = (props: any) => {
        const {options} = props;
        const container = $('<div class="butterfly-dag-node-container"></div>')
            .css('position', 'absolute')
            .css('top', props.top + 'px')
            .css('left', props.left + 'px')
            .attr('id', props.id);

        const root = createRoot(container[0]);

        flushSync(() => {
            root.render(options.type({data: options.data}));
        });

        return container[0];
    };

    mounted() {
        const endPointElements = $(this.dom).find('.react-butterfly-dag-endpoint').toArray();

        endPointElements.forEach((item) => {
            console.log({
                id: item.id,
                type: item.attributes.getNamedItem('type')?.value,
                dom: item,
                Class: Endpoint,
                linkable: true,
            });
            this.addEndpoint({
                id: item.id,
                type: item.attributes.getNamedItem('type')?.value,
                dom: item,
                Class: Endpoint,
                linkable: true,
            });
        });

        console.log(this.endpoints);
    }
}
