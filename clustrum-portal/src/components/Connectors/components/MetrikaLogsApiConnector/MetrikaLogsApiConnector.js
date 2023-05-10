import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import _debounce from 'lodash/debounce';
import { RadioButton, CheckBox } from 'lego-on-react';
import { Datepicker } from '@kamatech-data-ui/common/src';
import { PathSelect } from '@kamatech-data-ui/clustrum';
import Title from '../../subcomponents/Title/Title';
import Caption from '../../subcomponents/Caption/Caption';
import InputField from '../../subcomponents/InputField/InputField';
import SelectField from '../../subcomponents/SelectField/SelectField';
import LoaderField from '../../subcomponents/LoaderField/LoaderField';
import VerifyButton from '../../subcomponents/VerifyButton/VerifyButton';
import GetMetricaTokenButton from '../../subcomponents/GetMetricaTokenButton/GetMetricaTokenButton';
import { getErrorMessage, getCounterSelectItems } from '../../utils';
import {
  FIELD_TYPES,
  COUNTER_INPUT_METHODS,
  METRIKA_TOKEN_FAKE_VALUE,
  getStaticSelectItems,
} from '../../../../constants';
import Utils from '../../../../helpers/utils';
import { getSearchParam } from '../../../../helpers/QueryParams';

const b = block('dl-connector');

const DEFAULT_PORT = '8443';
const DEFAULT_DB_TYPE = 'metrika_api';
const DEFAULT_COUNTER_SOURCE = 'visits';
const DAYS_COUNT = 90;
const MILLISECONDS_IN_DAY = 86400000;
const CURRENT_DATE = new Date();
const DEFAULT_DATE_STRING = new Date(CURRENT_DATE - DAYS_COUNT * MILLISECONDS_IN_DAY).toISOString();
const MAX_DATE_STRING = new Date(CURRENT_DATE - MILLISECONDS_IN_DAY).toISOString();

const getMatSchedConfig = ({ enabled, materializationRegularity }) => {
  return {
    at_time: '03:00',
    enabled: enabled || materializationRegularity === 'regular',
    repeat_every: '1',
    scale: 'daily',
    until: null,
  };
};

class MetricaConnector extends React.Component {
  static propTypes = {
    onChangeCallback: PropTypes.func.isRequired,
    verifyConnection: PropTypes.func.isRequired,
    sdk: PropTypes.object.isRequired,
    connectionState: PropTypes.object,
    emptyFields: PropTypes.array,
  };

  static defaultProps = {
    connectionState: {},
  };

  constructor(props) {
    super(props);

    const {
      id,
      name,
      token,
      port,
      host,
      dbType,
      db_name: dbName,
      username,
      counter_id: counter,
      counter_source: counterSource,
      counter_creation_date: counterCreationDate,
      mat_start_date: materializationStartDate,
      mat_sched_config: { enabled } = {},
    } = this.props.connectionState;

    const materializationRegularity = enabled ? 'regular' : 'oneTime';

    this.state = {
      id,
      name,
      dirPath: getSearchParam('currentPath') || Utils.getPersonalFolderPath(),
      token,
      dbName,
      dbType: dbType || DEFAULT_DB_TYPE,
      host,
      port: port || DEFAULT_PORT,
      username,
      counter,
      counters: counter ? [{ key: counter, value: String(counter), title: counter }] : [],
      counterSource: counterSource || DEFAULT_COUNTER_SOURCE,
      counterInputMethod: COUNTER_INPUT_METHODS.LIST,
      counterCreationDate,
      materializationStartDate: materializationStartDate || DEFAULT_DATE_STRING,
      materializationRegularity,
      matSchedConfig: getMatSchedConfig({ enabled, materializationRegularity }),
      isCountersFetching: false,
      isAutoCreateDashboard: false,
    };
  }

  componentDidMount() {
    this.onChangeCallback();
  }

  get token() {
    const { token, id } = this.state;

    return id && token === undefined ? METRIKA_TOKEN_FAKE_VALUE : token;
  }

  get password() {
    const { password, id } = this.state;

    return id && password === undefined ? 'password' : password;
  }

  changeValue = data => {
    this.setState(
      {
        ...data,
      },
      this.onChangeCallback.bind(this, data),
    );
  };

  onChangeCallback = data => {
    const { onChangeCallback } = this.props;
    const { id, dbType } = this.state;

    if (onChangeCallback) {
      onChangeCallback(this.state);
    }

    if (data && data.hasOwnProperty('token') && (!id || (id && dbType === 'metrika_api'))) {
      if (this.debounced) {
        this.debounced.cancel();
      }

      this.debounced = _debounce(this.getMetrikaCountersId, 500);
      this.debounced(data.token);
    }
  };

