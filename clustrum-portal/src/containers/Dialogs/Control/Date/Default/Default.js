import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';

import { RadioBox, TextInput } from 'lego-on-react';
import { Datepicker, YCSelect } from '@kamatech-data-ui/common/src';

import Dialog from '../../Dialog/Dialog';
import Button from '../../Switchers/Button';

import { DATE_FORMAT } from '../../constants';
import { CONTROL_SOURCE_TYPE, FILTER_TYPES } from '../../../../../constants/constants';
import { getLang } from '../../../../../helpers/utils-dash';

// import './Default.scss';

const DEFAULT_RANGE_TYPES = {
  CurrentMonth: 'value_current_month',
  CurrentQuarter: 'value_current_quarter',
  CurrentYear: 'value_current_year',
};

const DEFAULT_RANGES = [
  DEFAULT_RANGE_TYPES.CurrentMonth,
  DEFAULT_RANGE_TYPES.CurrentQuarter,
  DEFAULT_RANGE_TYPES.CurrentYear,
];

const getDefaultRanges = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const formattedCurrentMonth = `0${currentMonth + 1}`.slice(-2);
  const currentMonthLastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

  const currentQuarter = Math.floor((currentMonth + 3) / 3);
  const currentQuarterEnd = currentQuarter * 3 - 1;
  const currentQuarterStart = currentQuarterEnd - 2;
  const formattedCurrentQuarterStart = `0${currentQuarterStart + 1}`.slice(-2);
  const formattedCurrentQuarterEnd = `0${currentQuarterEnd + 1}`.slice(-2);
  const currentQuarterEndLastDay = new Date(currentYear, currentQuarterEnd + 2, 0).getDate();

  return {
    [DEFAULT_RANGE_TYPES.CurrentMonth]: {
      from: moment(`${currentYear}-${formattedCurrentMonth}-01`).format(),
      to: moment(`${currentYear}-${formattedCurrentMonth}-${currentMonthLastDay}`).format(),
    },
    [DEFAULT_RANGE_TYPES.CurrentQuarter]: {
      from: moment(`${currentYear}-${formattedCurrentQuarterStart}-01`).format(),
      to: moment(`${currentYear}-${formattedCurrentQuarterEnd}-${currentQuarterEndLastDay}`).format(),
    },
    [DEFAULT_RANGE_TYPES.CurrentYear]: {
      from: moment(`${currentYear}-01-01`).format(),
      to: moment(`${currentYear}-12-31`).format(),
    },
  };
};

const getDefaultRangeType = range => {
  let defaultRangeType = '';
  const defaultRanges = getDefaultRanges();

  for (const rangeType in defaultRanges) {
    const defaultRange = defaultRanges[rangeType];

    if (range.from === defaultRange.from && range.to === defaultRange.to) {
      defaultRangeType = rangeType;

      break;
    }
  }

  return defaultRangeType;
};

const singleItems = [
  {
    val: FILTER_TYPES.NoDefined,
    get text() {
      return 'Не определено';
    },
  },
  {
    val: FILTER_TYPES.AcceptableFrom,
    get text() {
      return 'Начало допустимого интервала';
    },
    sourceType: CONTROL_SOURCE_TYPE.MANUAL,
  },
  {
    val: FILTER_TYPES.AcceptableTo,
    get text() {
      return 'Конец допустимого интервала';
    },
    sourceType: CONTROL_SOURCE_TYPE.MANUAL,
  },
  {
    val: FILTER_TYPES.Date,
    get text() {
      return 'Выбор определенного значения из календаря';
    },
  },
  {
    val: FILTER_TYPES.Relative,
    get text() {
      return 'Выбор значения относительно текущего дня';
    },
  },
];

const rangeItems = [
  {
    val: FILTER_TYPES.NoDefined,
    get text() {
      return 'Не определено';
    },
  },
  {
    val: FILTER_TYPES.AcceptableFullInterval,
    get text() {
      return 'Весь допустимый интервал';
    },
    sourceType: CONTROL_SOURCE_TYPE.MANUAL,
  },
  {
    val: FILTER_TYPES.Date,
    get text() {
      return 'Выбор определенного значения из календаря';
    },
  },
  {
    val: FILTER_TYPES.Relative,
    get text() {
      return 'Выбор значения относительно текущего дня';
    },
  },
  {
    val: FILTER_TYPES.DefaultRanges,
    get text() {
      return 'Выбор значения по умолчанию';
    },
  },
];

// const b = block('dialog-default');

const b = block('date-manual-default-value');

const mixRadioBox = { block: b('radiobox') };

class Default extends React.PureComponent {
  static propTypes = {
    sourceType: PropTypes.oneOf(Object.values(CONTROL_SOURCE_TYPE)).isRequired,
    acceptableValues: PropTypes.object.isRequired,
    defaultValue: PropTypes.any,
    isRange: PropTypes.bool,
    onApply: PropTypes.func.isRequired,
  };

