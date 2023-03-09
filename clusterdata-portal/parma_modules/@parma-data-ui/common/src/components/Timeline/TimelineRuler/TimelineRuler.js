import React from 'react';
import PropTypes from 'prop-types';
import cn from 'bem-cn-lite';
import moment from 'moment';
import {Button} from 'lego-on-react';
import Icon from '../../Icon/Icon';
import iconPlus from '../../../assets/icons/plus.svg';
import iconMinus from '../../../assets/icons/minus.svg';
import iconNow from '../../../assets/icons/now-arrow.svg';

// import './TimelineRuler.scss';

const b = cn('yc-timeline-ruler');

const minute = 60 * 1000;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const month = day * 30;
const year = day * 365;
const ranges = [
    minute,
    minute * 2,
    minute * 5,
    minute * 10,
    minute * 20,
    minute * 30,
    minute * 60,
    minute * 120,
    minute * 180,
    minute * 360,
    minute * 720,
    day,
    day * 2,
    day * 3,
    week,
    week * 2,
    month,
    month * 2,
    month * 3,
    year
];

function getCaptionRange(totalRange, tickCount) {
    for (let i = 0; i < ranges.length; i++) {
        if (tickCount * ranges[i] > totalRange) {
            return ranges[i];
        }
    }
    return year;
}

function formatTickTimestamps(ts) {
    const time = moment(ts);
    if (time.isSame(time.clone().startOf('day'))) {
        return time.format('YYYY-MM-DD');
    }
    return time.format('HH:mm');
}

function getInitialTimestamp(leftBound, range) {
    const offset = (leftBound + range - new Date().getTimezoneOffset() * minute) % range;
    if (range >= week) {
        const time = moment(leftBound - offset + range);
        if (range >= year) {
            time.startOf('year');
        } else if (range >= month) {
            time.startOf('month');
        } else if (range >= week) {
            time.startOf('week');
        }
        return time.valueOf();
    }
    return leftBound - offset + range;
}

function getNextTimestamp(ts, range) {
    if (range >= year) {
        const time = moment(ts);
        time.add(range / year, 'year');
        return time.valueOf();
    }
    if (range >= month) {
        const time = moment(ts);
        time.add(range / month, 'month');
        return time.valueOf();
    }
    if (range >= week) {
        const time = moment(ts);
        time.add(range / week, 'week');
        return time.valueOf();
    }
    return ts + range;
}

function getTicks({leftBound, rightBound, width, range, calcTimestamp, initialTimestamp}) {
    const totalRange = rightBound - leftBound;
    const ratio = width / totalRange;
    let timestamp = initialTimestamp || getInitialTimestamp(leftBound, range);
    const points = [];
    while (timestamp < rightBound) {
        const point = (timestamp - leftBound) * ratio;
        if (calcTimestamp) {
            points.push({point, timestamp, formatted: formatTickTimestamps(timestamp)});
        } else {
            points.push({point});
        }
        timestamp = getNextTimestamp(timestamp, range);
    }
    return points;
}

function buildTickFactory(width = 1, height = 10, anchor = 0) {
    return (tick) => `M${Math.floor(tick.point - width / 2)} ${anchor}v${height}h${width}V${anchor}z`;
}

function globalDragHandler(onMouseMove, onMouseUp) {
    const EventListenerMode = {capture: true};

    function preventGlobalMouseEvents() {
        document.body.style['pointer-events'] = 'none';
    }

    function restoreGlobalMouseEvents() {
        document.body.style['pointer-events'] = 'auto';
    }

    function mousemoveListener(e) {
        e.stopPropagation();
        onMouseMove(e);
        // do whatever is needed while the user is moving the cursor around
    }

    function mouseupListener(e) {
        restoreGlobalMouseEvents();
        document.removeEventListener('mouseup', mouseupListener, EventListenerMode);
        document.removeEventListener('mousemove', mousemoveListener, EventListenerMode);
        e.stopPropagation();
        onMouseUp(e);
    }

    function captureMouseEvents(e) {
        preventGlobalMouseEvents();
        document.addEventListener('mouseup', mouseupListener, EventListenerMode);
        document.addEventListener('mousemove', mousemoveListener, EventListenerMode);
        e.preventDefault();
        e.stopPropagation();
    }

    return captureMouseEvents;
}

