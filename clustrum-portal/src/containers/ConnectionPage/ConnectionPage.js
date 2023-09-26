import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import _intersection from 'lodash/intersection';
import { ActionPanel, ErrorContent, ErrorDialog } from '@kamatech-data-ui/clustrum';
import { Types } from '@kamatech-data-ui/clustrum/src/components/ErrorContent/ErrorContent';
import { Loader } from '@kamatech-data-ui/common/src';
import GeneralConnector from '../../components/Connectors/components/GeneralConnector/GeneralConnector';
import ChOverYtConnector from '../../components/Connectors/components/ChOverYtConnector/ChOverYtConnector';
import CsvConnector from '../../components/Connectors/components/CsvConnector/CsvConnector';
import MetrikaLogsApiConnector from '../../components/Connectors/components/MetrikaLogsApiConnector/MetrikaLogsApiConnector';
import AppMetricaConnector from '../../components/Connectors/components/AppMetricaAPI/AppMetricaAPI';
import { TOAST_TYPES, getFakeEntry } from '../../constants';
import Utils from '../../helpers/utils';
import {
  createConnection,
  modifyConnection,
  verifyConnection,
  uploadCsv,
  saveCsv,
} from './actions';
import { getEmptyFields } from './validator';
import { getConnectorType } from './getConnectorType';
import { getNavigationPathFromKey } from '../../helpers/utils-dash';
import { normalizeDestination } from '@kamatech-data-ui/clustrum-core-plugins/utils';
import { Button } from 'antd';
import { NotificationContext } from '@entities/notification';
import { NotificationType } from '@shared/types/notification';

const b = block('connection-page');

const DEFAULT_PERMISSIONS_MODE = 'owner_only';

const getErrorTitle = () => ({
  createConnection: 'Не удалось создать подключение',
  modifyConnection: 'Не удалось сохранить подключение',
  verifyConnection: 'Не удалось проверить параметры подключения',
  uploadCsv: 'Не удалось загрузить csv-файл',
  saveCsv: 'Не удалось сохранить csv-файл',
});

const getSuccessTitle = () => ({
  createConnection: 'Подключение создано',
  modifyConnection: 'Подключение сохранено',
});

const _getConnectorComponent = connectorType => {
  switch (connectorType) {
    case 'ch_over_yt':
      return ChOverYtConnector;
    case 'csv':
      return CsvConnector;
    case 'metrika_logs_api':
    case 'metrika_api':
    case 'metrica':
      return MetrikaLogsApiConnector;
    case 'appmetrica_api':
      return AppMetricaConnector;
    default:
      return GeneralConnector;
  }
};

class ConnectionPage extends React.Component {
  static getDatasetCreateButton(connectionId, currentPath) {
    return (
      <Button
        key={'create-dataset-btn'}
        text="Создать набор данных"
        onClick={() => {
          let currentPathParam = currentPath
            ? `&currentPath=${encodeURIComponent(currentPath)}`
            : '';
          window.open(`/datasets/new?id=${connectionId}${currentPathParam}`, '_self');
        }}
      >
        Создать набор данных
      </Button>
    );
  }

  static propTypes = {
    sdk: PropTypes.object.isRequired,
  };
  static contextType = NotificationContext;
  constructor(props) {
    super(props);

    this.errorDialogRef = React.createRef();

    this.state = {
      connectionState: {},
      permissionsMode: DEFAULT_PERMISSIONS_MODE,
      emptyFields: [],
      redirect: undefined,
      fetchError: undefined,
      toastError: undefined,
      isVerifySuccess: undefined,
      isActionProgress: false,
      isStateChanged: false,
      isChangesSaved: true,
    };
  }

  async componentDidMount() {
    const { sdk } = this.props;
    const {
      params: { connectionId },
    } = this.props.match;

    if (!connectionId) {
      return;
    }

    try {
      const connectionState = await sdk.bi.getConnection({ connectionId });
      const { db_type: dbType } = connectionState;

      this.setState({
        connectionState: {
          ...connectionState,
          dbType,
        },
        fetchError: undefined,
      });
    } catch (error) {
      this.setState({ fetchError: error });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      params: { connectionId },
    } = this.props.match;

    // для редактирования csv кнопка Сохранить всегда задизейблена
    if (!connectionId || this._getConnectorType() === 'csv') {
      return;
    }

    const isStateChanged = prevState.connectionState !== this.state.connectionState;

    // не меняем isStateChanged если есть пустые обязательные поля
    if (isStateChanged !== prevState.isStateChanged && !this.state.emptyFields.length) {
      this.setState({ isStateChanged });
    }
  }