  static defaultProps = {
    acceptableValues: {},
    defaultValue: { value: {} },
  };

  state = {
    showDialog: false,
    defaultValue: this.props.defaultValue,
  };

  closeDialog = () => this.setState({ showDialog: false });

  findItemTextByVal(items, val) {
    const findItem = items.find(item => item.val === val);
    return findItem ? findItem.text : '';
  }

  getText() {
    const { defaultValue, isRange } = this.props;
    const { type, value: { from, to } = {} } = defaultValue;
    const noLimits = 'Не ограничено';
    const noChoose = 'Не выбрано';
    const noDefined = 'Не определено';
    switch (type) {
      case FILTER_TYPES.AcceptableFrom:
        return this.findItemTextByVal(singleItems, FILTER_TYPES.AcceptableFrom);
      case FILTER_TYPES.AcceptableTo:
        return this.findItemTextByVal(singleItems, FILTER_TYPES.AcceptableTo);
      case FILTER_TYPES.AcceptableFullInterval:
        return this.findItemTextByVal(rangeItems, FILTER_TYPES.AcceptableFullInterval);
      case FILTER_TYPES.DefaultRanges:
      case FILTER_TYPES.Date:
        if (isRange) {
          const fromText = from ? moment(from).format(DATE_FORMAT) : noLimits;
          const toText = to ? moment(to).format(DATE_FORMAT) : noLimits;
          return `${fromText} - ${toText}`;
        } else {
          return moment(from).format(DATE_FORMAT);
        }
      case FILTER_TYPES.Relative:
        if (isRange) {
          const fromText = from ? from : noChoose;
          const toText = to ? to : noChoose;
          return `Начало, дней назад: ${from}. Конец, дней назад: ${to}`;
        } else {
          return `Дней назад: ${from}`;
        }
      default:
        return noDefined;
    }
  }