  onDbTypeRadioButtonChange = e => {
    this.changeValue({
      dbType: e.target.value,
      isAutoCreateDashboard: false,
    });
  };

  getMetrikaCountersId = async token => {
    const { sdk } = this.props;

    try {
      this.changeValue({ isCountersFetching: true });
      const data = await sdk.getMetrikaCounters({ token });
      const counters = getCounterSelectItems(data.counters);

      this.changeValue({
        counters,
        isCountersFetching: false,
      });
    } catch (error) {
      this.changeValue({
        counters: [],
        counter: undefined,
        isCountersFetching: false,
      });
    }
  };

  selectCounter = ({ counter: counterId }) => {
    const { counters } = this.state;

    const { createTime } = counters.find(counter => counter.value === counterId);
    const createDate = new Date(createTime);
    const defaultDate = new Date(DEFAULT_DATE_STRING);
    const CREATE_DATE_STRING = createDate.toISOString();
    const materializationStartDate = defaultDate > createDate ? DEFAULT_DATE_STRING : CREATE_DATE_STRING;

    this.changeValue({
      materializationStartDate,
      counterCreationDate: CREATE_DATE_STRING,
      counter: counterId,
    });
  };

  toggleDashboardAutoCreation = () => {
    this.changeValue({
      isAutoCreateDashboard: !this.state.isAutoCreateDashboard,
    });
  };

