import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Link } from 'lego-on-react';
import { PathSelect } from '@kamatech-data-ui/clustrum';
import Title from '../../subcomponents/Title/Title';
import Caption from '../../subcomponents/Caption/Caption';
import InputField from '../../subcomponents/InputField/InputField';
import SelectField from '../../subcomponents/SelectField/SelectField';
import HelpButton from '../../subcomponents/HelpButton/HelpButton';
import VerifyButton from '../../subcomponents/VerifyButton/VerifyButton';
import { getErrorMessage } from '../../utils';
import { FIELD_TYPES, getStaticSelectItems } from '../../../../constants';
import Utils from '../../../../helpers/utils';
import { getSearchParam } from '../../../../helpers/QueryParams';

const b = block('dl-connector');

const DEFAULT_DB_TYPE = 'ch_over_yt';
const DEFAULT_CLUSTER = 'hahn';

class ChOverYtConnector extends React.Component {
  static propTypes = {
    onChangeCallback: PropTypes.func.isRequired,
    verifyConnection: PropTypes.func.isRequired,
    sdk: PropTypes.object.isRequired,
    connectionState: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const { id, name, dbType, token, cluster, alias } = this.props.connectionState;

    this.state = {
      id,
      name,
      token,
      alias,
      dirPath: getSearchParam('currentPath') || Utils.getPersonalFolderPath(),
      dbType: dbType || DEFAULT_DB_TYPE,
      cluster: cluster || DEFAULT_CLUSTER,
    };
  }

  componentDidMount() {
    this.onChangeCallback();
  }

  get token() {
    const { token, id } = this.state;

    return id && token === undefined ? 'token' : token;
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

  render() {
    const { sdk, verifyConnection, isVerifySuccess, emptyFields } = this.props;
    const { id, name, dirPath, dbType, alias, cluster } = this.state;

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
            <Caption text="Токен YT" />
            <div className={b('row-group')}>
              <InputField
                valueType={FIELD_TYPES.TOKEN}
                inputType={'password'}
                value={this.token}
                error={getErrorMessage(emptyFields, FIELD_TYPES.TOKEN)}
                widthSize={'m'}
                onChange={this.changeValue}
              />
              <HelpButton title="Получение OAuth-токена для YT" url={'https://oauth.yt.yandex.net'} />
            </div>
          </div>
          <div className={b('row')}>
            <Caption text="Кластер" />
            <SelectField
              valueType={FIELD_TYPES.CLUSTER}
              items={getStaticSelectItems(['hahn', 'arnold'])}
              value={cluster}
              widthSize={'m'}
              onChange={this.changeValue}
            />
          </div>
          <div className={b('row')}>
            <Caption text="Клика" />
            <div>
              <InputField
                valueType={FIELD_TYPES.ALIAS}
                value={alias}
                error={getErrorMessage(emptyFields, FIELD_TYPES.ALIAS)}
                onChange={this.changeValue}
              />
              <div className={b('alias-info')}>
                <span>Указывается название запущенной клики, подробнее в</span>
                &nbsp;
                <Link theme="ghost" target="_blank" url="">
                  документации
                </Link>
              </div>
            </div>
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

export default ChOverYtConnector;
