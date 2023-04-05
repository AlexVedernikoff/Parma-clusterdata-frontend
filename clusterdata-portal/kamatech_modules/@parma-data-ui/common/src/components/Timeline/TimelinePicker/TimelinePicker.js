import React from 'react';
import PropTypes from 'prop-types';
import cn from 'bem-cn-lite';
import { Button, Popup, Select } from 'lego-on-react';
import EnterInput from '../../EnterInput/EnterInput';
import Icon from '../../Icon/Icon';
import iconCalendar from '../../../assets/icons/calendar.svg';
import iconRefresh from '../../../assets/icons/time-refresh.svg';
import noop from 'lodash/noop';
import { humanizeInterval, formatInterval, formatTimeCanonical, getTimestampFromDate } from '../util';
import i18n from '../i18n';
import TimelineDatepicker from './TimelineDatepicker';

// import './TimelinePicker.scss';

const b = cn('yc-timeline-picker');

const SHORTCUT_CUSTOM = 'custom';

class TimeHotButton extends React.Component {
  static propTypes = {
    size: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.string,
    time: PropTypes.string,
    checked: PropTypes.bool,
    onClick: PropTypes.func,
  };
  static defaultProps = {
    size: 'n',
  };
  onClick = () => {
    this.props.onClick(this.props.time);
  };
  render() {
    const { size, title, className, checked } = this.props;
    return (
      <Button
        view="default"
        tone="default"
        theme="flat"
        size={size}
        checked={checked}
        onClick={this.onClick}
        cls={className}
      >
        {title}
      </Button>
    );
  }
}

