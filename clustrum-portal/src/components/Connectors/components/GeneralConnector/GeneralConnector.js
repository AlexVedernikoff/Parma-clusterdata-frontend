import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { RadioButton } from 'lego-on-react';
import { PathSelect } from '@kamatech-data-ui/clustrum';
import Title from '../../subcomponents/Title/Title';
import Caption from '../../subcomponents/Caption/Caption';
import InputField from '../../subcomponents/InputField/InputField';
import VerifyButton from '../../subcomponents/VerifyButton/VerifyButton';
import { getErrorMessage } from '../../utils';
import { FIELD_TYPES } from '../../../../constants';
import Utils from '../../../../helpers/utils';
import { getSearchParam } from '../../../../helpers/QueryParams';
import PageHead from '../../../PageHeader/PageHeader';

const b = block('dl-connector');

const SECTIONS = {
  SELECTION_DB: 'SELECTION_DB',
  SELECTION_DB_CONNECT_METHOD: 'SELECTION_DB_CONNECT_METHOD',
};

const MAX_POOL_SIZE = 16;

class GeneralConnector extends React.Component {
  static propTypes = {
    onChangeCallback: PropTypes.func.isRequired,
    verifyConnection: PropTypes.func.isRequired,
    sdk: PropTypes.object.isRequired,
    connectionState: PropTypes.object,
    dbType: PropTypes.string,
    emptyFields: PropTypes.array,
  };

  static defaultProps = {
    connectionState: {},
  };

  constructor(props) {
    super(props);

    const {
      id,
      secure,
      db_name: dbName,
      dbType,
      host,
      name,
      port,
      username,
      password,
      modifyFlag,
      maxPoolSize,
      key,
    } = this.props.connectionState;

    this.state = {
      id,
      secure,
      dbName: dbName || '',
      dbType: dbType || this.props.dbType,
      dbConnectMethod: 'service_name',
      dirPath: getSearchParam('currentPath') || Utils.getPersonalFolderPath(),
      name: name || '',
      host: host || '',
      port: port || '',
      username: username || '',
      password: password,
      isAccessedOnAll: '',
      modifyFlag: modifyFlag || 1,
      maxPoolSize: maxPoolSize,
      key: key,
    };
  }

  componentDidMount() {
    this.onChangeCallback();
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
      this.onChangeCallback,
    );
  };

  onChangeCallback = () => {
    const { onChangeCallback } = this.props;

    if (onChangeCallback) {
      onChangeCallback(this.state);
    }
  };

  isDisplaySection = ({ connectionType, section }) => {
    const { SELECTION_DB, SELECTION_DB_CONNECT_METHOD } = SECTIONS;

    let forbiddenSections = [SELECTION_DB_CONNECT_METHOD];

    switch (connectionType) {
      case 'clickhouse': {
        forbiddenSections.push(SELECTION_DB);

        break;
      }

      case 'oracle': {
        forbiddenSections = [];

        break;
      }
    }

    return !forbiddenSections.includes(section);
  };

  renderDbNameField() {
    const { emptyFields } = this.props;
    const { dbType, dbName, dbConnectMethod } = this.state;

    const isDisplayDbNameField = this.isDisplaySection({
      connectionType: dbType,
      section: SECTIONS.SELECTION_DB,
    });

    if (!isDisplayDbNameField) {
      return null;
    }

    let dbConnectMethodSelect = null;

    const isDisplayDbConnectMethod = this.isDisplaySection({
      connectionType: dbType,
      section: SECTIONS.SELECTION_DB_CONNECT_METHOD,
    });

    if (isDisplayDbConnectMethod) {
      dbConnectMethodSelect = (
        <div className={b('connect-method-radio')}>
          <RadioButton
            theme="normal"
            size="s"
            view="default"
            tone="default"
            value={dbConnectMethod}
            onChange={e => this.changeValue({ dbConnectMethod: e.target.value })}
            freeWidth={true}
          >
            <RadioButton.Radio value={'service_name'}>Имя сервиса</RadioButton.Radio>
            <RadioButton.Radio value={'sid'}>SID</RadioButton.Radio>
          </RadioButton>
        </div>
      );
    }

    return (
      <div className={b('row')}>
        <Caption text="Имя базы данных" />
        <div className={b('row-group')}>
          <InputField
            valueType={FIELD_TYPES.DB_NAME}
            value={dbName}
            error={getErrorMessage(emptyFields, FIELD_TYPES.DB_NAME)}
            onChange={this.changeValue}
            cls={dbType === 'oracle' ? 'db-name-oracle' : ''}
          />
          {dbConnectMethodSelect}
        </div>
      </div>
    );
  }

  render() {
    const { sdk, verifyConnection, isVerifySuccess, emptyFields } = this.props;
    const { id, name, dirPath, host, port, dbType, username, maxPoolSize, key } = this.state;

    const isNewConnection = !id;

    let labelPort = 'Порт';

    if (dbType === 'clickhouse') {
      labelPort = 'Порт HTTP-интерфейса';
    }

    return (
      <div className={b()}>
        <PageHead title={name} />
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
            <Caption text="Имя хоста" />
            <InputField
              valueType={FIELD_TYPES.HOST}
              value={host}
              error={getErrorMessage(emptyFields, FIELD_TYPES.HOST)}
              onChange={this.changeValue}
            />
          </div>
          <div className={b('row')}>
            <Caption text={labelPort} />
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

          {this.renderDbNameField()}

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
            <Caption text="Максимальный размер пула соединений" />
            <InputField
              valueType={FIELD_TYPES.MAX_POOL_SIZE}
              value={maxPoolSize}
              inputType={'number'}
              error={getErrorMessage(emptyFields, FIELD_TYPES.MAX_POOL_SIZE)}
              widthSize={'s'}
              onChange={this.changeValue}
              placeholder={MAX_POOL_SIZE.toString()}
            />
          </div>

          <div className={b('row')}>
            <VerifyButton
              text="Проверить подключение"
              verifyConnection={verifyConnection}
              isVerifySuccess={isVerifySuccess}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default GeneralConnector;
