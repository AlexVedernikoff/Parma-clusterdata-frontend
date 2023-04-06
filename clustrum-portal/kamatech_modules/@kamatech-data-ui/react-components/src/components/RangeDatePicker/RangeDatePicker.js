import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Button, Icon, Popup } from 'lego-on-react';

// import './RangeDatePicker.scss';

/* eslint-disable no-self-compare */
const i18n = (function() {
  const core = require('bem-i18n');

  if (process.env.BEM_LANG === 'ru' || 'ru' === 'ru') {
    return core().decl(require('./RangeDatePicker.i18n/ru'))('RangeDatePicker');
  }

  if (process.env.BEM_LANG === 'en' || 'ru' === 'en') {
    return core().decl(require('./RangeDatePicker.i18n/en'))('RangeDatePicker');
  }

  return function() {};
})();
/* eslint-enable no-self-compare */

const b = block('du-range-datepicker');

const defaultQuickIntervals = [
  {
    name: {
      ru: '30 дней',
      en: '30 days',
    },
    interval: [30, 'days'],
  },
  {
    name: {
      ru: '3 месяца',
      en: '3 months',
    },
    interval: [3, 'months'],
  },
  {
    name: {
      ru: '6 месяцев',
      en: '6 months',
    },
    interval: [6, 'months'],
  },
  {
    name: {
      ru: '12 месяцев',
      en: '12 months',
    },
    interval: [12, 'months'],
  },
  {
    name: {
      ru: '2 года',
      en: '2 years',
    },
    interval: [2, 'years'],
  },
  {
    name: {
      ru: '3 года',
      en: '3 years',
    },
    interval: [3, 'years'],
  },
];