class TimelinePicker extends React.Component {
  static propTypes = {
    from: PropTypes.number,
    to: PropTypes.number,
    refreshInterval: PropTypes.string,
    shortcut: PropTypes.string,
    onChange: PropTypes.func,
    onChangeRefresh: PropTypes.func,
    onShortcut: PropTypes.func,
    topShortcuts: PropTypes.array,
    shortcuts: PropTypes.array,
    refreshIntervals: PropTypes.array,
  };
  static defaultProps = {
    refreshInterval: '0',
    shortcuts: [],
    topShortcuts: [],
    picker: TimelineDatepicker,
  };
  static formatInputTime(from, to) {
    return `${formatTimeCanonical(from)} - ${formatTimeCanonical(to)}`;
  }
  static getDerivedStateFromProps(props, state) {
    const { from, to } = props;
    if (state.prevFrom === from && state.prevTo === to) {
      return state;
    } else {
      return {
        from: from,
        to: to,
        prevFrom: from,
        prevTo: to,
        datetime: TimelinePicker.formatInputTime(from, to),
      };
    }
  }
  state = {};
  componentDidUpdate() {
    if (this.state.opened && this._inputRef.current) {
      this._inputRef.current.focus();
    }
  }
  _datepickerRef = React.createRef();
  _inputRef = React.createRef();
  onCustomClick = () => {
    this.setState({ customInput: true });
  };
  onCustomCancel = () => {
    this.setState({ customInput: false });
  };
  onCustomDone = value => {
    this.setState({ customInput: false });
    this.props.onShortcut(value, SHORTCUT_CUSTOM);
  };
  onOpenPickerClick = () => {
    this.setState({ opened: true });
  };
  onPopupOutsideClick = event => {
    const inside = Boolean(event.target.closest('.yc-datepicker-body'));
    if (!inside) {
      this.setState({ opened: false });
    }
  };
  onInputChange = value => {
    this.setState({ datetime: value });
  };
  onInputDone = value => {
    const re = /(?:(\d{4}-\d{2}-\d{2})(?:[ T]?(\d{2}:\d{2}))?)\s*-\s*(?:(\d{4}-\d{2}-\d{2})?[ T]?(\d{2}:\d{2})?)/;
    const match = re.exec(value);
    if (match) {
      const [_, fd, ft, td, tt] = match;
      const from = getTimestampFromDate(`${fd} ${ft}`);
      const to = getTimestampFromDate(`${td || fd} ${tt}`);
      if (!(isNaN(from) || isNaN(to))) {
        this.props.onChange({ from, to });
      }
      this.setState({ opened: false });
    }
  };
  onFromChange = value => {
    const from = value.valueOf();
    const { to } = this.state;
    this.setState({ from, datetime: TimelinePicker.formatInputTime(from, to) });
  };
  onToChange = value => {
    const to = value.valueOf();
    const { from } = this.state;
    this.setState({ to, datetime: TimelinePicker.formatInputTime(from, to) });
  };
  onRefreshChange = ([value]) => {
    this.props.onChangeRefresh(value);
  };
  onShortcutClick = value => {
    this.setState({ opened: false });
    this.props.onShortcut(value, value);
  };
  onTopShortcutClick = value => {
    this.props.onShortcut(value, value);
  };
  renderOpenedPicker() {
    const { datetime } = this.state;
    return (
      <>
        {this.renderClosedPicker()}
        <EnterInput
          ref={this._inputRef}
          size="n"
          text={datetime}
          autoselect={true}
          onChange={this.onInputChange}
          onDone={this.onInputDone}
          onCancel={noop}
        />
      </>
    );
  }
  renderClosedPicker() {
    const { from, to } = this.props;
    return (
      <div className={b('date-text')}>
        <Icon data={iconCalendar} width={36} className={b('icon')} />
        <div className={b('text')}>{formatInterval(from, to)}</div>
      </div>
    );
  }
  renderShortcuts() {
    const { shortcut, shortcuts } = this.props;
    return (
      <div className={b('shortcut-pane')}>
        {shortcuts.map((group, index) => (
          <div key={index} className={b('shortcut-group')}>
            {group.map(item => (
              <TimeHotButton
                key={item.time}
                {...item}
                size="s"
                checked={shortcut === item.time}
                className={b('shortcut')}
                onClick={this.onShortcutClick}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
  renderRefresh() {
    const { refreshInterval, refreshIntervals } = this.props;
    if (!refreshIntervals) {
      return null;
    }
    const title = (refreshIntervals.find(item => item.value === String(refreshInterval)) || refreshIntervals[0]).title;
    const placeholder = (
      <span key="placeholder">
        <Icon className={b('refresh-selector-icon')} data={iconRefresh} />
        {title}
      </span>
    );
    return (
      <Select
        theme="flat"
        view="default"
        tone="default"
        size="s"
        type="radio"
        text="fixed"
        val={String(refreshInterval)}
        placeholder={placeholder}
        cls={b('refresh-selector')}
        onChange={this.onRefreshChange}
      >
        {refreshIntervals.map((item, index) => (
          <Select.Item key={index} val={item.value}>
            {item.title}
          </Select.Item>
        ))}
      </Select>
    );
  }
  render() {
    const { from, to, shortcut, topShortcuts } = this.props;
    const isShortcutCustom = shortcut === SHORTCUT_CUSTOM;
    const { customInput, opened } = this.state;
    const picker = opened ? this.renderOpenedPicker() : this.renderClosedPicker();
    return (
      <div className={b()}>
        <div className={b('hot-buttons')}>
          {topShortcuts.map(item => (
            <TimeHotButton
              key={item.time}
              {...item}
              checked={shortcut === item.time}
              className={b('hot')}
              onClick={this.onTopShortcutClick}
            />
          ))}
          <div className={b('hot-custom')}>
            {customInput ? (
              <EnterInput autoFocus={true} placeholder="6h" onCancel={this.onCustomCancel} onDone={this.onCustomDone} />
            ) : (
              <TimeHotButton
                checked={isShortcutCustom}
                onClick={this.onCustomClick}
                title={isShortcutCustom ? humanizeInterval(from, to) : i18n('label_custom')}
              />
            )}
          </div>
        </div>
        <div ref={this._datepickerRef} className={b('datepicker', { opened })} onClick={this.onOpenPickerClick}>
          {picker}
        </div>
        <Popup
          theme="normal"
          target="anchor"
          anchor={this._datepickerRef.current}
          visible={opened}
          onClose={this.onPopupOutsideClick}
        >
          <div className={b('shortcuts')}>
            <div className={b('datepickers')}>
              {React.createElement(this.props.picker, {
                from,
                to,
                onFromChange: this.onFromChange,
                onToChange: this.onToChange,
              })}
            </div>
            <div className={b('shortcuts-title')}>{i18n('label_shortcut-list')}:</div>
            {this.renderShortcuts()}
          </div>
        </Popup>
        <div className={b('refresh')} title={i18n('title_autorefresh')}>
          {this.renderRefresh()}
        </div>
      </div>
    );
  }
}

export default TimelinePicker;