class TimelineRuler extends React.Component {
    static propTypes = {
        displayNow: PropTypes.bool,
        from: PropTypes.number,
        to: PropTypes.number,
        leftBound: PropTypes.number,
        rightBound: PropTypes.number,
        maxRange: PropTypes.number,
        minRange: PropTypes.number,
        onUpdateBounds: PropTypes.func,
        onUpdateSelection: PropTypes.func,
        onNowReset: PropTypes.func,
        titles: PropTypes.object,
        height: PropTypes.number
    }
    static defaultProps = {
        displayNow: true,
        maxRange: 5 * 365 * day,
        minRange: 5 * minute,
        height: 40,
        titles: {}
    }
    static getDerivedStateFromProps(props, state) {
        const {width, timeOffset = 0, fromOffset = 0, toOffset = 0} = state;
        const {leftBound, rightBound, from, to, minRange} = props;
        const totalRange = Math.max((rightBound - leftBound) || 0, minRange);
        const ratio = width / totalRange;
        const maxTickCount = Math.round(width / 80);
        const range = getCaptionRange(totalRange, maxTickCount);
        return {
            width,
            leftBound: leftBound + timeOffset,
            rightBound: rightBound + timeOffset,
            from: from + fromOffset,
            to: to + toOffset,
            totalRange,
            ratio,
            range
        };
    }
    state = {}
    componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }
    _refRuler = (node) => {
        this.ruler = node;
        this.onResize();
    }
    getRatio() {
        return this.state.ratio;
    }
    timeToPosition(ts) {
        const {leftBound, ratio} = this.state;
        return (ts - leftBound) * ratio;
    }
    positionToTimeOffset(x) {
        const {ratio} = this.state;
        return Math.round(x / ratio);
    }
    getMinorTicks() {
        const {width, leftBound, rightBound, range} = this.state;
        const ticks = getTicks({leftBound, rightBound, range, width, calcTimestamp: true});
        const microTicks = getTicks({
            leftBound,
            rightBound,
            range: range / 10,
            width,
            initialTimestamp: getInitialTimestamp(leftBound - range, range)});
        return {
            ticks,
            microTicks
        };
    }
    zoom(multiplier, ratio = 0.5) {
        const {leftBound, rightBound, maxRange, minRange, from, to} = this.props;
        let range = rightBound - leftBound;
        const middleTimestamp = leftBound * (1 - ratio) + rightBound * ratio;
        if (multiplier > 1) {
            range = Math.min(range * multiplier, maxRange);
        } else {
            range = Math.max(range * multiplier, minRange);
        }
        let newLeftBound = Math.round(middleTimestamp - range * ratio);
        let newRightBound = Math.round(middleTimestamp + range * (1 - ratio));
        if (newLeftBound > from) {
            newRightBound += from - newLeftBound;
            newLeftBound = from;
        }
        if (newRightBound < to) {
            newLeftBound += to - newRightBound;
            newRightBound = to;
        }

        this.props.onUpdateBounds({
            leftBound: newLeftBound,
            rightBound: newRightBound
        });
    }
    zoomAll(multiplier) {
        const {leftBound, rightBound, maxRange, minRange, from, to} = this.props;
        const range = rightBound - leftBound;
        let newRange = range;
        if (multiplier > 1) {
            newRange = Math.min(range * multiplier, maxRange);
        } else {
            newRange = Math.max(range * multiplier, minRange, (to - from) * 1.25);
        }

        const ratio = newRange / range;
        this.props.onUpdateBounds({
            from: Math.round(to - (to - from) * ratio),
            to,
            leftBound: Math.round(to - (to - leftBound) * ratio),
            rightBound: Math.round(to - (to - rightBound) * ratio)
        });

    }
    zoomIn = () => {
        this.zoomAll(0.8);
    }
    zoomOut = () => {
        this.zoomAll(1.25);
    }
    onSelectionHandleMouseDown = (key) => {
        const {minRange} = this.props;

        const onMouseMove = (event) => {
            if (!isNaN(this.x)) {
                const clientX = event.clientX;

                const rawOffset = this.positionToTimeOffset(clientX - this.x);
                const rightOffset = Math.min(rawOffset, this.props.rightBound - this.props[key]);
                let offset = Math.max(rightOffset, this.props.leftBound - this.props[key]);
                switch (key) {
                    case 'to':
                        offset = Math.max(offset, this.props.from - this.props.to + minRange);
                        break;
                    case 'from':
                        offset = Math.min(offset, this.props.to - this.props.from - minRange);
                        break;
                }

                requestAnimationFrame(() => {
                    if (!isNaN(this.x)) {
                        this.setState({
                            [`${key}Offset`]: offset
                        });
                    }
                });
            }
        };

        const onMouseUp = () => {
            this.x = undefined;
            const {[`${key}Offset`]: keyOffset} = this.state;
            if (keyOffset) {
                const {[key]: value} = this.state;
                this.props.onUpdateSelection({[key]: value});
                this.setState({
                    fromOffset: undefined,
                    toOffset: undefined
                });
            }
        };

        return (event) => {
            if (event.button === 0) {
                this.x = event.clientX;
                globalDragHandler(onMouseMove, onMouseUp)(event);
            }
        };
    }
    onSelectionMouseDown = (event) => {
        const onMouseMove = (event) => {
            if (!isNaN(this.x)) {
                const clientX = event.clientX;
                const rawOffset = this.positionToTimeOffset(clientX - this.x);
                const rightOffset = Math.min(rawOffset, this.props.rightBound - this.props.to);
                const offset = Math.max(rightOffset, this.props.leftBound - this.props.from);
                requestAnimationFrame(() => {
                    if (!isNaN(this.x)) {
                        this.setState({
                            fromOffset: offset,
                            toOffset: offset
                        });
                    }
                });
            }
        };

        const onMouseUp = () => {
            this.x = undefined;
            const {fromOffset, toOffset} = this.state;
            if (fromOffset || toOffset) {
                const {from, to} = this.state;
                this.props.onUpdateSelection({from, to});
                this.setState({
                    fromOffset: undefined,
                    toOffset: undefined
                });
            }
        };

        if (event.button === 0) {
            this.x = event.clientX;
            globalDragHandler(onMouseMove, onMouseUp)(event);
        }
    }
    onRulerMouseDown = (event) => {
        if (event.button === 0) {
            this.x = event.clientX;
            globalDragHandler(this.onRulerMouseMove, this.onRulerMouseUp)(event);
        }
    }
    onRulerMouseMove = (event) => {
        if (!isNaN(this.x)) {
            const clientX = event.clientX;
            const rawOffset = this.positionToTimeOffset(clientX - this.x);
            const rightOffset = Math.min(rawOffset, this.props.rightBound - this.props.to);
            const offset = Math.max(rightOffset, this.props.leftBound - this.props.from);
            requestAnimationFrame(() => {
                if (!isNaN(this.x)) {
                    this.setState({
                        timeOffset: -offset
                    });
                }
            });
        }
    }
    onRulerMouseUp = () => {
        this.x = undefined;
        const {timeOffset} = this.state;
        if (timeOffset) {
            const {leftBound, rightBound} = this.state;
            this.props.onUpdateBounds({leftBound, rightBound});
            this.setState({
                timeOffset: undefined
            });
        }
    }
    onRulerWheel = (event) => {
        const boundingRect = event.currentTarget.getBoundingClientRect();
        const leftOffset = event.clientX - boundingRect.left;
        const width = boundingRect.width;
        const point = leftOffset / width;
        if (event.deltaY > 0) {
            this.zoom(1.25, point);
        } else {
            this.zoom(0.8, point);
        }
    }
    onResize = () => {
        if (this.ruler && this.ruler.clientWidth !== this.state.width) {
            this.setState({width: this.ruler.clientWidth});
        }
    }
    renderNow() {
        const {height} = this.props;
        const {width} = this.state;
        const now = Math.round(this.timeToPosition(Number(new Date())));
        if (now > width - 4) {
            return null;
        }
        return (
            <path
                className={b('now-tick')}
                d={`M${now - 1} 0 V${height}h2V0z`}
            />
        );
    }
    renderRuler() {
        const {width} = this.state;
        if (!width) {
            return null;
        }
        const {height} = this.props;
        const {ticks, microTicks} = this.getMinorTicks();
        const {from, to} = this.state;
        return (
            <div
                onMouseDown={this.onRulerMouseDown}
                onWheel={this.onRulerWheel}
            >
                <div className={b('labels-minor')}>
                    {ticks.map(tick =>
                        <span
                            key={tick.timestamp}
                            className={b('label-minor')}
                            style={{left: tick.point}}
                        >
                            {tick.formatted}
                        </span>
                    )}
                </div>
                <svg className={b('ruler-svg')} viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
                    {
                        Boolean(this.props.displayNow) && this.renderNow()
                    }
                    <path
                        className={b('ruler-border')}
                        d={`M0 1 V${height - 1}h1V1z M${width} 1V${height - 1}h-1V1z`}
                    />
                    <path
                        className={b('ticks-major')}
                        d={ticks.map(buildTickFactory(1, 7, 1)).join('')}
                    />
                    <path
                        className={b('ticks-major')}
                        d={ticks.map(buildTickFactory(1, 7, height - 8)).join('')}
                    />
                    <path
                        className={b('ticks-minor')}
                        d={microTicks.map(buildTickFactory(1, 4, 1)).join('')}
                    />
                    <path
                        className={b('ticks-minor')}
                        d={microTicks.map(buildTickFactory(1, 4, height - 5)).join('')}
                    />
                </svg>
                <div
                    className={b('selection')}
                    onMouseDown={this.onSelectionMouseDown}
                    style={{
                        left: this.timeToPosition(from),
                        width: this.timeToPosition(to) - this.timeToPosition(from)
                    }}
                >
                    <div
                        className={b('selection-handle', {position: 'left'})}
                        onMouseDown={this.onSelectionHandleMouseDown('from')}
                    />
                    <div
                        className={b('selection-handle', {position: 'right'})}
                        onMouseDown={this.onSelectionHandleMouseDown('to')}
                    />

                </div>
            </div>
        );
    }
    render() {
        const {titles} = this.props;
        return (
            <div className={b()}>
                <div className={b('zoom')}>
                    <Button
                        view="default"
                        tone="default"
                        theme="flat"
                        size="n"
                        cls={b('zoom-button')}
                        title={titles.zoomOut}
                        onClick={this.zoomOut}
                    >
                        <Icon data={iconMinus} height="100%"/>
                    </Button>
                    <Button
                        view="default"
                        tone="default"
                        theme="flat"
                        size="n"
                        cls={b('zoom-button')}
                        title={titles.zoomIn}
                        onClick={this.zoomIn}
                    >
                        <Icon data={iconPlus} height="100%"/>
                    </Button>
                </div>
                <div
                    className={b('ruler')}
                    ref={this._refRuler}
                >
                    {this.renderRuler()}
                </div>
                <Button
                    view="default"
                    tone="default"
                    theme="flat"
                    size="n"
                    title={titles.now}
                    cls={b('now-button')}
                    onClick={this.props.onNowReset}
                >
                    <Icon data={iconNow} height="100%"/>
                </Button>
            </div>
        );
    }
}

export default TimelineRuler;
