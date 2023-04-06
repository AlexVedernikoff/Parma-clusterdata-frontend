import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { TextInput, Popup } from 'lego-on-react';
import FieldWrapper from '../FieldWrapper/FieldWrapper';
import Body from './Body';
import rangeHandlers from './rangeHandlers';
import getDatesFromSearchTemplate from './datesParser';
import getErrorMessage from './errorsHandler';
import dateHelpers from './utils/date';
import constants from './constants';
import locales from './locales';
import { LEGO_POPUP_MIX_CLASS } from '../constants';

// import './index.scss';

const b = block(constants.cName);
const AVAILABLE_POPUP_DIRECTIONS = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];
const VALID_SCALES = ['day', 'month', 'year'];
const VALID_TIME_PRECISION_FORMATS = ['min', 'sec'];
// const VALID_DATES_FORMATS = ['iso'];
const DEFAULT_SCALE = 'noScale';
const DEFAULT_TIME_PRECISION = 'min';
const INPUT_WIDTH_DEFAULT = 314;
const INPUT_WIDTH_MIN = 100;

export default class Datepicker extends React.PureComponent {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    locale: PropTypes.string,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    date: PropTypes.string,
    fromDate: PropTypes.string,
    toDate: PropTypes.string,
    emptyValueText: PropTypes.string,
    timePrecision: PropTypes.string,
    scale: PropTypes.string,
    dateFormat: PropTypes.string,
    inputWidth: PropTypes.number,
    allowTime: PropTypes.bool,
    allowEmptyValue: PropTypes.bool,
    showApply: PropTypes.bool,
    disabled: PropTypes.bool,
    hasClear: PropTypes.bool,
  };

  static defaultProps = {
    hasClear: true,
    showApply: true,
  };

  constructor(props) {
    super(props);

    this.ref = React.createRef();
    this.inputRef = React.createRef();
    this.popupRef = React.createRef();
    this.bodyRef = React.createRef();
    [this.minDate, this.maxDate] = [...this.getExtremeDates()];

    this.inputWidth = this.getInputWidth();

    const locale = this.props.locale || 'ru';
    const range = rangeHandlers.getRangeFromProps(this.props);

    this.state = {
      range,
      locale,
      scale: this.getScale(),
      dateFormat: 'default',
      prevPropsRange: range,
      lastValidRange: range,
      isBodyVisible: false,
      errorMessage: '',
      searchText: rangeHandlers.getConvertingDateFromRange(this.props, range),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const curPropsRange = rangeHandlers.getRangeFromProps(props);

    if (!rangeHandlers.isRangesEqual(state.prevPropsRange, curPropsRange)) {
      return {
        range: curPropsRange,
        prevPropsRange: curPropsRange,
        lastValidRange: curPropsRange,
        errorMessage: '',
        searchText: rangeHandlers.getConvertingDateFromRange(props, curPropsRange),
        ...(props.scale !== state.scale && { scale: props.scale }),
      };
    }

    return {
      ...state,
      ...(props.scale !== state.scale && { scale: props.scale }),
    };
  }

  componentDidUpdate() {
    const { disabled } = this.props;
    const { errorMessage } = this.state;

    [this.minDate, this.maxDate] = [...this.getExtremeDates()];

    if (errorMessage && disabled) {
      this.setState({
        errorMessage: '',
        searchText: '',
      });
    }
  }

  onHideBody = () => {
    const { range, scale } = this.state;

    if ((range[0] && range[1] && !scale) || (range[0] && scale)) {
      this.onSubmit();
    } else {
      this.setState({
        isBodyVisible: false,
        errorMessage: getErrorMessage(this.props, range, scale),
      });
    }

    if (!scale) {
      // ставим задержку, так как на Popup исчезает с анимацией
      setTimeout(() => this.bodyRef.current.changeType('day'), 100);
    }
  };

  getExtremeDates() {
    let minDate, maxDate;

    if (this.props.minDate) {
      const isValid = dateHelpers.isISOStringValid(this.props.minDate);

      if (isValid) {
        minDate = new Date(this.props.minDate);
        minDate.setHours(0);
      } else {
        console.warn('minDate is invalid');
      }
    }

    if (this.props.maxDate) {
      const isValid = dateHelpers.isISOStringValid(this.props.maxDate);

      if (isValid) {
        maxDate = new Date(this.props.maxDate);
        maxDate.setHours(23);
        maxDate.setMinutes(59);
      } else {
        console.warn('maxDate is invalid');
      }
    }

    return [minDate, maxDate];
  }

  getScale() {
    const { scale } = this.props;

    if (!scale) {
      return undefined;
    }

    if (VALID_SCALES.includes(scale)) {
      return scale;
    }

    console.warn("scale is invalid. Available values: 'day', 'month', 'year'");

    return undefined;
  }

  getInputWidth() {
    const { inputWidth } = this.props;

    if (!inputWidth) {
      return INPUT_WIDTH_DEFAULT;
    }

    if (inputWidth < INPUT_WIDTH_MIN) {
      console.warn('Input width cannot be less than 100px');
      return INPUT_WIDTH_MIN;
    }

    return inputWidth;
  }

  getInputPlaceholder() {
    const { allowTime, timePrecision } = this.props;
    const { locale, scale } = this.state;

    if (scale) {
      return locales[locale].placeholder[scale];
    }

    if (!allowTime) {
      return locales[locale].placeholder[DEFAULT_SCALE].noTime;
    }

    if (!timePrecision) {
      return locales[locale].placeholder[DEFAULT_SCALE][DEFAULT_TIME_PRECISION];
    }

    if (!VALID_TIME_PRECISION_FORMATS.includes(timePrecision)) {
      console.warn("timePrecision is invalid. Available values: 'min', 'sec'");
      return locales[locale].placeholder[DEFAULT_SCALE].noTime;
    }

    return locales[locale].placeholder[DEFAULT_SCALE][timePrecision];
  }

  getResultDate(date) {
    const { allowTime } = this.props;

    if (!allowTime) {
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (day < 10) {
        day = `0${day}`;
      }

      if (month < 10) {
        month = `0${month}`;
      }

      return `${year}-${month}-${day}`;
    }

    const newDate = new Date(date);

    newDate.setTime(newDate.getTime() - newDate.getTimezoneOffset() * 60 * 1000);

    return newDate.toISOString();
  }

  // getDateFormat() {
  //     const {dateFormat} = this.props;
  //
  //     if (!dateFormat) {
  //         return undefined;
  //     }
  //
  //     if (VALID_DATES_FORMATS.includes(dateFormat)) {
  //         return dateFormat;
  //     }
  //
  //     console.warn('dateFormat is invalid. Available values: \'iso\'');
  //
  //     return undefined;
  // }

  addDateToRange = (date, curType, isPresetClicked) => {
    const { scale } = this.state;

    let range = Array.from(this.state.range);

    if (!this.type) {
      this.pickCount = 0;
    }

    if (this.type !== curType || isPresetClicked) {
      this.type = curType;
      this.pickCount = 0;
      range = [];
    }

    if (curType === 'day') {
      if (scale) {
        // при выставленном поле scale всегда записываем дату в начало массива
        range[0] = date;
      } else if (range.length < 2) {
        range.push(date);
      } else {
        range = [];
        range.push(date);
      }
    } else if (scale) {
      // обработчик для массива дат при выставленном поле scale
      const fromDate = date[0];

      range.length = 1;
      range[0] = fromDate;
    } else {
      // обработчик для массива дат при не выставленном поле scale
      const [fromDate, toDate] = [...date];

      if (!range.length || this.pickCount >= 2) {
        if (this.pickCount >= 2) {
          this.pickCount = this.pickCount >= 2 ? 0 : this.pickCount;
          range = [];
        }

        range.push(fromDate, toDate);
      } else if (range[0].getTime() === fromDate.getTime()) {
        // если пытаемся добавить такую же дату
        return;
      } else if (range[0].getTime() > fromDate.getTime()) {
        // если добавляем более раннюю дату вторым кликом
        range[0] = fromDate;
      } else if (range[1].getTime() < fromDate.getTime()) {
        range[1] = toDate;
      }

      this.pickCount += 1;
    }

    if (this.props.allowTime && range[1]) {
      range = rangeHandlers.getRegularizeRange(range);
      range[1].setHours(23);
      range[1].setMinutes(59);
    }

    if (this.type === 'day' && isPresetClicked) {
      const [year, month, day] = [range[0].getFullYear(), range[0].getMonth(), range[0].getDate()];
      range[1] = new Date(year, month, day, 23, 59);
    }

    this.setState(
      {
        range,
        errorMessage: '',
        searchText: rangeHandlers.getConvertingDateFromRange(this.props, range),
      },
      () => {
        if (!this.props.showApply && ((this.props.scale && range.length) || range.length === 2)) {
          this.onSubmit();
        }
      },
    );
  };

  onChange = searchText => {
    if (!searchText) {
      this.setState({
        searchText,
        errorMessage: '',
        range: [],
      });

      return;
    }

    const { scale, dateFormat } = this.state;
    const currentRange = getDatesFromSearchTemplate(searchText, scale, dateFormat);
    const resultRange = rangeHandlers.getResultRange(this.state.range, currentRange);

    this.bodyRef.current.changeHlManagerDateType();

    if (rangeHandlers.isRangesEqual(this.state.range, resultRange)) {
      this.setState({
        searchText,
        errorMessage: '',
      });
    } else {
      this.setState({
        searchText,
        errorMessage: '',
        range: resultRange,
      });
    }
  };

  onFocus = () => {
    if (!this.state.isBodyVisible) {
      this.setState({ isBodyVisible: true });
    }
  };

  onSubmit = () => {
    const { scale } = this.state;
    const { getRegularizeRange, getTrimmedRegularizedRange } = rangeHandlers;

    const regularizedRange = getRegularizeRange(this.state.range);
    const trimmedRegularizedRange = getTrimmedRegularizedRange(regularizedRange, this.minDate, this.maxDate);
    const [fromDate, toDate] = [...trimmedRegularizedRange];

    const ISODates = {
      from: this.getResultDate(fromDate),
      to: !scale && toDate && this.getResultDate(toDate),
    };

    let month;

    if (scale) {
      switch (scale) {
        case 'month':
          month = fromDate.getMonth() + 1;
          ISODates.from = `${fromDate.getFullYear()}-${month < 10 ? `0${month}` : month}`;
          break;
        case 'year':
          ISODates.from = `${fromDate.getFullYear()}`;
          break;
      }
    }

    this.inputRef.current.blur();
    this.props.callback(ISODates);

    this.setState({
      range: trimmedRegularizedRange,
      lastValidRange: trimmedRegularizedRange,
      isBodyVisible: false,
      errorMessage: getErrorMessage(this.props, trimmedRegularizedRange, scale),
      searchText: rangeHandlers.getConvertingDateFromRange(this.props, trimmedRegularizedRange),
    });
  };

  onInputEscapePress() {
    const { range, lastValidRange, scale } = this.state;

    if (rangeHandlers.isRangesEqual(range, lastValidRange)) {
      return;
    }

    this.setState({
      range: lastValidRange,
      errorMessage: getErrorMessage(this.props, lastValidRange, scale),
      searchText: rangeHandlers.getConvertingDateFromRange(this.props, lastValidRange),
    });
  }

  outInputEscapePress = event => {
    const { esc } = constants.keyCodes;

    if (event.keyCode === esc) {
      this.setState({ isBodyVisible: false });
    }
  };

  onEnterPress() {
    const { range, scale } = this.state;

    if ((range[0] && range[1] && !scale) || (range[0] && scale)) {
      this.onSubmit();
    }
  }

  onInputKeyPress = event => {
    const { enter, esc } = constants.keyCodes;

    if (event.keyCode === esc) {
      // не даем свернуть окно браузера (в Safari, Opera и т.д.)
      event.nativeEvent.preventDefault();
      this.onInputEscapePress();
      return;
    }

    if (event.keyCode === enter) {
      this.onEnterPress();
    }
  };

  onOutsidePopupClickHandler = () => this.onHideBody();

  render() {
    const { disabled, hasClear, showApply } = this.props;
    const { searchText, errorMessage, isBodyVisible, locale, range, scale } = this.state;

    return (
      <div
        className={b()}
        style={{
          width: this.inputWidth,
        }}
        ref={this.ref}
        onKeyDown={this.outInputEscapePress}
      >
        <FieldWrapper error={errorMessage}>
          <TextInput
            ref={this.inputRef}
            theme="normal"
            size="s"
            view="default"
            tone="default"
            text={searchText}
            onChange={this.onChange}
            onKeyDown={this.onInputKeyPress}
            onFocus={this.onFocus}
            placeholder={this.getInputPlaceholder()}
            disabled={disabled}
            hasClear={hasClear}
          />
        </FieldWrapper>
        {isBodyVisible && (
          <Popup
            ref={this.popupRef}
            cls={b('popup', LEGO_POPUP_MIX_CLASS)}
            theme="normal"
            visible={isBodyVisible}
            anchor={this.inputRef.current}
            directions={AVAILABLE_POPUP_DIRECTIONS}
            onOutsideClick={this.onOutsidePopupClickHandler}
          >
            <Body
              ref={this.bodyRef}
              visible={isBodyVisible}
              showApply={showApply}
              lang={locale}
              scale={scale}
              minDate={this.minDate}
              maxDate={this.maxDate}
              range={range}
              addDateToRange={this.addDateToRange}
              onSubmit={this.onSubmit}
            />
          </Popup>
        )}
      </div>
    );
  }
}
