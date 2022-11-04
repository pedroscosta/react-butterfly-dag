import {Endpoint, Node} from 'butterfly-dag';

import $ from 'jquery';
import {render} from 'react-dom';

export default class BaseReactNode extends Node {
    public dom: any; // Just to stop TS from complaining about this.dom not existing, although it would't raise an error.

    constructor(opts: any) {
        super(opts);
    }

    draw = (props: any) => {
        const {options} = props;
        const container = $('<div class="butterfly-dag-node-container"></div>')
            .css('position', 'absolute')
            .css('top', props.top + 'px')
            .css('left', props.left + 'px')
            .attr('id', props.id);

        render(options.type(options.data), container[0]);

        return container[0];
    };

    mounted() {
        const endPointElements = $(this.dom).find('.react-butterfly-dag-endpoint').toArray();

        endPointElements.forEach((item) => {
            console.log(this);
            this.addEndpoint({
                id: item.id,
                type: item.attributes.getNamedItem('type')?.value,
                dom: item,
                Class: Endpoint,
            });
        });
    }
}
