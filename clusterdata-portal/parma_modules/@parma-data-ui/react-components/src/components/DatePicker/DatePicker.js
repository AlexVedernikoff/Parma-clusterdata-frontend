import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Datetime from 'react-datetime';
import { TextInput, Popup, Icon } from 'lego-on-react';
import debounce from 'lodash/debounce';
// import './DatePicker.scss';

const b = block('du-datepicker');

export default function DatePickerFactory(moment) {
  if (typeof moment === 'undefined') {
    return class DatePicker extends React.PureComponent {
      render() {
        console.error('DatePickerFactory: moment is undefined');
        return null;
      }
    };
  }
  return class DatePicker extends React.PureComponent {
    static propTypes = {
      onChange: PropTypes.func,
      size: PropTypes.string,
      dateFormat: PropTypes.string,
      timeFormat: PropTypes.string,
      viewMode: PropTypes.string,
      locale: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      disabled: PropTypes.bool,
      minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      fireChangeAfterDaySelect: PropTypes.bool,
      keepOpen: PropTypes.bool,
      utc: PropTypes.bool,
      useStringsInCallback: PropTypes.bool,
      allowEmptyValue: PropTypes.bool,
      emptyValueText: PropTypes.string,
      zIndexGroupLevel: PropTypes.number,
      view: PropTypes.string,
      tone: PropTypes.string,
      theme: PropTypes.string,
    };

    static defaultProps = {
      dateFormat: 'DD.MM.YY',
      minDate: null,
      maxDate: null,
      timeFormat: null,
      viewMode: 'days',
      disabled: false,
      size: 'm',
      locale: 'ru',
      fireChangeAfterDaySelect: false,
      keepOpen: false,
      value: moment().toISOString(),
      utc: false,
      useStringsInCallback: false,
      allowEmptyValue: false,
      emptyValueText: 'No date',
      zIndexGroupLevel: 0,

      view: 'classic',
      tone: 'default',
      theme: 'normal',
    };

    constructor(props) {
      super(props);

      if (this.props.value === null && !this.props.allowEmptyValue) {
        throw new Error('DatePicker: null value is not allowed');
      }

      this.setDateFormat(this.props);

      this.keepOpen = this.props.timeFormat ? true : this.props.keepOpen;

      if (!this.props.useStringsInCallback) {
        console.warn('DatePicker: disabled useStringsInCallback is deprecated');
      }

      this.state = {
        selectedMoment: (this.props.value && this.localMoment(this.props.value)) || null,
        opened: false,
      };
    }

    componentDidUpdate(prevProps, prevState) {
      this.setDateFormat(this.props);

      const valueChanged =
        this.props.value !== prevProps.value ||
        (this.localMoment(this.props.value).isValid() &&
          !this.localMoment(this.props.value).isSame(this.localMoment(prevProps.value)));

      if (valueChanged) {
        this.setState({
          selectedMoment: this.localMoment(this.props.value),
          pendingInput: null,
        });
      }

      const opening = this.state.opened && !prevState.opened;
      const closing = !this.state.opened && prevState.opened;

      if (opening) {
        this.addEventListeners();
      } else if (closing) {
        this.removeEventListeners();
        this.inputRef.setState({ focused: false });

        requestAnimationFrame(() => {
          if (this.inputRef && this.inputRef._control === document.activeElement) {
            document.activeElement.blur();
          }
        });
      }
    }

    componentWillUnmount() {
      this.removeEventListeners();
    }

    addEventListeners() {
      window.addEventListener('keydown', this.handleKeyPress, true);
      document.body.addEventListener('click', this.handleClick);
    }

    removeEventListeners() {
      window.removeEventListener('keydown', this.handleKeyPress, true);
      document.body.removeEventListener('click', this.handleClick);
    }

    localMoment(...args) {
      const momentFn = this.props.utc ? moment.utc : moment;
      const momentInstance = momentFn(...args);
      momentInstance.locale(this.props.locale);
      return momentInstance;
    }

    setDateFormat(props) {
      this.dateFormat = props.timeFormat ? `${props.dateFormat} ${props.timeFormat}` : props.dateFormat;
    }

    handleKeyPress = event => {
      const stopEvent = () => {
        event.stopPropagation();
        event.preventDefault();
      };
      switch (event.key) {
        case 'Escape':
          this.rollbackAndExit();
          stopEvent();
          break;
        case 'Enter':
          this.reportChangeAndClose(this.state.selectedMoment);
          stopEvent();
          break;
        case 'Tab':
          this.reportChangeAndClose(this.state.selectedMoment);
          break;
      }
    };

    handleClick = event => {
      // Если кликнуть по элементу, который вызывает переключение контекста (например, по году),
      // в момент проверки на oustide, dom-нода уже не находится в дереве и данное событие вызывается,
      // что приводит к закрытию попапа.
      const ownControl =
        this.baseElem.contains(event.target) ||
        this.pickerElem.contains(event.target) ||
        event.target.classList.contains('rdtSwitch') ||
        event.target.classList.contains('rdtMonth') ||
        event.target.classList.contains('rdtYear') ||
        event.target.classList.contains('rdtTimeToggle');
      if (!ownControl) {
        this.reportChangeAndClose(this.state.selectedMoment);
      }
    };

    reportChangeAndClose = selectedMoment => {
      const stateUpdate = {};
      let validSelectedMoment = selectedMoment;

      const allowedNull = selectedMoment === null && this.props.allowEmptyValue;
      if (!allowedNull) {
        const invalidSelected =
          !selectedMoment || !selectedMoment.isValid() || !this.checkDateConstraints(selectedMoment);
        if (invalidSelected) {
          validSelectedMoment = this.props.value;
        }
      }

      stateUpdate.selectedMoment = validSelectedMoment;
      stateUpdate.opened = false;
      stateUpdate.pendingInput = null;

      this.setState(stateUpdate);
      this.reportChange(validSelectedMoment);
    };

    reportChange(selectedMoment) {
      const valueChanged =
        selectedMoment !== this.props.value || // null
        (selectedMoment && this.props.value && !this.localMoment(selectedMoment).isSame(this.props.value));

      if (valueChanged && this.props.onChange) {
        this.props.onChange(
          this.props.useStringsInCallback ? (selectedMoment && selectedMoment.toISOString()) || null : selectedMoment,
        );
      }
    }

    rollbackAndExit() {
      this.setState({
        pendingInput: null,
        selectedMoment: this.props.value,
        opened: false,
      });
    }

    checkDateConstraints = current => {
      if (this.props.minDate && current.isBefore(this.props.minDate)) {
        return false;
      }
      return !(this.props.maxDate && current.isAfter(this.props.maxDate));
    };

    handleDatetimeChange = selectedMoment => {
      this.setState({ selectedMoment, pendingInput: null });

      if (this.keepOpen) {
        if (this.props.fireChangeAfterDaySelect) {
          this.reportChange(selectedMoment);
        }
      } else {
        this.reportChangeAndClose(selectedMoment);
      }
    };

    applyInputValue = debounce(text => {
      if (text) {
        const selectedMoment = this.localMoment(text, this.dateFormat);
        if (selectedMoment.isValid) {
          this.setState({ selectedMoment });
        }
      } else {
        this.setState({ selectedMoment: null });
      }
    }, 300);

    handleInputChange = text => {
      this.setState({ pendingInput: text });
      this.applyInputValue(text);
    };

    onInputClick = event => {
      event.stopPropagation();
      this.setState({ opened: !this.state.opened });
      this.inputRef.setState({ focused: true });
    };

    renderPicker() {
      return (
        <div
          ref={pickerElem => {
            this.pickerElem = pickerElem;
          }}
        >
          <Datetime
            value={this.state.selectedMoment}
            onChange={this.handleDatetimeChange}
            dateFormat={this.dateFormat}
            timeFormat={this.props.timeFormat}
            viewMode={this.props.viewMode}
            input={false}
            locale={this.props.locale}
            isValidDate={this.checkDateConstraints}
          />
        </div>
      );
    }

    render() {
      const { disabled, size, zIndexGroupLevel } = this.props;
      const { opened } = this.state;
      return (
        <div
          className={b({ size: this.props.size })}
          ref={ref => {
            this.baseElem = ref;
          }}
        >
          <TextInput
            hasClear={this.props.allowEmptyValue}
            view={this.props.view}
            tone={this.props.tone}
            theme={this.props.theme}
            disabled={disabled}
            size={size}
            mix={{ block: 'datepicker', elem: 'control' }}
            onFocus={() => this.setState({ opened: true })}
            text={
              this.state.pendingInput ||
              (this.state.selectedMoment && this.localMoment(this.state.selectedMoment).format(this.dateFormat)) ||
              this.props.emptyValueText
            }
            ref={input => {
              this.inputRef = input;
            }}
            onChange={this.handleInputChange}
            iconRight={<Icon />}
          />
          <span
            className={b('input-icon', { active: opened, disabled })}
            onClick={disabled ? null : this.onInputClick}
          />

          {opened && (
            <Popup
              view={this.props.view}
              tone={this.props.tone}
              theme="normal"
              hasTail
              visible={opened}
              anchor={this.inputRef}
              zIndexGroupLevel={zIndexGroupLevel}
              ref={ref => {
                this.popupElem = ref;
              }}
            >
              {this.renderPicker()}
            </Popup>
          )}
        </div>
      );
    }
  };
}