  render() {
    const { sdk, emptyFields, verifyConnection, isVerifySuccess } = this.props;

    const {
      id,
      name,
      dirPath,
      dbType,
      dbName,
      host,
      port,
      username,
      counters,
      counter,
      isCountersFetching,
      isAutoCreateDashboard,
      counterSource,
      materializationStartDate,
      materializationRegularity,
      counterCreationDate,
      counterInputMethod,
    } = this.state;

    const isNewConnection = !id;

    return (
      <div className={b()}>
        <Title dbType={dbType} isNewConnection={isNewConnection} />
        <div className={b('fields')}>
          {isNewConnection && (
            <div className={b('row')}>
              <PathSelect
                size={'s'}
                inputError={getErrorMessage(emptyFields, FIELD_TYPES.NAME)}
                sdk={sdk}
                defaultPath={dirPath}
                withInput={true}
                onChoosePath={dirPath => this.changeValue({ dirPath })}
                inputValue={name}
                onChangeInput={name => this.changeValue({ name })}
                placeholder="Название подключения"
              />
            </div>
          )}
          <div className={b('row')}>
            <Caption text="OAuth-токен" />
            <div className={b('row-group')}>
              <InputField
                valueType={FIELD_TYPES.TOKEN}
                inputType={'password'}
                value={this.token}
                error={getErrorMessage(emptyFields, FIELD_TYPES.TOKEN)}
                widthSize={'m'}
                onChange={this.changeValue}
              />
              <GetMetricaTokenButton sdk={sdk} onChangeCallback={this.changeValue} />
            </div>
          </div>
          <div className={b('row')}>
            <Caption text="Счетчик" />
            <div className={b('row-group')}>
              {counterInputMethod === COUNTER_INPUT_METHODS.LIST ? (
                <SelectField
                  valueType={FIELD_TYPES.COUNTER}
                  items={counters}
                  value={counter}
                  error={getErrorMessage(emptyFields, FIELD_TYPES.COUNTER)}
                  widthSize={'m'}
                  disabled={!counters.length || (!isNewConnection && dbType === 'metrika_logs_api')}
                  onChange={dbType === 'metrika_logs_api' ? this.selectCounter : this.changeValue}
                />
              ) : (
                <InputField
                  valueType={FIELD_TYPES.COUNTER}
                  inputType={'number'}
                  value={counter}
                  error={getErrorMessage(emptyFields, FIELD_TYPES.COUNTER)}
                  widthSize={'m'}
                  placeholder="ID счетчика"
                  onChange={this.changeValue}
                />
              )}
              <LoaderField visible={isCountersFetching} />
              {Utils.isInternal() && (isNewConnection || dbType === 'metrika_api') && (
                <div className={b('counter-input-method-radio')}>
                  <RadioButton
                    theme="normal"
                    size="s"
                    view="default"
                    tone="default"
                    value={counterInputMethod}
                    onChange={e => this.changeValue({ counterInputMethod: e.target.value })}
                    freeWidth={true}
                  >
                    <RadioButton.Radio value={COUNTER_INPUT_METHODS.LIST}>Из списка</RadioButton.Radio>
                    <RadioButton.Radio value={COUNTER_INPUT_METHODS.MANUALLY}>Вручную</RadioButton.Radio>
                  </RadioButton>
                </div>
              )}
            </div>
          </div>
          {isNewConnection && (
            <div className={b('row')}>
              <Caption text="Подключение" />
              <RadioButton
                theme="normal"
                size="s"
                view="default"
                tone="default"
                value={dbType}
                onChange={this.onDbTypeRadioButtonChange}
                freeWidth={true}
              >
                <RadioButton.Radio value={'metrika_api'}>Прямой досту</RadioButton.Radio>
                <RadioButton.Radio value={'metrika_logs_api'}>Через Logs API</RadioButton.Radio>
              </RadioButton>
            </div>
          )}
          {isNewConnection && !Utils.isInternal() && dbType === 'metrika_api' && (
            <div className={b('row')}>
              <CheckBox
                theme="normal"
                size="n"
                view="default"
                tone="default"
                checked={isAutoCreateDashboard}
                onChange={this.toggleDashboardAutoCreation}
                text="Автоматически создать дашборд, чарты и датасет над подключением"
              />
            </div>
          )}
          {dbType === 'metrika_logs_api' && (
            <React.Fragment>
              <Caption text="Параметры выгрузки" section />
              <div className={b('row')}>
                <Caption text="Источник счетчика" />
                <SelectField
                  valueType={FIELD_TYPES.COUNTER_SOURCE}
                  items={getStaticSelectItems(['visits', 'hits'])}
                  value={counterSource}
                  widthSize={'m'}
                  disabled={!isNewConnection}
                  onChange={this.changeValue}
                />
              </div>
              <div className={b('row')}>
                <Caption text="Загружать с" />
                <div>
                  <Datepicker
                    scale="day"
                    inputWidth={240}
                    callback={({ from }) => this.changeValue({ materializationStartDate: from })}
                    minDate={counterCreationDate}
                    maxDate={MAX_DATE_STRING}
                    date={materializationStartDate}
                  />
                  <Caption
                    text="Дата начальной загрузки задается один раз при создании подключения"
                    fixedWidth={false}
                    comment
                  />
                </div>
              </div>
              <div className={b('row')}>
                <Caption text="Регулярность" />
                <RadioButton
                  theme="normal"
                  size="s"
                  view="default"
                  tone="default"
                  value={materializationRegularity}
                  onChange={e => {
                    const materializationRegularity = e.target.value;
                    this.changeValue({
                      materializationRegularity,
                      matSchedConfig: getMatSchedConfig({
                        materializationRegularity,
                        enabled: null,
                      }),
                    });
                  }}
                  freeWidth={true}
                >
                  <RadioButton.Radio value={'oneTime'}>Единовременная</RadioButton.Radio>
                  <RadioButton.Radio value={'regular'}>Регулярная</RadioButton.Radio>
                </RadioButton>
              </div>
              <Caption text="Целевая база данных" section />
              <div className={b('row')}>
                <Caption text="Имя хоста" />
                <InputField
                  valueType={FIELD_TYPES.HOST}
                  value={host}
                  error={getErrorMessage(emptyFields, FIELD_TYPES.HOST)}
                  onChange={this.changeValue}
                />
              </div>
              <div className={b('row')}>
                <Caption text="Порт" />
                <InputField
                  valueType={FIELD_TYPES.PORT}
                  inputType={'number'}
                  value={String(port)}
                  error={getErrorMessage(emptyFields, FIELD_TYPES.PORT)}
                  widthSize={'s'}
                  onChange={this.changeValue}
                  hasClear={false}
                />
              </div>
              <div className={b('row')}>
                <Caption text="Имя базы данных" />
                <InputField
                  valueType={FIELD_TYPES.DB_NAME}
                  value={dbName}
                  error={getErrorMessage(emptyFields, FIELD_TYPES.DB_NAME)}
                  onChange={this.changeValue}
                />
              </div>
              <div className={b('row')}>
                <Caption text="Имя пользователя" />
                <InputField
                  valueType={FIELD_TYPES.USERNAME}
                  value={username}
                  error={getErrorMessage(emptyFields, FIELD_TYPES.USERNAME)}
                  widthSize={'m'}
                  onChange={this.changeValue}
                />
              </div>
              <div className={b('row')}>
                <Caption text="Пароль" />
                <InputField
                  valueType={FIELD_TYPES.PASSWORD}
                  inputType={'password'}
                  value={this.password}
                  error={getErrorMessage(emptyFields, FIELD_TYPES.PASSWORD)}
                  widthSize={'m'}
                  onChange={this.changeValue}
                />
              </div>
              <div className={b('row')}>
                <VerifyButton
                  text="Проверить подключение"
                  verifyConnection={verifyConnection}
                  isVerifySuccess={isVerifySuccess}
                />
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default MetricaConnector;