  onConnectionStateChange = (connectionState, cb) => {
    let emptyFields = [];

    if (this.state.emptyFields.length) {
      emptyFields = _intersection(
        this.state.emptyFields,
        getEmptyFields(connectionState),
      );
    }

    this.setState(
      {
        connectionState,
        emptyFields,
        isChangesSaved: false,
      },
      () => cb && cb(),
    );
  };

  onCreateConnection = async () => {
    const { sdk } = this.props;
    const { permissionsMode, connectionState } = this.state;

    const emptyFields = getEmptyFields(connectionState);

    if (emptyFields.length) {
      return this.setState({ emptyFields });
    }

    this.setState({
      toastError: undefined,
      isActionProgress: true,
    });

    try {
      const { id: connectionId } = await createConnection({
        sdk,
        permissionsMode,
        connectionState,
      });

      if (this._isAutoCreateDashboardNeeded()) {
        const { entryId } = await sdk.copyTemplate({
          connectionId,
          templateName: connectionState.dbType,
        });

        window.open(`/navigation/${entryId}`, '_self');
      } else {
        this.showNotification({
          name: TOAST_TYPES.CREATE_CONNECTION,
          type: NotificationType.Success,
          content: (
            <div className={b('create-dataset-btn-wrap')}>
              {ConnectionPage.getDatasetCreateButton(
                connectionId,
                connectionState.dirPath,
              )}
            </div>
          ),
        });

        this.setState({ redirect: `/connections/${connectionId}` });
      }
    } catch (error) {
      this.showNotification({
        name: TOAST_TYPES.CREATE_CONNECTION,
        type: NotificationType.Error,
      });

      this.setState({
        toastError: {
          ...Utils.getNormalizedError(error),
          type: TOAST_TYPES.CREATE_CONNECTION,
        },
        isActionProgress: false,
      });
    }
  };

  onModifyConnection = async () => {
    const { sdk } = this.props;
    const { connectionState } = this.state;

    const emptyFields = getEmptyFields(connectionState);

    if (emptyFields.length) {
      return this.setState({ emptyFields });
    }

    this.setState({
      toastError: undefined,
      isActionProgress: true,
    });

    try {
      const modifiedConnection = await modifyConnection({
        sdk,
        connectionState,
      });

      this.showNotification({
        name: TOAST_TYPES.MODIFY_CONNECTION,
        type: NotificationType.Success,
        allowAutoHiding: true,
      });

      this.setState({
        isActionProgress: false,
        isChangesSaved: true,
      });

      const { modifyFlag: modifyFlag } = modifiedConnection;
      connectionState.modifyFlag = modifyFlag;
      const { db_type: dbType } = modifiedConnection;

      this.setState({
        modifyFlag: modifyFlag,
        dbType: dbType,
      });
    } catch (error) {
      this.showNotification({
        name: TOAST_TYPES.MODIFY_CONNECTION,
        type: NotificationType.Error,
      });

      this.setState({
        toastError: {
          ...Utils.getNormalizedError(error),
          type: TOAST_TYPES.MODIFY_CONNECTION,
        },
        isActionProgress: false,
      });
    }
  };

  onVerifyConnection = async () => {
    const { sdk } = this.props;
    const { permissionsMode, connectionState } = this.state;

    this.setState({ isVerifySuccess: undefined });

    try {
      await verifyConnection({
        sdk,
        permissionsMode,
        connectionState,
      });

      this.setState({ isVerifySuccess: true });
    } catch (error) {
      this.showNotification({
        name: TOAST_TYPES.VERIFY_CONNECTION,
        type: NotificationType.Error,
      });

      this.setState({
        toastError: {
          ...Utils.getNormalizedError(error),
          type: TOAST_TYPES.VERIFY_CONNECTION,
        },
        isVerifySuccess: false,
      });
    }
  };

