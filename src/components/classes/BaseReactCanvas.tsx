import {Canvas} from 'butterfly-dag';
import $ from 'jquery';
import _ from 'lodash';

declare class Canvas {
    constructor(opts: any);

    wrapper: any;
    _moveData: any;
    _zoomData: any;
    nodes: any;
    groups: any;
    edges: any;
    _rootWidth: any;
    _rootHeight: any;
    _coordinateService: any;
    _guidelineService: any;

    on: (name: string, callback: (data: any) => void) => void;
    draw: (opts: any, callback: (data: any) => void) => void;
    redraw: (opts: any, callback: (data: any) => void) => void;
    zoom: (data: any, callback: (data: any) => void) => void;
    move: (data: any) => void;

    getGroup: (group: any) => any;
    getDataMap: () => any;
}

export default class BaseReactCanvas extends Canvas {
    private _opts: any;

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
                        opts.onStateChange(this.getDataMap());
                    }
                }
            });

            this.on('system.canvas.zoom', () => {
                if (opts.onCanvasMove) opts.onCanvasMove(this._getCanvasMoveData());
            });

            this.on('system.canvas.move', () => {
                if (opts.onCanvasMove) opts.onCanvasMove(this._getCanvasMoveData());
            });
        }

        this._opts = opts;
    }

    _getCanvasMoveData = () => {
        const domPos = this.wrapper?.getBoundingClientRect();

        return {
            position: this._moveData,
            zoom: this._zoomData,
            realPosition: [domPos.left, domPos.top],
        };
    };

    focusNodes = (param: any, type = ['node'], options: any, callback: any) => {
        this.focusNodesWithAnimate(param, type, options, callback, 0);
    };

    focusNodesWithAnimate(param: any, type = ['node'], options: any, callback: any, time = 500) {
        // 画布里的可视区域
        let canLeft = Infinity;
        let canRight = -Infinity;
        let canTop = Infinity;
        let canBottom = -Infinity;
        if (_.includes(type, 'node')) {
            const nodeIds = param.nodes;
            this.nodes
                .filter((_node: any) => {
                    return (
                        _.find(nodeIds, (id) => {
                            return _node.id === id;
                        }) !== undefined
                    );
                })
                .forEach((_node: any) => {
                    let _nodeLeft = _node.left;
                    let _nodeRight = _node.left + _node.getWidth(true);
                    let _nodeTop = _node.top;
                    let _nodeBottom = _node.top + _node.getHeight(true);
                    if (_node.group) {
                        const group = this.getGroup(_node.group);
                        if (group) {
                            _nodeLeft += group.left;
                            _nodeRight += group.left;
                            _nodeTop += group.top;
                            _nodeBottom += group.top;
                        }
                    }
                    if (_nodeLeft < canLeft) {
                        canLeft = _nodeLeft;
                    }
                    if (_nodeRight > canRight) {
                        canRight = _nodeRight;
                    }
                    if (_nodeTop < canTop) {
                        canTop = _nodeTop;
                    }
                    if (_nodeBottom > canBottom) {
                        canBottom = _nodeBottom;
                    }
                });
        }

        if (_.includes(type, 'group')) {
            const groupIds = param.groups;
            this.groups
                .filter((_group: any) => {
                    return _.find(groupIds, (id) => {
                        return id === _group.id;
                    });
                })
                .forEach((_group: any) => {
                    const _groupLeft = _group.left;
                    const _groupRight = _group.left + _group.getWidth();
                    const _groupTop = _group.top;
                    const _groupBottom = _group.top + _group.getHeight();
                    if (_groupLeft < canLeft) {
                        canLeft = _groupLeft;
                    }
                    if (_groupRight > canRight) {
                        canRight = _groupRight;
                    }
                    if (_groupTop < canTop) {
                        canTop = _groupTop;
                    }
                    if (_groupBottom > canBottom) {
                        canBottom = _groupBottom;
                    }
                });
        }
        const customOffset = _.get(options, 'offset') || [0, 0];
        const canDisX = canRight - canLeft;
        const terDisX = this._rootWidth - customOffset[0];
        const canDisY = canBottom - canTop;
        const terDisY = this._rootHeight - customOffset[1];
        const scaleX = terDisX / canDisX;
        const scaleY = terDisY / canDisY;
        // 这里要根据scale来判断
        let scale = scaleX < scaleY ? scaleX : scaleY;
        if (_.get(options, 'keepPreZoom')) {
            scale = this._zoomData < scale ? this._zoomData : scale;
        } else {
            scale = 1 < scale ? 1 : scale;
        }
        const terLeft = this._coordinateService._canvas2terminal('x', canLeft, {
            scale: scale,
            canOffsetX: 0,
            canOffsetY: 0,
            terOffsetX: 0,
            terOffsetY: 0,
            originX: 50,
            originY: 50,
        });
        const terRight = this._coordinateService._canvas2terminal('x', canRight, {
            scale: scale,
            canOffsetX: 0,
            canOffsetY: 0,
            terOffsetX: 0,
            terOffsetY: 0,
            originX: 50,
            originY: 50,
        });
        const terTop = this._coordinateService._canvas2terminal('y', canTop, {
            scale: scale,
            canOffsetX: 0,
            canOffsetY: 0,
            terOffsetX: 0,
            terOffsetY: 0,
            originX: 50,
            originY: 50,
        });
        const terBottom = this._coordinateService._canvas2terminal('y', canBottom, {
            scale: scale,
            canOffsetX: 0,
            canOffsetY: 0,
            terOffsetX: 0,
            terOffsetY: 0,
            originX: 50,
            originY: 50,
        });

        let offsetX = (terLeft + terRight - this._rootWidth) / 2;
        let offsetY = (terTop + terBottom - this._rootHeight) / 2;

        offsetX = -offsetX + customOffset[0];
        offsetY = -offsetY + customOffset[1];

        const animatePromise = new Promise<void>((resolve) => {
            $(this.wrapper).animate(
                {
                    top: offsetY,
                    left: offsetX,
                },
                time,
                () => {
                    resolve();
                },
            );
        });
        this._moveData = [offsetX, offsetY];

        this._coordinateService._changeCanvasInfo({
            canOffsetX: offsetX,
            canOffsetY: offsetY,
            scale: scale,
            originX: 50,
            originY: 50,
        });

        const zoomPromise = new Promise<void>((resolve) => {
            this.zoom(scale, () => {
                resolve();
            });
        });

        Promise.all([animatePromise, zoomPromise]).then(() => {
            callback && callback();
            if (this._opts.onCanvasMove) this._opts.onCanvasMove(this._getCanvasMoveData());
        });
    }

    focusCenter = (options: any, callback: any) => {
        this.focusCenterWithAnimate(options, callback, 0);
    };

    focusCenterWithAnimate(options: any, callback: any, time = 500) {
        const nodeIds = this.nodes.map((item: any) => {
            return item.id;
        });
        const groupIds = this.groups.map((item: any) => {
            return item.id;
        });

        if (nodeIds.length === 0 && groupIds.length === 0) {
            this.move([0, 0]);
            this.zoom(1, callback);
            return;
        }

        this.focusNodesWithAnimate(
            {
                nodes: nodeIds,
                groups: groupIds,
            },
            ['node', 'group'],
            options,
            callback,
            time,
        );
    }

    focusNode = (param: any, type = 'node', options: any, callback: any) => {
        this.focusNodeWithAnimate(param, type, options, callback);
    };

    focusNodeWithAnimate(param: any, type = 'node', options: any, callback: any, time = 500) {
        let node: any = null;

        if (_.isFunction(param)) {
            // 假如传入的是filter，则按照用户自定义的规则来寻找
            node = type === 'node' ? _.find(this.nodes, param) : _.find(this.groups, param);
        } else {
            // 假如传入的是id，则按照默认规则寻找
            node =
                type === 'node'
                    ? _.find(this.nodes, (item) => item.id === param)
                    : _.find(this.groups, (item) => item.id === param);
        }

        let top = 0;
        let left = 0;
        if (!node) {
            return;
        }
        top = node.top || node.y || 0;
        left = node.left || node.x || 0;
        if (node.height) {
            top += node.height / 2;
        }
        if (node.width) {
            left += node.width / 2;
        }

        if (node.group) {
            const group = _.find(this.groups, (_group) => _group.id === node.group);
            if (!group) return;
            top += group.top || group.y;
            left += group.left || group.x;
            if (group.height) {
                top += group.height / 2;
            }
            if (group.width) {
                left += group.width / 2;
            }
        }

        const customOffset = _.get(options, 'offset') || [0, 0];

        const containerW = this._rootWidth;
        const containerH = this._rootHeight;

        const targetY = containerH / 2 - top + customOffset[1];
        const targetX = containerW / 2 - left + customOffset[0];

        // animate不支持scale，使用setInterval自己实现
        const animatePromise = new Promise<void>((resolve) => {
            $(this.wrapper).animate(
                {
                    top: targetY,
                    left: targetX,
                },
                time,
                () => {
                    resolve();
                },
            );
        });
        this._moveData = [targetX, targetY];

        // 这里要根据scale来判断
        let scale = 1;
        if (_.get(options, 'keepPreZoom')) {
            scale = this._zoomData < scale ? this._zoomData : scale;
        }

        this._coordinateService._changeCanvasInfo({
            canOffsetX: targetX,
            canOffsetY: targetY,
            originX: 50,
            originY: 50,
            scale: scale,
        });

        const zoomPromise = new Promise<void>((resolve) => {
            this.zoom(scale, () => {
                resolve();
            });
        });

        Promise.all([animatePromise, zoomPromise]).then(() => {
            callback && callback();
        });

        this._guidelineService.isActive && this._guidelineService.clearCanvas();
    }
}