export default function DatePickerFactory(moment, DatePicker) {
  if (typeof moment === 'undefined') {
    return class RangeDatePicker extends React.PureComponent {
      render() {
        console.error('DatePickerFactory: moment is undefined');
        return null;
      }
    };
  }
  return class RangeDatePicker extends React.PureComponent {
    static propTypes = {
      size: PropTypes.string,
      onChange: PropTypes.func,
      displayDateFormat: PropTypes.string,
      timeFormat: PropTypes.string,
      locale: PropTypes.string,
      value: PropTypes.shape({
        from: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      }),
      minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      reportChangesAfterClickOutside: PropTypes.bool,
      quickIntervals: PropTypes.array,
      picker: PropTypes.shape({
        dateFormat: PropTypes.string,
        viewMode: PropTypes.string,
      }),
      utc: PropTypes.bool,
      useStringsInCallback: PropTypes.bool,
      allowEmptyValues: PropTypes.bool,
      emptyValueText: PropTypes.string,
    };

    static defaultProps = {
      value: {
        from: moment()
          .add(-1, 'day')
          .toISOString(),
        to: moment().toISOString(),
      },
      size: 'm',
      displayDateFormat: 'DD MMMM YYYY',
      locale: 'ru',
      minDate: null,
      maxDate: null,
      reportChangesAfterClickOutside: false,
      quickIntervals: defaultQuickIntervals,
      picker: {},
      utc: false,
      useStringsInCallback: false,
      allowEmptyValues: false,
      emptyValueText: 'No date',
    };

    static defaultQuickIntervals = defaultQuickIntervals;

    constructor(props) {
      super(props);

      this.setDateFormat(this.props);

      if (!this.props.useStringsInCallback) {
        console.warn('RangeDatePicker: disabled useStringsInCallback is deprecated');
      }

      this.state = {
        opened: false,
        selectedFrom: this.localMoment(this.props.value.from),
        selectedTo: this.localMoment(this.props.value.to),
      };
    }

    componentDidUpdate(prevProps, prevState) {
      this.setDateFormat(this.props);

      const valueChanged =
        this.localMoment(this.props.value.from).isValid() &&
        this.localMoment(this.props.value.to).isValid() &&
        (!this.localMoment(prevProps.value.from).isSame(this.localMoment(this.props.value.from)) ||
          !this.localMoment(prevProps.value.to).isSame(this.localMoment(this.props.value.to)));

      if (valueChanged) {
        this.setState({
          selectedFrom: this.localMoment(this.props.value.from),
          selectedTo: this.localMoment(this.props.value.to),
          pendingInput: null,
        });
      }

      const opening = this.state.opened && !prevState.opened;
      const closing = !this.state.opened && prevState.opened;

      if (opening) {
        this.addEventListeners();
      } else if (closing) {
        this.removeEventListeners();
      }

      if (this.quickIntervalSelected) {
        delete this.quickIntervalSelected;
        this.reportChangeAndClose();
      }
    }

    componentWillUnmount() {
      this.removeEventListeners();
    }

    addEventListeners() {
      window.addEventListener('keydown', this.handleKeyPress);
      document.body.addEventListener('click', this.handleClick);
    }

    removeEventListeners() {
      window.removeEventListener('keydown', this.handleKeyPress);
      document.body.removeEventListener('click', this.handleClick);
    }

    localMoment(...args) {
      const momentFn = this.props.utc ? moment.utc : moment;
      const momentInstance = momentFn(...args);
      momentInstance.locale(this.props.locale);
      return momentInstance;
    }

    setDateFormat(props) {
      this.picker = {
        dateFormat: props.picker.dateFormat ? props.picker.dateFormat : props.displayDateFormat,
        viewMode: props.picker.viewMode,
      };

      this.displayDateFormat = props.timeFormat
        ? `${props.displayDateFormat} ${props.timeFormat}`
        : props.displayDateFormat;
    }

    handleKeyPress = event => {
      const stopEvent = () => {
        event.stopPropagation();
        event.preventDefault();
      };
      switch (event.key) {
        case 'Escape':
          this.rollbackAndClose();
          stopEvent();
          break;
        case 'Enter':
          this.reportChangeAndClose();
          stopEvent();
          break;
      }
    };

    handleClick = event => {
      const outsideClick = !(
        this.baseElem.contains(event.target) ||
        this.popupElem.containerRef.current.contains(event.target) ||
        (this.startPickerRef && this.startPickerRef.popupElem.containerRef.current.contains(event.target)) ||
        (this.endPickerRef && this.endPickerRef.popupElem.containerRef.current.contains(event.target)) ||
        event.target.classList.contains('rdtSwitch') ||
        event.target.classList.contains('rdtDay') ||
        event.target.classList.contains('rdtMonth') ||
        event.target.classList.contains('rdtYear') ||
        event.target.classList.contains('rdtTimeToggle')
      );
      if (outsideClick) {
        this.setState({ opened: false });
        if (this.props.reportChangesAfterClickOutside) {
          this.reportChange();
        }
      }
    };

    reportChangeAndClose = () => {
      this.setState({
        opened: false,
      });
      this.reportChange();
    };

    reportChange() {
      const { selectedFrom, selectedTo } = this.state;
      const propsFrom = (this.props.value.from && this.localMoment(this.props.value.from)) || null;
      const propsTo = (this.props.value.to && this.localMoment(this.props.value.to)) || null;

      const fromChanged = selectedFrom !== propsFrom || (selectedFrom && propsFrom && !selectedFrom.isSame(propsFrom));
      const toChanged = selectedTo !== propsTo || (selectedFrom && propsTo && !selectedFrom.isSame(propsTo));
      const intervalChanged = fromChanged || toChanged;

      const reversedInterval = selectedFrom && selectedTo && selectedFrom.isAfter(selectedTo);

      const from =
        (selectedFrom && this.props.useStringsInCallback && typeof selectedFrom !== 'string'
          ? selectedFrom.toISOString()
          : selectedFrom) || null;

      const to =
        (selectedTo && this.props.useStringsInCallback && typeof selectedTo !== 'string'
          ? selectedTo.toISOString()
          : selectedTo) || null;

      if (intervalChanged && this.props.onChange) {
        if (reversedInterval) {
          this.props.onChange({ from: to, to: from });
        } else {
          this.props.onChange({ from, to });
        }
      }
    }

    rollbackAndClose() {
      this.setState({
        selectedFrom: this.props.value.from,
        selectedTo: this.props.value.to,
        opened: false,
      });
    }

    getLastAvailableMoment() {
      const currentMoment = this.localMoment();
      if (!this.props.maxDate || currentMoment.isBefore(this.props.maxDate)) {
        return currentMoment;
      } else {
        return this.props.maxDate;
      }
    }

    renderPicker() {
      return (
        <div className={b('content')}>
          <div className={b('pickers')}>
            <DatePicker
              ref={ref => {
                this.startPickerRef = ref;
              }}
              onChange={selectedFrom => {
                this.setState({
                  selectedFrom: selectedFrom === null ? null : this.localMoment(selectedFrom),
                  selectedQuickInterval: null,
                });
              }}
              size="s"
              locale={this.props.locale}
              dateFormat={this.picker.dateFormat}
              timeFormat={this.props.timeFormat}
              viewMode={this.picker.viewMode}
              value={this.state.selectedFrom}
              minDate={this.localMoment(this.props.minDate)}
              maxDate={this.localMoment(this.props.maxDate)}
              utc={this.props.utc}
              useStringsInCallback={true}
              allowEmptyValue={this.props.allowEmptyValues}
              emptyValueText={this.props.emptyValueText}
            />
            <div className={b('separator')} />
            &mdash;
            <div className={b('separator')} />
            <DatePicker
              onChange={selectedTo => {
                this.setState({
                  selectedTo: selectedTo === null ? null : this.localMoment(selectedTo),
                  selectedQuickInterval: null,
                });
              }}
              ref={ref => {
                this.endPickerRef = ref;
              }}
              size="s"
              locale={this.props.locale}
              dateFormat={this.picker.dateFormat}
              timeFormat={this.props.timeFormat}
              viewMode={this.picker.viewMode}
              value={this.state.selectedTo}
              minDate={this.localMoment(this.props.minDate)}
              maxDate={this.localMoment(this.props.maxDate)}
              utc={this.props.utc}
              useStringsInCallback={true}
              allowEmptyValue={this.props.allowEmptyValues}
              emptyValueText={this.props.emptyValueText}
            />
          </div>

          {this.renderQuickIntervals()}

          <div className={b('actions')}>
            <Button
              theme="pseudo"
              size="s"
              onClick={() => {
                this.rollbackAndClose();
              }}
            >
              {i18n('button_cancel')}
            </Button>
            <Button
              theme="action"
              size="s"
              onClick={() => {
                this.reportChangeAndClose();
              }}
            >
              {i18n('button_apply')}
            </Button>
          </div>
        </div>
      );
    }

    renderQuickIntervals() {
      if (!this.props.quickIntervals || !this.props.quickIntervals.length) {
        return null;
      }

      return (
        <div className={b('last-periods')}>
          <div className={b('last-periods-title')}>{i18n('interval')}:</div>
          <div className={b('last-periods-elements')}>
            {this.props.quickIntervals.map((interval, i) => {
              const intervalFrom = this.localMoment().subtract(...interval.interval);
              const validInterval =
                !this.props.minDate ||
                intervalFrom.isSame(this.props.minDate) || intervalFrom.isAfter(this.props.minDate);
              if (validInterval) {
                return (
                  <div
                    key={i}
                    className={b('last-periods-element', { active: i === this.state.selectedQuickInterval })}
                    onClick={() => {
                      this.setState({
                        selectedFrom: this.localMoment().subtract(...interval.interval),
                        selectedTo: this.getLastAvailableMoment(),
                        selectedQuickInterval: i,
                      });
                      this.quickIntervalSelected = true;
                    }}
                  >
                    {interval.name[this.props.locale]}
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
      );
    }

    render() {
      return (
        <div
          className={b({ size: this.props.size })}
          ref={ref => {
            this.baseElem = ref;
          }}
        >
          <Button
            theme="normal"
            size={this.props.size}
            onClick={() => {
              this.setState({ opened: !this.state.opened });
            }}
            ref={ref => {
              this.buttonRef = ref;
            }}
          >
            <Icon mix={{ block: b('icon') }} />
            <span>
              <span>
                &nbsp;&nbsp;
                {(this.props.value.from && this.localMoment(this.props.value.from).format(this.displayDateFormat)) ||
                  this.props.emptyValueText}
              </span>
              <span>&nbsp;—&nbsp;</span>
              <span>
                {(this.props.value.to && this.localMoment(this.props.value.to).format(this.displayDateFormat)) ||
                  this.props.emptyValueText}
              </span>
            </span>
          </Button>

          <Popup
            theme="normal"
            hasTail
            visible={this.state.opened}
            anchor={this.buttonRef}
            ref={ref => {
              this.popupElem = ref;
            }}
          >
            {this.state.opened && this.renderPicker()}
          </Popup>
        </div>
      );
    }
  };
}
