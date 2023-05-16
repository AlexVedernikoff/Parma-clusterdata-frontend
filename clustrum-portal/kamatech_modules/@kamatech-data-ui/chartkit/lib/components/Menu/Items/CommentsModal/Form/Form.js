import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import moment from 'moment/moment';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

import DatePicker from '@kamatech-data-ui/react-components/src/components/DatePicker';
import RangeDatePicker from '@kamatech-data-ui/react-components/src/components/RangeDatePicker';
import { RadioButton, TextArea, Select, Button } from 'lego-on-react';

import DropdownPicker from './DropdownPicker/DropdownPicker';
import TypedPopup from '../TypedPopup/TypedPopup';
import Icon from '../../../../Icon/Icon';

import settings from '../../../../../modules/settings/settings';
import CONFIGS_OF_TYPES from './configsOfTypes';
import { TYPES as TYPES_OF_COMMENTS } from './commentsTypes';
import { DEFAULT_COLOR, createComment, updateComment } from '../../../../../modules/comments/comments';

// import './Form.scss';

const INFO_DATE_FORMAT = 'DD.MM.YYYY HH:mm:ss';

const b = block('comment-form');

// TODO: может соединять через запятую (если запятые не могут присутствовать в параметрах) (?)
function paramsToText(params) {
  return params
    ? Object.keys(params)
        .map(key => params[key].map(value => `${key}=${value}`).join('\n'))
        .join('\n')
    : '';
}

function textToParams(text) {
  return text
    ? text.match(/(.*)=(.*)/g).reduce((result, match) => {
        const [key, value] = match.split('=');
        if (Array.isArray(result[key])) {
          result[key].push(value);
        } else {
          result[key] = [value];
        }
        return result;
      }, {})
    : null;
}

function _getNewState({
  id,
  currentFeed,
  currentParams,
  dateMinMs,
  dateMaxMs,
  graphs,
  scale,
  onAction,
  date,
  dateUntil,
  color,
  feed,
  graphId,
  params,
  ...props
}) {
  const actualParams = id ? params : params || currentParams;
  return {
    ...cloneDeep(props),
    id,
    date: date || moment.utc(dateMinMs).format(),
    dateUntil: dateUntil || moment.utc(dateMaxMs).format(),
    color: color || (props.type === TYPES_OF_COMMENTS.DOT_XY ? undefined : DEFAULT_COLOR),
    graphId: graphId || (graphs.length && graphs[0].value),
    feed: feed || currentFeed,
    params: actualParams,
    paramsText: paramsToText(actualParams),

    isProgress: false,

    isFeedEditing: false,
    isParamsEditing: false,

    validation: {},
  };
}

// TODO: TextArea {resize: 'vertical', minHeight: '28px'} и ресайз вместе с блоком без наложения на другие элементы
// TODO: инпут для заголовка флага

// TODO: feed и params брать из первого элемента в feeds