  onUploadCsv = async () => {
    const {
      sdk,
      location: { search },
    } = this.props;
    const { connectionState } = this.state;

    this.setState({
      toastError: undefined,
      isActionProgress: true,
    });

    try {
      const { entryId } = await uploadCsv({
        sdk,
        connectionState,
      });

      this.setState({ redirect: `/connections/${entryId}${search ? search : ''}` });
    } catch (error) {
      this.showNotification({
        name: TOAST_TYPES.UPLOAD_CSV,
        type: NotificationType.Error,
      });

      this.setState({
        toastError: {
          ...Utils.getNormalizedError(error),
          type: TOAST_TYPES.UPLOAD_CSV,
        },
        isActionProgress: false,
      });
    }
  };

  onSaveCsv = async () => {
    const { sdk } = this.props;
    const { connectionState, permissionsMode } = this.state;

    const emptyFields = getEmptyFields(connectionState);

    if (emptyFields.length) {
      return this.setState({ emptyFields });
    }

    this.setState({
      toastError: undefined,
      isActionProgress: true,
    });

    try {
      const { meta, entryId } = await saveCsv({
        sdk,
        permissionsMode,
        connectionState,
      });

      this.showNotification({
        name: TOAST_TYPES.CREATE_CONNECTION,
        type: 'success',
        content: (
          <div className={b('create-dataset-btn-wrap')}>
            {ConnectionPage.getDatasetCreateButton(entryId, connectionState.dirPath)}
          </div>
        ),
      });

      this.setState({
        connectionState: {
          ...connectionState,
          meta: meta,
        },
        viewStepId: CsvConnector.VIEW_STEPS.CSV_SETTING_AFTER_SAVE,
        isActionProgress: false,
      });
    } catch (error) {
      this.showNotification({ name: TOAST_TYPES.SAVE_CSV, type: NotificationType.Error });

      this.setState({
        toastError: {
          ...Utils.getNormalizedError(error),
          type: TOAST_TYPES.SAVE_CSV,
        },
        isActionProgress: false,
      });
    }
  };

  _isAutoCreateDashboardNeeded() {
    const { connectionState: { dbType, isAutoCreateDashboard } = {} } = this.state;

    return (
      isAutoCreateDashboard &&
      ['metrika_api', 'metrika_logs_api'].includes(dbType) &&
      !Utils.isInternal()
    );
  }

  showNotification({ name, type, content, allowAutoHiding = false }) {
    const actions = [];
    const duration = allowAutoHiding ? 6 : 0;
    let message;

    if (type === 'error') {
      message = getErrorTitle()[name];
      actions.push({
        label: 'Подробнее',
        onClick: this.errorDialogRef.current.open,
      });
    } else {
      message = getSuccessTitle()[name];
    }

    this.context({
      message: message,
      key: name,
      description: content,
      type,
      actions,
      duration,
    });
  }

  _getErrorMessageByCode = ({ status, data = {} }) => {
    const { message: code } = data;

    switch (status) {
      case 400:
        switch (code) {
          case 'NO_CONNECTION':
            return {
              type: 'error',
              title: 'Отсутствует подключение',
            };
          default:
            return {
              type: 'error',
              title: 'Некорректный запрос к подключению',
              description: '',
            };
        }
      case 403:
      case Types.NO_ACCESS:
        return {
          type: 'not-found',
          title: 'У вас нет доступа к подключению',
        };
      case 404:
      case Types.NOT_FOUND:
        return {
          type: 'not-found',
          title: 'Подключение не найдено',
        };
      case 500:
      case Types.ERROR:
      default:
        return {
          type: 'error',
          title: 'Не удалось загрузить подключение',
          description: '',
        };
    }
  };

  _getConnectorType() {
    const connectorType = getConnectorType(this.props.location.search);
    const { connectionState: { dbType } = {} } = this.state;

    return connectorType || dbType;
  }

  _getActionHandler() {
    const {
      params: { connectionId },
    } = this.props.match;

    const { connectionState } = this.state;

    const connectorType = this._getConnectorType();

    if (connectorType === 'csv') {
      return connectionId ? this.onSaveCsv : this.onUploadCsv;
    }

    return connectionId ? this.onModifyConnection : this.onCreateConnection;
  }

