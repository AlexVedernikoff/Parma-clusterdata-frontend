import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Button } from 'lego-on-react';
import { ActionPanel, ErrorContent, ErrorDialog } from '@kamatech-data-ui/clustrum';
import { Types } from '@kamatech-data-ui/clustrum/src/components/ErrorContent/ErrorContent';
import ConnectionSelection from '../ConnectionSelection/ConnectionSelection';
import { TOAST_TYPES, REPLACE_SOURCE_MODE_ID } from '../../constants';
import Utils from '../../helpers/utils';
import { getSearchParam } from '../../helpers/QueryParams';
import { $appSettingsStore } from '@entities/app-settings';
import { NotificationContext, NotificationType } from '@entities/notification';

const b = block('dataset-creation-page');

const getErrorTitle = () => ({
  createDataset: 'Ошибка: не удалось создать датасет',
});

class DatasetCreationPage extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    modeId: PropTypes.oneOf([REPLACE_SOURCE_MODE_ID]),
  };

  static contextType = NotificationContext;

  state = {
    fetchError: undefined,
    toastError: undefined,
    redirect: undefined,
    connections: [],
    selectedConnection: {},
    isLoadingConnection: false,
  };

  async componentDidMount() {
    this.props.history.listen(this.onChangeHistory);

    const connectionId = getSearchParam('id');

    if (connectionId) {
      await this._fetchConnection(connectionId);
    }
  }

  errorDialogRef = React.createRef();

  async _fetchConnection(connectionId) {
    const { sdk } = this.props;

    this.setState({
      fetchError: undefined,
      isLoadingConnection: true,
    });

    try {
      const {
        db_type: connectionType,
        name: connectionName,
        cluster,
      } = await sdk.bi.getConnection({
        connectionId,
      });

      this.setState({
        selectedConnection: {
          ...this.state.selectedConnection,
          connectionId,
          connectionType,
          connectionName,
          cluster,
        },
        isLoadingConnection: false,
      });
    } catch (error) {
      this.setState({
        fetchError: error,
        isLoadingConnection: false,
      });
    }
  }

  createDataset = async () => {
    const { sdk } = this.props;
    const {
      selectedConnection: {
        connectionId,
        connectionType,
        counterSource,
        metricaNamespace,
        entityId,
        ytId,
        datasetTitle,
        dirPath,
        selectedDatabase,
        selectedTable,
      } = {},
    } = this.state;

    if (!datasetTitle) {
      return this.setState({
        pathSelectInputError: true,
      });
    }

    this.setState({
      toastError: undefined,
      isActionProgress: true,
    });

    const data = Utils.getDatasetCreationData({
      connectionId,
      connectionType,
      counterSource,
      metricaNamespace,
      entityId,
      ytId,
      datasetName: datasetTitle,
      dirPath,
      selectedDatabase,
      selectedTable,
    });

    try {
      const { id } = await sdk.bi.createDataSet(data);

      this.setState({ redirect: `/datasets/${id}` });
    } catch (error) {
      this.showNotification({
        name: TOAST_TYPES.CREATE_DATASET,
        type: NotificationType.Error,
      });

      this.setState({
        toastError: {
          ...Utils.getNormalizedError(error),
          type: 'createDataset',
        },
        isActionProgress: false,
      });
    }
  };

  getModifyDatasetSourceConfig = (datasetId, componentState = {}) => {
    const {
      connectionType,
      connectionId,
      selectedDatabase,
      selectedTable,
      counterSource,
      ytId,
    } = componentState;
    let tableName, dbName;

    switch (connectionType) {
      case 'metrika_logs_api':
      case 'metrika_api':
        dbName = counterSource;
        break;
      case 'ch_over_yt':
      case 'yt':
        tableName = ytId;
        break;
      default:
        dbName = selectedDatabase;
        tableName = selectedTable;
        break;
    }

    return {
      datasetId,
      connectionId,
      dbName,
      tableName,
    };
  };

  replaceSource = async () => {
    try {
      this.setState({
        error: null,
        isActionProgress: true,
      });
      const { sdk, datasetId } = this.props;
      const { selectedConnection } = this.state;

      const modifyDatasetSourceConfig = this.getModifyDatasetSourceConfig(
        datasetId,
        selectedConnection,
      );

      await sdk.bi.modifyDatasetSource(modifyDatasetSourceConfig);

      this.setState({
        isActionProgress: false,
      });

      const parent = window.parent;

      if (parent.opener && !parent.opener.closed) {
        parent.opener.location.reload(true);
      }

      window.close();
    } catch (error) {
      this.setState({
        errorType: 'replaceSource',
        error,
        isActionProgress: false,
      });
    }
  };

  onChangeHistory = async () => {
    const connectionId = getSearchParam('id');

    if (connectionId) {
      await this._fetchConnection(connectionId);
    } else {
      this.setState({
        selectedConnection: {
          connectionId: undefined,
        },
      });
    }
  };

  onChangeConnectionCallback = selectedConnection => {
    let { pathSelectInputError } = this.state;

    if (pathSelectInputError) {
      const { datasetTitle } = selectedConnection;

      pathSelectInputError = !datasetTitle;
    }

    this.setState({
      selectedConnection,
      pathSelectInputError,
    });
  };

  onEntryClick = async (entry, closeNavModal) => {
    const { history, modeId, datasetId } = this.props;
    const { entryId, scope } = entry;

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('id', entryId);
    const search = searchParams.toString();

    if (modeId === REPLACE_SOURCE_MODE_ID && scope === 'connection') {
      history.push(`/datasets/source?${search}`);
      closeNavModal();
      await this._fetchConnection(entryId);
    } else if (scope === 'connection') {
      history.push(`/datasets/new?${search}`);
      closeNavModal();
      await this._fetchConnection(entryId);
    }
  };

  _getErrorMessageByCode = ({ status, data = {} }) => {
    const { message: code } = data;

    switch (status) {
      case 400:
        switch (code) {
          case 'NO_CONNECTION':
            return {
              type: 'error',
              title: 'Ошибка: отсутствует подключение',
            };
          default:
            return {
              type: 'error',
              title: 'Ошибка: некорректный запрос к подключению',
              description: '',
            };
        }
      case 403:
      case Types.NO_ACCESS:
        return {
          type: 'not-found',
          title: 'У вас нет доступа к подключению',
          action: {
            content: null,
          },
        };
      case 404:
      case Types.NOT_FOUND:
        return {
          type: 'not-found',
          title: 'Ошибка: подключение не найдено',
          action: {
            content: null,
          },
        };
      case 500:
      case Types.ERROR:
      default:
        return {
          type: 'error',
          title: 'Ошибка: не удалось загрузить подключение',
          description: '',
          action: {
            content: null,
          },
        };
    }
  };

  showNotification({ name, type }) {
    this.context({
      message: getErrorTitle()[name],
      key: name,
      type,
      actions: [
        {
          label: 'Подробнее',
          onClick: this.errorDialogRef.current.open,
        },
      ],
    });
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

  getFakeEntry = ({ section }) => {
    const {
      user: { login },
    } = $appSettingsStore.getState();

    const sectionType = {
      'select-db-and-table': 'Выберите базу данных и таблицу:',
      'creation-dataset': 'Создание набора данных',
      'change-source': 'Изменение подключения',
    };

    return {
      fake: true,
      key: $appSettingsStore.getState().user.login
        ? `/Users/${login}/${sectionType[section]}`
        : `/${sectionType[section]}`,
      entryId: null,
    };
  };

  render() {
    const { sdk, modeId } = this.props;
    const {
      selectedConnection,
      selectedConnection: { connectionId } = {},
      connections,
      fetchError,
      pathSelectInputError,
      redirect,
      isLoadingConnection,
      isActionProgress,
      toastError: { type, message, requestId } = {},
    } = this.state;

    if (redirect) {
      return (
        <Redirect
          push
          to={{
            pathname: redirect,
            state: {
              datasetName: this.state.selectedConnection.datasetTitle,
            },
          }}
        />
      );
    }

    if (fetchError) {
      return this._renderErrorContent();
    }

    const isReplaceSourceMode = modeId === REPLACE_SOURCE_MODE_ID;

    const fakeEntry = this.getFakeEntry({
      section: isReplaceSourceMode ? 'change-source' : 'creation-dataset',
    });

    return (
      <div className={b()}>
        <ActionPanel
          sdk={sdk}
          entry={fakeEntry}
          additionalEntryItems={[]}
          rightItems={[
            isReplaceSourceMode ? (
              <Button
                disabled={!connectionId}
                key={'action-btn'}
                cls={b('action-btn')}
                theme="action"
                size="n"
                view="default"
                tone="default"
                text="Сохранить"
                onClick={this.replaceSource}
                progress={isActionProgress}
              />
            ) : (
              connectionId && (
                <Button
                  key={'action-btn'}
                  cls={b('action-btn')}
                  theme="action"
                  size="n"
                  view="default"
                  tone="default"
                  text="Создать набор данных"
                  onClick={this.createDataset}
                  progress={isActionProgress}
                />
              )
            ),
          ]}
        />
        <ConnectionSelection
          sdk={sdk}
          modeId={modeId}
          isLoadingConnection={isLoadingConnection}
          connections={connections}
          selectedConnection={selectedConnection}
          pathSelectInputError={pathSelectInputError}
          onChangeConnectionCallback={this.onChangeConnectionCallback}
          onEntryClick={this.onEntryClick}
        />
        <ErrorDialog
          ref={this.errorDialogRef}
          title={getErrorTitle()[type] || 'Ошибка'}
          requestId={requestId}
          message={message}
        />
      </div>
    );
  }
}

export default DatasetCreationPage;