  onEnter = () => {
    const { defaultValue } = this.state;
    let data = cloneDeep(defaultValue);
    if (data.type === FILTER_TYPES.Relative) {
      if (this.props.isRange) {
        if ((data.value.from === '-' && data.value.to === '-') || (data.value.from === '' && data.value.to === '')) {
          data = this.initDefaultValues;
        } else if (data.value.from === '-') {
          data.value.from = '';
        } else if (data.value.to === '-') {
          data.value.to = '';
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (data.value.from === '-' || data.value.from === '') {
          data = this.initDefaultValues;
        }
      }
    } else if (data.type === FILTER_TYPES.Date || data.type === FILTER_TYPES.DefaultRanges) {
      if (this.props.isRange) {
        if (data.value.from === '' && data.value.to === '') {
          data = this.initDefaultValues;
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (data.value.from === '') {
          data = this.initDefaultValues;
        }
      }
    }
    this.props.onApply({ defaultValue: data });
    this.closeDialog();
  };

  onChangeRadioBox = event => this.setState({ defaultValue: { ...this.initDefaultValues, type: event.target.value } });

  get initDefaultValues() {
    return { type: '', value: { from: '', to: '' } };
  }

  onChangeInput(name) {
    return text => {
      const { defaultValue } = this.state;
      if (this.isValidNumber(text)) {
        this.setState({ defaultValue: { ...defaultValue, value: { ...defaultValue.value, [name]: text } } });
      }
    };
  }

  isValidNumber(text) {
    return /^(-?\d*)$/.test(text);
  }

  renderRange() {
    const { defaultValue } = this.state;
    const type = defaultValue.type || FILTER_TYPES.NoDefined;
    const { acceptableValues, sourceType } = this.props;
    const minDate = acceptableValues.from || undefined;
    const maxDate = acceptableValues.to || undefined;
    const hasDefaultValue = !!(defaultValue && defaultValue.value);
    const fromDate = (hasDefaultValue && defaultValue.value.from) || undefined;
    const toDate = (hasDefaultValue && defaultValue.value.to) || undefined;
    const fromInput = (hasDefaultValue && defaultValue.value.from) || '';
    const toInput = (hasDefaultValue && defaultValue.value.to) || '';
    let defaultRangeType = '';

    if (type === FILTER_TYPES.DefaultRanges && hasDefaultValue) {
      defaultRangeType = getDefaultRangeType(defaultValue.value);
    }

    return rangeItems.map(item =>
      !item.sourceType || item.sourceType === sourceType ? (
        <React.Fragment key={item.val}>
          <div className={b('radiobox-place')}>
            <RadioBox
              theme="normal"
              view="default"
              tone="default"
              size="s"
              name={item.val}
              value={type}
              onChange={this.onChangeRadioBox}
              mix={mixRadioBox}
            >
              <RadioBox.Radio value={item.val}>{item.text}</RadioBox.Radio>
            </RadioBox>
          </div>
          <div className={b('radiobox-content')}>
            {item.val === FILTER_TYPES.Date && type === item.val && (
              <div className={b('rangepicker-place')}>
                <Datepicker
                  locale={getLang()}
                  minDate={minDate}
                  maxDate={maxDate}
                  fromDate={fromDate}
                  toDate={toDate}
                  allowEmptyValue={true}
                  hasClear={false}
                  showApply={false}
                  emptyValueText="Не выбрано"
                  callback={({ from, to }) =>
                    this.setState({
                      defaultValue: {
                        ...this.state.defaultValue,
                        value: {
                          from: from ? moment(from).format() : '',
                          to: to ? moment(to).format() : '',
                        },
                      },
                    })
                  }
                />
              </div>
            )}
            {item.val === FILTER_TYPES.Relative && type === item.val && (
              <div className={b('inputs-range-place')}>
                <TextInput
                  theme="normal"
                  view="default"
                  tone="default"
                  placeholder="Начало, дней назад"
                  onChange={this.onChangeInput('from')}
                  text={fromInput}
                />
                <TextInput
                  theme="normal"
                  view="default"
                  tone="default"
                  placeholder="Конец, дней назад"
                  onChange={this.onChangeInput('to')}
                  text={toInput}
                />
              </div>
            )}
            {item.val === FILTER_TYPES.DefaultRanges && type === item.val && (
              <div className={b('default-ranges-select-place')}>
                <YCSelect
                  showSearch={false}
                  type={'single'}
                  allowEmptyValue={false}
                  value={defaultRangeType}
                  onChange={defaultRangeType =>
                    this.setState({
                      defaultValue: {
                        ...this.state.defaultValue,
                        value: getDefaultRanges()[defaultRangeType],
                      },
                    })
                  }
                  disabled={false}
                  items={DEFAULT_RANGES.map(value => {
                    const currentValue = {
                      value_current_month: 'Текущий месяц',
                      value_current_quarter: 'Текущий квартал',
                      value_current_year: 'Текущий год',
                    };

                    return {
                      value,
                      title: currentValue[value],
                      key: value,
                    };
                  })}
                />
              </div>
            )}
          </div>
        </React.Fragment>
      ) : null,
    );
  }

  renderSingle() {
    const { defaultValue } = this.state;
    const dateValue = (defaultValue.value && defaultValue.value.from) || '';
    const type = defaultValue.type || FILTER_TYPES.NoDefined;
    const { acceptableValues, sourceType } = this.props;
    const minDate = acceptableValues.from || undefined;
    const maxDate = acceptableValues.to || undefined;

    return singleItems.map(item =>
      !item.sourceType || item.sourceType === sourceType ? (
        <React.Fragment key={item.val}>
          <div className={b('radiobox-place')}>
            <RadioBox
              theme="normal"
              view="default"
              tone="default"
              size="s"
              name={item.val}
              value={type}
              onChange={this.onChangeRadioBox}
              mix={mixRadioBox}
            >
              <RadioBox.Radio value={item.val}>{item.text}</RadioBox.Radio>
            </RadioBox>
          </div>
          <div className={b('radiobox-content')}>
            {item.val === FILTER_TYPES.Date && type === item.val && (
              <div className={b('datepicker-place')}>
                <Datepicker
                  locale={getLang()}
                  minDate={minDate}
                  maxDate={maxDate}
                  date={dateValue}
                  scale="day"
                  allowEmptyValue={true}
                  hasClear={false}
                  showApply={false}
                  emptyValueText="Не выбрано"
                  callback={({ from }) => {
                    const { defaultValue } = this.state;
                    this.setState({
                      defaultValue: {
                        ...defaultValue,
                        value: {
                          ...defaultValue.value,
                          from: from ? moment(from).format() : '',
                        },
                      },
                    });
                  }}
                />
              </div>
            )}
            {item.val === FILTER_TYPES.Relative && type === item.val && (
              <div className={b('input-single-place')}>
                <TextInput
                  theme="normal"
                  view="default"
                  tone="default"
                  placeholder="Дней назад"
                  onChange={this.onChangeInput('from')}
                  text={dateValue || ''}
                />
              </div>
            )}
          </div>
        </React.Fragment>
      ) : null,
    );
  }

  renderDialog() {
    const { showDialog } = this.state;
    return (
      <Dialog visible={showDialog} caption="Значение по умолчанию" onApply={this.onEnter} onClose={this.closeDialog}>
        {this.props.isRange ? this.renderRange() : this.renderSingle()}
      </Dialog>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Button
          title="Значение по умолчанию"
          text={this.getText()}
          onClick={() => this.setState({ showDialog: !this.state.showDialog })}
        />
        {this.renderDialog()}
      </React.Fragment>
    );
  }
}

export default Default;