  _renderActionPanel() {
    const { sdk, history } = this.props;
    const {
      params: { connectionId },
    } = this.props.match;
    const {
      connectionState,
      isActionProgress,
      isStateChanged,
      isChangesSaved,
    } = this.state;

    const connectorType = this._getConnectorType();
    const isCsv = connectorType === 'csv';

    // не показываем панель пока не подъедет entry из csv коннекшена
    if (isCsv && connectionId && !connectionState.entry) {
      return null;
    }

    const actionButtonVisible = connectionId ? true : !isCsv;

    let permissionsSelectVisible = connectionId ? isCsv : !isCsv;
    let entry;
    let entryId = connectionId;

    if (isCsv && connectionState.meta) {
      const isUnvalidated = connectionState.meta.state === 'unvalidated';
      entry = isUnvalidated ? null : connectionState.entry;
      entryId = null;
      permissionsSelectVisible = connectionId ? isUnvalidated : false;
    }

    const actionButton = actionButtonVisible && (
      <Button
        key={'action-btn'}
        type="primary"
        onClick={this._getActionHandler()}
        disabled={!permissionsSelectVisible && !isStateChanged && isChangesSaved}
      >
        {connectionId && !permissionsSelectVisible
          ? !isStateChanged && isChangesSaved && !isActionProgress
            ? 'Сохранено'
            : 'Сохранить'
          : 'Создать подключение'}
      </Button>
    );

    const currentDirPath =
      connectionState.key &&
      normalizeDestination(getNavigationPathFromKey(connectionState.key));

    const createDatasetButton =
      connectionId &&
      !permissionsSelectVisible &&
      ConnectionPage.getDatasetCreateButton(connectionId, currentDirPath);

    const cancelButton = (
      <Button key="cancel-btn" type="default" onClick={() => history.goBack()}>
        {Boolean(this.state.connectionState?.id) ? 'Закрыть' : 'Отменить'}
      </Button>
    );

    return (
      <ActionPanel
        sdk={sdk}
        entry={entry ? entry : entryId ? null : getFakeEntry('connection')}
        entryId={entryId}
        rightItems={[cancelButton, createDatasetButton, actionButton]}
      />
    );
  }

  _renderErrorContent() {
    const { sdk } = this.props;
    const { fetchError } = this.state;
    const {
      response: {
        status,
        data: { data } = {},
        headers: { 'x-request-id': reqId } = {},
      } = {},
    } = fetchError;
    const { type, title, description, action } = this._getErrorMessageByCode({
      status,
      data,
    });

    return (
      <ErrorContent
        sdk={sdk}
        type={type}
        title={title}
        description={description}
        reqId={reqId}
        action={action}
      />
    );
  }

  _renderErrorDialog() {
    const { toastError: { type, message, requestId } = {} } = this.state;

    return (
      <ErrorDialog
        ref={this.errorDialogRef}
        title={getErrorTitle()[type] || 'Ошибка'}
        requestId={requestId}
        message={message}
      />
    );
  }

  _renderConnector() {
    const {
      sdk,
      match: {
        params: { connectionId },
      },
    } = this.props;
    const {
      connectionState = {},
      emptyFields,
      isVerifySuccess,
      isActionProgress,
    } = this.state;

    const connectorType = this._getConnectorType();
    const Connector = _getConnectorComponent(connectorType);
    let viewStepId = this.state.viewStepId;

    if (!viewStepId) {
      const { CSV_SETTING, CSV_LOADING } = CsvConnector.VIEW_STEPS;
      viewStepId = connectionId ? CSV_SETTING : CSV_LOADING;
    }

    return (
      <Connector
        sdk={sdk}
        connectionId={connectionId}
        connectionState={connectionState}
        dbType={connectorType}
        emptyFields={emptyFields}
        isVerifySuccess={isVerifySuccess}
        isFileUploading={isActionProgress}
        onChangeCallback={this.onConnectionStateChange}
        verifyConnection={this.onVerifyConnection}
        uploadCsv={this.onUploadCsv}
        viewStepId={viewStepId}
      />
    );
  }

  render() {
    const { redirect, fetchError } = this.state;

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    if (fetchError) {
      return this._renderErrorContent();
    }

    const connectorType = this._getConnectorType();

    if (!connectorType) {
      return (
        <div className={b('loader')}>
          <Loader size={'l'} />
        </div>
      );
    }

    return (
      <div className={b()}>
        {this._renderActionPanel()}
        {this._renderConnector()}
        {this._renderErrorDialog()}
      </div>
    );
  }
}

export default withRouter(ConnectionPage);
