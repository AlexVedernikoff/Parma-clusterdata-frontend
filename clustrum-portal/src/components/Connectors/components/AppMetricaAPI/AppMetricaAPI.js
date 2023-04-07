import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import _debounce from 'lodash/debounce';
import { RadioButton } from 'lego-on-react';
import { I18n, PathSelect } from '@kamatech-data-ui/clustrum';
import Title from '../../subcomponents/Title/Title';
import Caption from '../../subcomponents/Caption/Caption';
import InputField from '../../subcomponents/InputField/InputField';
import SelectField from '../../subcomponents/SelectField/SelectField';
import LoaderField from '../../subcomponents/LoaderField/LoaderField';
import GetMetricaTokenButton from '../../subcomponents/GetMetricaTokenButton/GetMetricaTokenButton';
import { getErrorMessage, getCounterSelectItems } from '../../utils';
import { FIELD_TYPES, COUNTER_INPUT_METHODS, METRIKA_TOKEN_FAKE_VALUE } from '../../../../constants';
import Utils from '../../../../helpers/utils';
import { getSearchParam } from '../../../../helpers/QueryParams';

const b = block('dl-connector');
const i18n = I18n.keyset('connections.form');
const DEFAULT_DB_TYPE = 'appmetrica_api';

class AppMetricaConnector extends React.Component {
  static propTypes = {
    onChangeCallback: PropTypes.func.isRequired,
    sdk: PropTypes.object.isRequired,
    connectionState: PropTypes.object,
    emptyFields: PropTypes.array,
  };

  static defaultProps = {
    connectionState: {},
  };

  constructor(props) {
    super(props);

    const { id, name, token, dbType, counter_id: counter } = this.props.connectionState;

    this.state = {
      id,
      name,
      dirPath: getSearchParam('currentPath') || Utils.getPersonalFolderPath(),
      token,
      dbType: dbType || DEFAULT_DB_TYPE,
      counter,
      counters: counter ? [{ key: counter, value: String(counter), title: counter }] : [],
      counterInputMethod: COUNTER_INPUT_METHODS.LIST,
      isApplicationsFetching: false,
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

    if (onChangeCallback) {
      onChangeCallback(this.state);
    }

    if (data && data.hasOwnProperty('token')) {
      if (this.debounced) {
        this.debounced.cancel();
      }

      this.debounced = _debounce(this.getApplications, 500);
      this.debounced(data.token);
    }
  };

  getApplications = async token => {
    const { sdk } = this.props;

    try {
      this.changeValue({ isApplicationsFetching: true });
      const data = await sdk.getAppMetricaApplications({ token });
      const counters = getCounterSelectItems(data.applications);

      this.changeValue({
        counters,
        isApplicationsFetching: false,
      });
    } catch (error) {
      this.changeValue({
        counters: [],
        counter: undefined,
        isApplicationsFetching: false,
      });
    }
  };

  render() {
    const { sdk, emptyFields } = this.props;
    const { id, name, dirPath, dbType, counters, counter, counterInputMethod, isApplicationsFetching } = this.state;

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
                placeholder={i18n('field_connection-title')}
              />
            </div>
          )}
          <div className={b('row')}>
            <Caption text={i18n('field_token-metrika')} />
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
            <Caption text={i18n('field_application')} />
            <div className={b('row-group')}>
              {counterInputMethod === COUNTER_INPUT_METHODS.LIST ? (
                <SelectField
                  valueType={FIELD_TYPES.COUNTER}
                  items={counters}
                  value={counter}
                  error={getErrorMessage(emptyFields, FIELD_TYPES.COUNTER)}
                  widthSize={'m'}
                  disabled={!counters.length}
                  onChange={this.changeValue}
                />
              ) : (
                <InputField
                  valueType={FIELD_TYPES.COUNTER}
                  inputType={'number'}
                  value={counter}
                  error={getErrorMessage(emptyFields, FIELD_TYPES.COUNTER)}
                  widthSize={'m'}
                  placeholder={i18n('label_placeholder-appmetrica-id')}
                  onChange={this.changeValue}
                />
              )}
              <LoaderField visible={isApplicationsFetching} />
              {Utils.isInternal() && (
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
                    <RadioButton.Radio value={COUNTER_INPUT_METHODS.LIST}>
                      {i18n('value_metrica-counter-input-method-list')}
                    </RadioButton.Radio>
                    <RadioButton.Radio value={COUNTER_INPUT_METHODS.MANUALLY}>
                      {i18n('value_metrica-counter-input-method-manually')}
                    </RadioButton.Radio>
                  </RadioButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AppMetricaConnector;
