import React from 'react';
import PropTypes from 'prop-types';
import cn from 'bem-cn-lite';
import { getNow, calculateBackTimestamp } from './util';
import TimelineRuler from './TimelineRuler/TimelineRuler';
import TimelinePicker from './TimelinePicker/TimelinePicker';

// import './Timeline.scss';

const b = cn('yc-timeline');

const MAX_WIDTH_RATIO = 50;

class Timeline extends React.Component {
  static propTypes = {
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired,

    refreshInterval: PropTypes.string,
    shortcut: PropTypes.string,
    onChange: PropTypes.func,
    onChangeRefresh: PropTypes.func,
    shortcuts: PropTypes.array,
    topShortcuts: PropTypes.array,
    refreshIntervals: PropTypes.array,

    hasPicker: PropTypes.bool,
    hasRuler: PropTypes.bool,
    wrapper: PropTypes.func,
  };
  static defaultProps = {
    hasPicker: true,
    hasRuler: true,
    wrapper: ({ picker, ruler }) => (
      <div className={b()}>
        {picker}
        {ruler}
      </div>
    ),
  };
  state = {};
  static getDerivedStateFromProps(props, state) {
    const { from, to } = props;
    let leftBound = Math.min(Number(state.leftBound) || from, from);
    let rightBound = Math.max(Number(state.rightBound) || to, to);
    const ratio = (rightBound - leftBound) / (to - from);
    if (ratio > MAX_WIDTH_RATIO) {
      leftBound = from - ((from - leftBound) * MAX_WIDTH_RATIO) / ratio;
      rightBound = to + ((rightBound - to) * MAX_WIDTH_RATIO) / ratio;
    }
    return {
      leftBound,
      rightBound,
    };
  }
  setTime = data => {
    const { leftBound, rightBound } = { ...this.state, ...data };
    this.setState({ leftBound, rightBound });
    this.onChange(data);
  };
  onShortcut = (shortcut, shortcutName) => {
    const to = getNow();
    const from = calculateBackTimestamp(shortcut);
    if (this.props.onChange && to !== from) {
      this.props.onChange({ from, to, shortcut: shortcutName });
    }
  };
  onNowReset = () => {
    const { from, to } = this.props;
    const now = getNow();
    if (this.props.onChange) {
      this.props.onChange({ from: now - to + from, to: now, nowReset: true });
    }
  };
  onChangeRefresh = refreshInterval => {
    if (this.props.onChangeRefresh) {
      this.props.onChangeRefresh(refreshInterval);
    }
  };
  onChange(data) {
    const { from, to } = { ...this.props, ...data };
    if (this.props.onChange && (from || to) && !(from === this.props.from && to === this.props.to)) {
      this.props.onChange({ from, to });
    }
  }
  renderRuler() {
    if (this.props.hasRuler === false) {
      return null;
    }

    const { leftBound, rightBound } = this.state;
    const { from, to } = this.props;
    return (
      <TimelineRuler
        leftBound={leftBound}
        rightBound={rightBound}
        from={from}
        to={to}
        onNowReset={this.onNowReset}
        onUpdateBounds={this.setTime}
        onUpdateSelection={this.setTime}
      />
    );
  }
  renderPicker() {
    if (this.props.hasPicker === false) {
      return null;
    }

    const { from, to, shortcut, shortcuts, topShortcuts, refreshInterval, refreshIntervals } = this.props;

    return (
      <TimelinePicker
        from={from}
        to={to}
        shortcuts={shortcuts}
        refreshInterval={refreshInterval}
        shortcut={shortcut}
        refreshIntervals={refreshIntervals}
        topShortcuts={topShortcuts}
        onChange={this.setTime}
        onChangeRefresh={this.onChangeRefresh}
        onShortcut={this.onShortcut}
      />
    );
  }
  render() {
    return this.props.wrapper({ picker: this.renderPicker(), ruler: this.renderRuler() });
  }
}

export default Timeline;
