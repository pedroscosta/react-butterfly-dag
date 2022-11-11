import {Canvas} from 'butterfly-dag';

export default class BaseReactCanvas extends Canvas {
    constructor(opts: any) {
        super(opts);

        if (opts.onStateChange) {
            this.on('events', (data: any) => {
                // This doesn't seem to be the right way to do this, if you know to this better, please on a PR.
                if (
                    data.type &&
                    [
                        'node:move',
                        'links:delete',
                        'link:connect',
                        'link:reconnect',
                        'group:add',
                        'group:delete',
                        'group:move',
                        'group:addMembers',
                        'group:removeMembers',
                    ].includes(data.type)
                ) {
                    if (data.links?.length !== 0) {
                        console.log('event', data);
                        console.log('dataMap', this.getDataMap());
                        opts.onStateChange(this.getDataMap());
                    }
                }
            });
        }
    }
}