export default class Form extends React.PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    feed: PropTypes.string,
    type: PropTypes.oneOf(Object.keys(TYPES_OF_COMMENTS).map(key => TYPES_OF_COMMENTS[key])),
    text: PropTypes.string,
    date: PropTypes.string,
    dateUntil: PropTypes.string,

    createdDate: PropTypes.string,
    creatorLogin: PropTypes.string,
    modifiedDate: PropTypes.string,
    modifierLogin: PropTypes.string,

    params: PropTypes.object,
    isStat: PropTypes.bool,

    // notMatchedByParams: PropTypes.bool,

    // meta
    color: PropTypes.string,
    // band-x, dot-x-y
    visible: PropTypes.bool,
    // band-x
    zIndex: PropTypes.number,
    // line-x
    dashStyle: PropTypes.string,
    width: PropTypes.number,
    // dot-x-y
    graphId: PropTypes.string,
    fillColor: PropTypes.string,
    textColor: PropTypes.string,
    // flag-x
    y: PropTypes.number,
    shape: PropTypes.string,

    currentFeed: PropTypes.string.isRequired,
    currentParams: PropTypes.object,
    dateMinMs: PropTypes.number,
    dateMaxMs: PropTypes.number,
    scale: PropTypes.oneOf(['s', 'i', 'h', 'd', 'w', 'm', 'q', 'y']),
    feeds: PropTypes.arrayOf(
      PropTypes.shape({
        feed: PropTypes.string.isRequired,
        params: PropTypes.object,
      }),
    ),
    graphs: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, text: PropTypes.string })),

    // isStatChart: PropTypes.bool,
    // isBrowserChart: PropTypes.bool,

    onAction: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    graphs: [],
    feeds: [],

    id: null,
    feed: null,
    type: CONFIGS_OF_TYPES[0].value,
    text: null,

    createdDate: null,
    creatorLogin: null,
    modifiedDate: null,
    modifierLogin: null,

    // band-x, dot-x-y
    visible: true,
    // band-x
    zIndex: 0,
    // line-x
    dashStyle: 'Solid',
    width: 2,
    // dot-x-y
    fillColor: '#000000',
    textColor: '#ffffff',
    // flag-x
    y: -30,
    shape: 'flag',
  };

  get _isEdit() {
    return Boolean(this.props.id);
  }

  // ref на компоненты для попапа валидации/ошибок/успехов
  _refs = {};

  _renderInfo() {
    return this._isEdit ? (
      <div className={b('row', { info: true })}>
        <div className={b('cell')}>
          {this.props.isStat
            ? `Создан: <${this.state.creatorLogin}>`
            : `Создан: ${moment(this.state.createdDate).format(INFO_DATE_FORMAT)} <${this.state.creatorLogin}>`}
        </div>
        {this.state.modifiedDate && (
          <div className={b('cell')}>
            {`Отредактирован: ${moment(this.state.modifiedDate).format(INFO_DATE_FORMAT)} <${
              this.state.modifierLogin
            }>`}
          </div>
        )}
      </div>
    ) : (
      <div className={b('row', { info: true })} />
    );
  }

  _renderTypes() {
    const availableTypes = this.props.isStat ? CONFIGS_OF_TYPES.slice(0, 2) : CONFIGS_OF_TYPES;
    return (
      <div className={b('row')}>
        <div className={b('cell', { header: true })}>Тип</div>
        <div className={b('cell')}>
          <RadioButton
            theme="normal"
            size="s"
            width="max"
            value={availableTypes.findIndex(({ value }) => value === this.state.type)}
            onChange={event => this.setState({ type: availableTypes[Number(event.target.value)].value })}
          >
            {availableTypes.map(({ text }, index) => (
              <RadioButton.Radio value={index} key={index}>
                {text}
              </RadioButton.Radio>
            ))}
          </RadioButton>
        </div>
      </div>
    );
  }

  _renderText() {
    return (
      <div className={b('row')}>
        <div className={b('cell', { header: true })}>Текст</div>
        <div className={b('cell')}>
          <TextArea
            theme="normal"
            size="s"
            rows={3}
            text={this.state.text}
            controlAttrs={{ style: { resize: 'none' } }}
            onChange={value => this.setState({ text: value })}
            ref={component => {
              this._refs.text = component;
            }}
          />
        </div>
      </div>
    );
  }

  _renderDate() {
    let timeFormat = null;

    // TODO: брать 86400000 из closesPointRange
    if (['i', 'h'].includes(this.props.scale) || moment(this.state.date).valueOf() % 86400000 !== 0) {
      timeFormat = 'HH:mm';
    }

    if (this.props.scale === 's') {
      timeFormat = 'HH:mm:ss';
    }

    const commonProps = {
      size: 's',
      locale: settings.lang,
      useStringsInCallback: true,
      utc: true, // для RangeDatePicker, чтобы при выборе времени в DatePicker не отображалось время +3 часа
      // minDate: moment(this.props.dateMinMs),
      // maxDate: moment(this.props.dateMaxMs),
      timeFormat,
    };

    return (
      <div className={b('control', { date: true })}>
        <div className={b('cell', { header: true })}>
          {this.state.type === TYPES_OF_COMMENTS.BAND_X ? 'Интервал' : 'Дата'}
        </div>
        <div className={b('cell')}>
          {!this.props.isStat && this.state.type === TYPES_OF_COMMENTS.BAND_X ? (
            <RangeDatePicker
              {...commonProps}
              quickIntervals={[]}
              value={{
                // если указать значение строкой, то в DatePicker будет одновременно меняться время
                // после применения и открытия DatePicker будет сегодняшняя дата
                from: moment.utc(this.state.date),
                // from: this.state.date,
                to: moment.utc(this.state.dateUntil),
                // to: this.state.dateUntil
              }}
              onChange={({ from, to }) => this.setState({ date: from, dateUntil: to })}
            />
          ) : (
            <DatePicker
              {...commonProps}
              value={moment.utc(this.state.date)}
              // value={this.state.date}
              onChange={date => this.setState({ date: date })}
            />
          )}
        </div>
      </div>
    );
  }

  _renderControls() {
    return CONFIGS_OF_TYPES.find(({ value }) => value === this.state.type).controls.map(
      ({ type, name, title, ...control }) => {
        if (control.dependency && !this.state[control.dependency]) {
          return null;
        }

        let component = null;
        switch (type) {
          case 'picker':
            const pickerValue = Array.isArray(name)
              ? name.reduce((result, item) => {
                  result[item] = this.state[item];
                  return result;
                }, {})
              : this.state[name];
            component = (
              <DropdownPicker
                value={pickerValue}
                items={control.items}
                buttonText={control.text}
                onChange={value => {
                  const state = Array.isArray(name)
                    ? name.reduce((result, item) => {
                        result[item] = value[item];
                        return result;
                      }, {})
                    : { [name]: value };
                  this.setState(state);
                }}
              />
            );
            break;
          case 'select':
            component = (
              <Select
                theme="normal"
                size="s"
                type="radio"
                width="max"
                val={this.state[name]}
                onChange={value => this.setState({ [name]: value[0] })}
              >
                {(control.items || this.props[control.props]).map((item, index) => (
                  <Select.Item val={item.value} key={index} icon={item.icon}>
                    {item.text}
                  </Select.Item>
                ))}
              </Select>
            );
            break;
          case 'radio':
            component = (
              <RadioButton
                theme="normal"
                size="s"
                width="max"
                value={Number(this.state[name])}
                onChange={event => this.setState({ [name]: Boolean(Number(event.target.value)) })}
              >
                {control.items.map((item, index) => (
                  <RadioButton.Radio value={item.value} key={index}>
                    {item.text}
                  </RadioButton.Radio>
                ))}
              </RadioButton>
            );
            break;
        }

        return (
          <div className={b('control', { [Array.isArray(name) ? name.join('-') : name]: true })} key={name}>
            <div className={b('cell', { header: true })}>{title}</div>
            <div className={b('cell')}>{component}</div>
          </div>
        );
      },
    );
  }

  _renderFeed() {
    return this.props.feeds.length > 1 && !this.props.isStat ? (
      <div className={b('row')}>
        <div className={b('cell', { header: true })}>Канал</div>
        <div className={b('cell')}>
          <Select
            theme="normal"
            size="s"
            type="radio"
            width="max"
            val={this.state.feed}
            onChange={([feed]) => {
              this.setState({ feed });
              if (!this.state.isParamsEditing) {
                this.setState({
                  paramsText: paramsToText(
                    this.props.feeds.reduce((result, item) => (item.feed === feed ? item.params : result), {}),
                  ),
                });
              }
            }}
          >
            {this.props.feeds.map(({ feed, params = {} }, index) => (
              <Select.Item val={feed} key={index}>
                {`${feed}${Object.keys(params).length ? ` [${Object.keys(params).join(', ')}]` : ''}`}
              </Select.Item>
            ))}
          </Select>
        </div>
      </div>
    ) : (
      <div className={b('row')}>
        <div className={b('cell')}>
          {this.props.isStat && <span className={b('deprecated')}>DEPRECATED</span>}
          {`Канал: ${this.state.feed}`}
          <Icon
            size="20"
            name="pencil"
            className={b('icon', { hidden: true })}
            onClick={() => this.setState({ isFeedEditing: true })}
          />
        </div>
      </div>
    );
  }

  _renderParams() {
    // const hidden = this.props.isStatChart || this.props.isBrowserChart;
    const hidden = false;
    if (this.props.isStat || (hidden && !this.state.paramsText)) {
      return null;
    }
    return this.state.isParamsEditing ? (
      <div className={b('row')}>
        <div className={b('cell', { header: true })}>Параметры</div>
        <div className={b('cell')}>
          <TextArea
            theme="normal"
            size="s"
            rows={3}
            text={this.state.paramsText}
            controlAttrs={{ style: { resize: 'none' } }}
            placeholder={'scale=d\nregion=RU\nregion=TOT'}
            onChange={value => this.setState({ paramsText: value })}
            ref={component => {
              this._refs.paramsText = component;
            }}
          />
        </div>
      </div>
    ) : (
      <div className={b('row')}>
        <div className={b('cell')}>
          {`Параметры: ${this.state.paramsText.replace(/\n/g, ', ')}`}
          <Icon
            size="16"
            name="pencil"
            className={b('icon', { hidden })}
            onClick={() => this.setState({ isParamsEditing: true })}
          />
        </div>
      </div>
    );
  }

  // TODO: Paranja/Loading как у List
  async _onAction() {
    if (!this.state.text) {
      this.setState({
        validation: {
          field: 'text',
          type: 'error',
          text: 'Поле должно быть заполнено',
          directions: ['right-center', 'top-center'],
        },
      });
      return;
    }

    let params;
    try {
      params = textToParams(this.state.paramsText);
    } catch (error) {
      this.setState({
        validation: {
          field: 'paramsText',
          type: 'error',
          text: 'Описание параметров должно быть в формате:\nscale=d\nregion=TOT\nregion=RU',
          directions: ['right-center', 'top-center'],
        },
      });
      return;
    }

    this.setState({ isProgress: true });

    const validation = {
      field: 'action',
      directions: ['top-center'],
    };

    try {
      const comment = {
        id: this.props.id,
        feed: this.state.feed,
        type: this.state.type,
        date: this.state.date,
        dateUntil: !this.props.isStat && TYPES_OF_COMMENTS.BAND_X === this.state.type ? this.state.dateUntil : null,
        text: this.state.text,
        meta: CONFIGS_OF_TYPES.find(({ value }) => value === this.state.type).controls.reduce((result, { name }) => {
          if (Array.isArray(name)) {
            name.forEach(item => {
              result[item] = this.state[item];
            });
          } else {
            result[name] = this.state[name];
          }
          return result;
        }, {}),
        params,
        isStat: this.props.isStat,
      };

      // TODO: не передавать seriesIds параметром
      const seriesIds = this.props.graphs.map(({ value }) => value);

      const response = await (this._isEdit ? updateComment(comment, seriesIds) : createComment(comment));
      const result = Object.assign(
        {
          createdDate: this.props.createdDate,
          creatorLogin: this.props.creatorLogin,
          modifiedDate: this.props.modifiedDate,
          modifierLogin: this.props.modifierLogin,
          // notMatchedByParams: this.props.notMatchedByParams
        },
        comment,
        response,
      );

      this.props.onAction(result, this._isEdit);

      Object.assign(validation, { type: 'success', text: 'Выполнено' });
    } catch (error) {
      console.error(error);
      Object.assign(validation, { type: 'error', text: 'Ошибка' });
    }

    this.setState({ isProgress: false, validation });
  }

  isDraft() {
    const origin = this._isEdit ? this.props : _getNewState(this.props);
    return (
      origin.text !== this.state.text ||
      moment(origin.date).diff(moment(this.state.date)) || // из-за разных форматов строк
      origin.feed !== this.state.feed ||
      (!origin.isStat && !isEqual(origin.params, textToParams(this.state.paramsText))) ||
      origin.type !== this.state.type ||
      CONFIGS_OF_TYPES.find(({ value }) => value === this.state.type).controls.some(
        ({ name }) => this.state[name] !== origin[name],
      )
    );
  }

  state = _getNewState(this.props);

  componentWillReceiveProps(nextProps, nextState) {
    // TODO: рендер происходит два раза, это не ок
    if (
      nextProps.id !== this.props.id ||
      nextProps.feed !== this.props.feed ||
      nextProps.modifiedDate !== this.props.modifiedDate
    ) {
      this.setState(_getNewState(nextProps));
    }
  }

  render() {
    return (
      <div className={b()}>
        <div className={b('header')}>{this._isEdit ? 'Редактировать комментарий' : 'Добавить комментарий'}</div>
        <div className={b('body')}>
          {this._renderInfo()}
          {this._renderTypes()}
          {this._renderText()}
          <div className={b('controls')}>
            {this._renderDate()}
            {this._renderControls()}
          </div>
          {this._renderFeed()}
          {this._renderParams()}
        </div>
        <div className={b('footer')}>
          <Button
            theme="action"
            size="m"
            progress={this.state.isProgress}
            mix={{ block: b('button') }}
            onClick={this._onAction.bind(this)}
            ref={component => {
              this._refs.action = component;
            }}
          >
            {this._isEdit ? 'Сохранить' : 'Добавить'}
          </Button>
          <Button theme="normal" size="m" mix={{ block: b('button') }} onClick={this.props.onClose}>
            Закрыть
          </Button>
        </div>
        <TypedPopup
          autoclosable
          theme="normal"
          type={this.state.validation.type}
          hasTail
          tailSize={12}
          visible={Boolean(this.state.validation.type)}
          anchor={this._refs[this.state.validation.field]}
          directions={this.state.validation.directions}
          onOutsideClick={() => this.setState({ validation: {} })}
        >
          {this.state.validation.text}
        </TypedPopup>
      </div>
    );
  }
}
