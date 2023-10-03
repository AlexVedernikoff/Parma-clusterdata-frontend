import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Dialog, Loader } from '@kamatech-data-ui/common/src';
import { RadioBox } from 'lego-on-react';
import { ErrorDialog } from '@kamatech-data-ui/clustrum';

import { REPLACE_SOURCE_MODE_ID } from '../../constants';
import {
  ConnectionInfo,
  DataSourceButton,
  MaterializationScheduler,
  Status,
} from './components';
import ErrorView from '../ErrorView/ErrorView';
import { Stage } from './Stage';
import MaterializationSettings from './components/MaterializationCustomSettings/MaterializationSettings';
import Utils from '../../helpers/utils';
import {
  NotificationContext,
  NotificationType,
} from '@clustrum-lib/shared/lib/notification';

// import './DataSource.scss';

const b = block('data-source');
const DISABLE_DIRECT_MODE_FOR_TYPES = ['csv', 'yt'];
const DISABLE_TYPES = ['csv', 'metrika_logs_api', 'metrika_api', 'appmetrica_api'];
const DATASET_MODES = {
  DIRECT: 'direct',
  MATERIALIZED: 'materialized',
  MATERIALIZED_BY_PERIOD: 'materialized_by_period',
};

function SelectionMaterializationType(props) {
  const {
    selectedDsMode,
    changeMaterializationType,
    disableChangeMaterialization,
    disabledDirectMode,
    scheduleSettings,
    changeScheduleSettings,
  } = props;

  return (
    <div className={b('section')}>
      <div className={b('caption', b('margin', { bottom: 5 }))}>
        <span>Материализация</span>
      </div>
      <RadioBox
        disabled={disableChangeMaterialization}
        cls={b('materialization-type-selection')}
        view="default"
        theme="normal"
        size="m"
        name="materialization"
        value={selectedDsMode}
        onChange={changeMaterializationType}
      >
        <RadioBox.Radio value={DATASET_MODES.DIRECT} disabled={disabledDirectMode}>
          Прямой доступ
        </RadioBox.Radio>
        <RadioBox.Radio value={DATASET_MODES.MATERIALIZED}>
          Единовременная материализация
        </RadioBox.Radio>
        <RadioBox.Radio value={DATASET_MODES.MATERIALIZED_BY_PERIOD}>
          Периодическая материализация
        </RadioBox.Radio>
      </RadioBox>
      {selectedDsMode === DATASET_MODES.MATERIALIZED_BY_PERIOD && (
        <MaterializationScheduler
          changeScheduleSettings={changeScheduleSettings}
          scheduleSettings={scheduleSettings}
        />
      )}
    </div>
  );
}

function SelectionMaterializationSettingsType(props) {
  const {
    selectedDsMode,
    materializationCustomSettings,
    changeMaterializationCustomSettings,
    onEntryClick,
    sdk,
  } = props;

  return (
    selectedDsMode === DATASET_MODES.MATERIALIZED && (
      <MaterializationSettings
        changeMaterializationCustomSettings={changeMaterializationCustomSettings}
        materializationCustomSettings={materializationCustomSettings}
        onEntryClick={onEntryClick}
        sdk={sdk}
      />
    )
  );
}

function StatusPanel(props) {
  const { isDirectDsMode, status } = props;

  return (
    <div className={b('section', b('margin', { bottom: 22 }))}>
      <div className={b('caption', b('margin', { bottom: 5 }))}>
        <span>Статус</span>
      </div>
      <div className={b('last-status', b('text-inactive'))}>
        <Status isDirectDsMode={isDirectDsMode} status={status} />
      </div>
    </div>
  );
}

function LeftColumn(props) {
  return (
    <div className={b('column-left')}>
      <SelectionMaterializationType {...props} />
      <SelectionMaterializationSettingsType {...props} />
    </div>
  );
}

function RightColumn(props) {
  const {
    selectedDsMode,
    dsMode,
    isMaterializationDeleting,
    materializationStatus,
    connectionType,
    deleteMaterialization,
    disableMaterializeDatasetBtn,
    isMaterializationRun,
    materializeDataset,
  } = props;

  let isAllowedMaterialization = true;
  let isAllowedDeleteMaterialization = true;

  if (
    materializationStatus.isProcessing ||
    connectionType === 'csv' ||
    (selectedDsMode !== DATASET_MODES.MATERIALIZED &&
      selectedDsMode !== DATASET_MODES.MATERIALIZED_BY_PERIOD)
  ) {
    isAllowedMaterialization = false;
  }

  if (
    selectedDsMode !== DATASET_MODES.MATERIALIZED &&
    selectedDsMode !== DATASET_MODES.MATERIALIZED_BY_PERIOD
  ) {
    isAllowedDeleteMaterialization = false;
  }

  const isDirectDsMode = dsMode === 'DIRECT';

  return (
    <div className={b('column-right')}>
      {(selectedDsMode === DATASET_MODES.MATERIALIZED ||
        selectedDsMode === DATASET_MODES.MATERIALIZED_BY_PERIOD) &&
        materializationStatus.stage && (
          <StatusPanel status={materializationStatus} isDirectDsMode={isDirectDsMode} />
        )}
      {isAllowedMaterialization && (
        <div className={b('section', b('margin', { bottom: 22 }))}>
          <DataSourceButton
            disabled={disableMaterializeDatasetBtn}
            label="Следующая загрузка"
            cls={b('run-btn')}
            text="Загрузить сейчас"
            isLoading={isMaterializationRun}
            onClick={materializeDataset}
          />
        </div>
      )}
      {isAllowedDeleteMaterialization && (
        <div className={b('section')}>
          <DataSourceButton
            cls={b('delete-btn')}
            text="Удалить материализацию"
            isLoading={isMaterializationDeleting}
            onClick={deleteMaterialization}
          />
        </div>
      )}
    </div>
  );
}

class DataSource extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    datasetId: PropTypes.string.isRequired,
    sdk: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    progress: PropTypes.bool,
    isProcessingSource: PropTypes.bool,
    onClickConnectionMenuItem: PropTypes.func,
    errorType: PropTypes.string,
    error: PropTypes.object,
  };

  static contextType = NotificationContext;
  openNotification = this.context;

  static getDerivedStateFromProps(props) {
    const { error, errorType, progress } = props;

    if (errorType) {
      return {
        showError: true,
        progress,
        errorType,
        error,
      };
    }

    return {
      progress,
    };
  }

  state = {
    isLoading: true,
    isMaterializationDeleting: false,
    isMaterializationRun: false,
    showError: false,
    progress: false,
    selectedDsMode: undefined,
    dataset: undefined,
    datasetStatus: undefined,
    store: undefined,
    error: null,
    errorMessage: null,
    materializationStatus: undefined,
    scheduleSettings: {
      materializationCron: '0 */5 * * * *',
    },
    materializationCustomSettings: {
      modeType: MaterializationSettings.DATASET_MATERIALIZED_MODES.DEFAULT,
      materializationSchemaName: null,
      materializationTableName: null,
      materializationThreadCount: null,
      materializationPageSize: null,
      connectionType: null,
      connectionName: null,
      connectionId: null,
      databases: null,
    },
  };

  _materializationStatusTimer = null;

  onEntryClick = async (entry, closeNavModal, materializationCustomSettings) => {
    closeNavModal();

    const database = await this.fetchSortedDatabase(entry.savedId, '');

    const materializationSchemaName =
      entry.savedId === materializationCustomSettings.connectionId
        ? materializationCustomSettings.materializationSchemaName
        : database.sortedDatabases[0];

    this.setState({
      materializationCustomSettings: {
        modeType: materializationCustomSettings.modeType,
        materializationSchemaName: materializationSchemaName,
        materializationTableName: materializationCustomSettings.materializationTableName,
        materializationThreadCount:
          materializationCustomSettings.materializationThreadCount,
        materializationPageSize: materializationCustomSettings.materializationPageSize,
        connectionType: entry.type,
        connectionName: entry.name,
        connectionId: entry.savedId,
        databases: database.sortedDatabases,
      },
    });
  };

  async componentDidUpdate(prevProps, prevState) {
    const { visible: visiblePrev } = prevProps;
    const { visible } = this.props;
    const { showError: showErrorPrev } = prevState;
    const { showError, errorType } = this.state;

    if (!showErrorPrev && showError) {
      const title = this.getErrorTitle();

      this.openNotification({
        title,
        key: `${errorType}_toast`,
        type: NotificationType.Error,
        actions: [
          {
            isForceCloseAfterClick: true,
            label: 'Подробнее',
            onClick: this.errorDialogRef.current.open,
          },
        ],
      });
    }

    if (visiblePrev !== visible) {
      if (visible) {
        await this.fetchDataSourceData();
      } else {
        this._clearTimer(this._materializationStatusTimer);
      }
    }
  }

  componentWillUnmount = () => {
    this._clearTimer(this._materializationStatusTimer);
  };

  errorDialogRef = React.createRef();

  _clearTimer = timer => {
    if (timer) {
      clearTimeout(timer);
    }
  };

  getDataFromError() {
    const { error } = this.state;

    if (!error) {
      return {};
    }

    const {
      response: {
        data: {
          message: responseMessage,
          error: { messageError: responseErrorMessage },
        } = {},
        headers: { 'x-request-id': requestId } = {},
      } = {},
      message,
    } = error;

    return {
      requestId,
      errorMessage: responseMessage || responseErrorMessage || message,
    };
  }

  getErrorTitle() {
    const { errorType } = this.state;

    if (!errorType) {
      return '';
    }

    switch (errorType) {
      case 'fetchMaterializationStatus':
        return 'Ошибка: не удалось получить статус материализации';
      case 'saveData':
        return 'Ошибка: не удалось сохранить';
      case 'materializeDataset':
        return 'Ошибка: не удалось произвести материализацию';
      case 'deleteMaterialization':
        return 'Ошибка: не удалось удалить материализацию';
      case 'update-dataset-schema':
        return 'Ошибка: не удалось обновить схему';
      case REPLACE_SOURCE_MODE_ID:
        return 'Ошибка: не удалось заменить источник';
      case 'clickConnectionMoreMenuItem':
        return 'Ошибка: не удалось выполнить запрос';
      default:
        return 'Ошибка';
    }
  }

  fetchDataSourceData = async () => {
    const { sdk, datasetId } = this.props;

    try {
      this.setState({
        isLoading: true,
        showComponentError: false,
      });

      const [dataset, scheduleSettings] = await Promise.all([
        await sdk.bi.getDataSetByVersion({ dataSetId: datasetId, version: 'draft' }),
        await sdk.bi.getSchedulerSettings({ entryId: datasetId }),
        this.fetchMaterializationStatus(),
      ]);

      const { ds_mode: dsMode } = dataset;

      const { materializationCron } = scheduleSettings;

      const scheduleSettingsState = {
        materializationCron:
          materializationCron === ''
            ? this.state.scheduleSettings.materializationCron
            : materializationCron,
      };

      const selectedDsMode = this.state.isMaterializationRun
        ? this.state.selectedDsMode
        : materializationCron !== ''
        ? DATASET_MODES.MATERIALIZED_BY_PERIOD
        : dsMode;

      this.setState({
        isLoading: false,
        isMaterializationDeleting: false,
        isMaterializationRun: false,
        selectedDsMode: selectedDsMode.toLowerCase(),
        dataset,
        scheduleSettings: {
          ...scheduleSettingsState,
        },
      });

      await this.fetchMaterializationProperties(sdk, dataset);
    } catch ({ message }) {
      this.setState({
        isLoading: false,
        isMaterializationDeleting: false,
        isMaterializationRun: false,
        showComponentError: true,
        errorMessage: message,
      });
    }
  };

  fetchSortedDatabase = async (connectionId, schemaName) => {
    const { sdk } = this.props;

    if (connectionId == null) {
      return {
        sortedDatabases: [],
        materializationSchemaName: null,
      };
    }

    const { items: databases } = await sdk.bi.getConnectionStructure({
      connectionId,
      infoType: 'dbs',
    });

    const sortedDatabases = databases.sort(Utils.sortStrings);

    const materializationSchemaName =
      sortedDatabases.find(item => item === schemaName) || sortedDatabases[0];

    return {
      sortedDatabases: sortedDatabases,
      materializationSchemaName: materializationSchemaName,
    };
  };

  fetchMaterializationProperties = async (sdk, dataset) => {
    const { materializationCustomSettings } = this.state;
    try {
      const connectionId =
        dataset.materializationProperties.materializationConnectionId ||
        materializationCustomSettings.connectionId;

      const materializationConnection =
        connectionId !== null ? await sdk.bi.getConnection({ connectionId }) : null;

      const materializationTableName =
        dataset.materializationProperties.materializationTableName ||
        dataset.origin.table_name;
      const materializationSchemaName =
        dataset.materializationProperties.materializationSchemaName ||
        materializationCustomSettings.materializationSchemaName;
      const materializationConnectionType =
        (materializationConnection && materializationConnection.db_type) ||
        materializationCustomSettings.connectionType ||
        'Clickhouse';
      const materializationConnectionName =
        (materializationConnection && materializationConnection.name) ||
        materializationCustomSettings.connectionName;
      const materializationConnectionId = connectionId;
      const materializationThreadCount =
        dataset.materializationProperties.materializationThreadCount;
      const materializationPageSize =
        dataset.materializationProperties.materializationPageSize;

      const database = await this.fetchSortedDatabase(
        materializationConnectionId,
        materializationSchemaName,
      );

      const modeType =
        dataset.materializationProperties.materializationConnectionId === null
          ? MaterializationSettings.DATASET_MATERIALIZED_MODES.DEFAULT
          : MaterializationSettings.DATASET_MATERIALIZED_MODES.CUSTOM;

      this.setState({
        materializationCustomSettings: {
          modeType: modeType,
          materializationSchemaName: materializationSchemaName,
          materializationTableName: materializationTableName,
          materializationThreadCount: materializationThreadCount,
          materializationPageSize: materializationPageSize,
          connectionType: materializationConnectionType,
          connectionName: materializationConnectionName,
          connectionId: materializationConnectionId,
          databases: database.sortedDatabases,
        },
      });
    } catch ({ message }) {
      this.setState({
        isLoading: false,
        isMaterializationDeleting: false,
        isVerificationClearing: false,
        isMaterializationRun: false,
        isVerificationRun: false,
        showComponentError: true,
        errorMessage: message,
      });
    }
  };

  fetchMaterializationStatus = async () => {
    const { sdk, datasetId } = this.props;

    try {
      this.setState({
        showError: false,
      });

      let isProcessing = false;

      const {
        materialization: materializationStatus,
        materialization: { stage } = {},
      } = await sdk.bi.getMaterializationStatus({ datasetId });

      if (stage) {
        this._clearTimer(this._materializationStatusTimer);

        this._materializationStatusTimer = setTimeout(
          this.fetchMaterializationStatus,
          5000,
        );
      }

      if (stage) {
        isProcessing = ![Stage.DONE, Stage.FAILED, Stage.EMPTY].includes(stage);
      }

      this.setState({
        materializationStatus: {
          ...materializationStatus,
          isProcessing,
        },
      });
    } catch (error) {
      this.setState({
        error,
        errorType: 'fetchMaterializationStatus',
        showError: true,
      });
    }
  };

  treatScheduleSettings = () => {
    const { datasetId } = this.props;
    const {
      scheduleSettings: { materializationCron: materializationCron } = {},
    } = this.state;

    return {
      datasetId: datasetId,
      materializationCron: materializationCron,
    };
  };

  updateDataset = async () => {
    const { sdk, datasetId } = this.props;

    const { materializationCustomSettings } = this.state;

    const materializationProperties = {
      materializationSchemaName: materializationCustomSettings.materializationSchemaName,
      materializationTableName: materializationCustomSettings.materializationTableName,
      materializationThreadCount: Number(
        materializationCustomSettings.materializationThreadCount,
      ),
      materializationPageSize: Number(
        materializationCustomSettings.materializationPageSize,
      ),
      materializationConnectionId: materializationCustomSettings.connectionId,
      materializationConnectionMode: materializationCustomSettings.modeType,
    };

    const emptyMaterializationProperties = {
      materializationConnectionMode: materializationCustomSettings.modeType,
    };

    const isDefaultMode =
      materializationCustomSettings.modeType ===
      MaterializationSettings.DATASET_MATERIALIZED_MODES.DEFAULT;

    await sdk.bi.updateDataSet({
      dataSetId: datasetId,
      version: 'draft',
      resultSchema: [],
      rls: {},
      materializationProperties: isDefaultMode
        ? emptyMaterializationProperties
        : materializationProperties,
    });
  };

  clickSaveBtn = async () => {
    const { sdk, datasetId, onClose } = this.props;
    const {
      selectedDsMode,
      dataset: { connection: { db_type: connectionType } = {} } = {},
      materializationStatus: { isProcessing: isProcessingMaterialization } = {},
      materializationCustomSettings,
    } = this.state;

    try {
      this.setState({
        showError: false,
        progress: true,
      });

      if (!isProcessingMaterialization && connectionType !== 'csv') {
        if (selectedDsMode === DATASET_MODES.DIRECT) {
          await this.disableMaterializationScheduling();

          sdk.bi.setDirectMaterialization({ dataSetId: datasetId });
        } else if (selectedDsMode === DATASET_MODES.MATERIALIZED) {
          await this.disableMaterializationScheduling();

          await this.updateDataset();
        } else if (selectedDsMode === DATASET_MODES.MATERIALIZED_BY_PERIOD) {
          const schedulerSettings = this.treatScheduleSettings();

          await sdk.bi.modifySchedulerSettings(schedulerSettings);
        }
      }

      this.setState(
        {
          progress: false,
        },
        onClose,
      );
    } catch (error) {
      this.setState({
        error,
        errorType: 'saveData',
        progress: false,
        showError: true,
      });
    }
  };

  disableMaterializationScheduling = async () => {
    const { datasetId, sdk } = this.props;

    sdk.bi.modifySchedulerSettings({
      datasetId: datasetId,
    });
  };

  materializeDataset = async () => {
    const { sdk, datasetId } = this.props;
    const { selectedDsMode } = this.state;

    try {
      this.setState({
        showError: false,
        isMaterializationRun: true,
      });

      if (selectedDsMode === DATASET_MODES.MATERIALIZED) {
        await this.disableMaterializationScheduling();
      }

      await this.updateDataset();

      await sdk.bi.materializeDataSet({ dataSetId: datasetId });

      await this.fetchDataSourceData();
    } catch (error) {
      this.setState({
        error,
        errorType: 'materializeDataset',
        showError: true,
        isMaterializationRun: false,
      });
    }
  };

  deleteMaterialization = async () => {
    const { sdk, datasetId } = this.props;

    try {
      this.setState({
        showError: false,
        isMaterializationDeleting: true,
      });

      await this.disableMaterializationScheduling();

      await sdk.bi.deleteMaterialization({ datasetId });

      setTimeout(this.fetchDataSourceData, 2000);
    } catch (error) {
      this.setState({
        error,
        errorType: 'deleteMaterialization',
        showError: true,
        isMaterializationDeleting: false,
      });
    }
  };

  onClickConnectionMoreMenuItem = async (event, value) => {
    try {
      const { datasetId, onClickConnectionMenuItem } = this.props;
      const { dataset: { connection } = {} } = this.state;

      this.setState({
        showError: false,
      });

      switch (value) {
        case 'open-connection': {
          const {
            dataset: { origin: { table_connection_id: connectionId = '' } = {} } = {},
          } = this.state;

          window.open(`/connections/${connectionId}`, '_blank');

          break;
        }
        case 'update-dataset-schema':
        case REPLACE_SOURCE_MODE_ID:
        default: {
          break;
        }
      }

      if (onClickConnectionMenuItem) {
        onClickConnectionMenuItem({ item: value, datasetId, connection });
      }
    } catch (error) {
      this.setState({
        error,
        errorType: 'clickConnectionMoreMenuItem',
        showError: true,
      });
    }
  };

  changeScheduleSettings = values => {
    this.setState({
      scheduleSettings: {
        ...this.state.scheduleSettings,
        ...values,
      },
    });
  };

  changeMaterializationCustomSettings = materializationCustomSettings => {
    this.setState({
      materializationCustomSettings: {
        modeType: materializationCustomSettings.modeType,
        materializationSchemaName:
          materializationCustomSettings.materializationSchemaName,
        materializationTableName: materializationCustomSettings.materializationTableName,
        materializationThreadCount:
          materializationCustomSettings.materializationThreadCount,
        materializationPageSize: materializationCustomSettings.materializationPageSize,
        connectionType: materializationCustomSettings.connectionType,
        connectionName: materializationCustomSettings.connectionName,
        connectionId: materializationCustomSettings.connectionId,
        databases: materializationCustomSettings.databases,
      },
    });
  };

  changeMaterializationType = e => {
    this.setState({
      selectedDsMode: e.target.value,
    });
  };

  renderContent = () => {
    const {
      showComponentError,
      isLoading,
      selectedDsMode,
      dataset: {
        ds_mode: dsMode,
        table_db_name: tableDbName,
        tasks: { materialization = [], preview = [] } = {},
        connection: { db_type: connectionType } = {},
        connection,
        origin,
        origin: { table_db_name: tableDbNameOrigin } = {},
      } = {},
      materializationStatus: { isProcessing: isProcessingMaterialization } = {},
      isMaterializationDeleting,
    } = this.state;
    const { isProcessingSource } = this.props;

    if (isLoading) {
      return (
        <div className={b('loader')}>
          <Loader size="l" />
        </div>
      );
    }

    if (showComponentError) {
      return (
        <ErrorView
          errorMessage="Ошибка: не удалось загрузить данные"
          actionBtnProps={{
            text: 'Повторить',
            onClick: this.fetchDataSourceData,
          }}
        />
      );
    }

    const isDirectDsMode = dsMode === 'DIRECT';

    const disabledDirectMode = DISABLE_DIRECT_MODE_FOR_TYPES.includes(connectionType);
    const disableMaterialization =
      isProcessingMaterialization ||
      selectedDsMode === DATASET_MODES.DIRECT ||
      connectionType === 'csv';
    const disableChangeMaterialization =
      DISABLE_TYPES.includes(connectionType) ||
      (!isDirectDsMode && isProcessingMaterialization);
    const disableDeleteMaterialization =
      isDirectDsMode ||
      isMaterializationDeleting ||
      isProcessingMaterialization ||
      DISABLE_TYPES.includes(connectionType);

    return (
      <React.Fragment>
        <ConnectionInfo
          isProcessing={isProcessingSource || isProcessingMaterialization}
          origin={origin}
          connection={connection}
          tableDbName={tableDbName || tableDbNameOrigin}
          onClickConnectionMoreMenuItem={this.onClickConnectionMoreMenuItem}
        />
        <div className={b('columns')}>
          <LeftColumn
            {...this.state}
            connectionType={connectionType}
            disableChangeMaterialization={disableChangeMaterialization}
            disabledDirectMode={disabledDirectMode}
            changeMaterializationType={this.changeMaterializationType}
            changeMaterializationCustomSettings={this.changeMaterializationCustomSettings}
            changeScheduleSettings={this.changeScheduleSettings}
            sdk={this.props.sdk}
            databases={this.state.databases}
            onEntryClick={this.onEntryClick}
          />
          <RightColumn
            {...this.state}
            disableDeleteMaterialization={disableDeleteMaterialization}
            dsMode={selectedDsMode}
            connectionType={connectionType}
            materialization={materialization}
            preview={preview}
            disableMaterializeDatasetBtn={disableMaterialization}
            materializeDataset={this.materializeDataset}
            deleteMaterialization={this.deleteMaterialization}
          />
        </div>
      </React.Fragment>
    );
  };

  render() {
    const { visible, onClose } = this.props;
    const {
      showComponentError,
      progress,
      dataset: { connection_type: connectionType } = {},
    } = this.state;
    const disabledApplyBtn = connectionType === 'csv' || showComponentError;
    const { requestId, errorMessage } = this.getDataFromError();

    return (
      <Dialog visible={visible} onClose={onClose}>
        <div className={b()}>
          <Dialog.Header caption="Материализация данных" hr={false} onClose={onClose} />
          <div className={b('content')}>{this.renderContent()}</div>
          <ErrorDialog
            ref={this.errorDialogRef}
            title={this.getErrorTitle()}
            requestId={requestId}
            message={errorMessage}
          />
          <Dialog.Footer
            preset="default"
            onClickButtonCancel={onClose}
            onClickButtonApply={this.clickSaveBtn}
            textButtonApply="Сохранить"
            textButtonCancel="Закрыть"
            progress={progress}
            hr={true}
            propsButtonApply={{
              disabled: disabledApplyBtn,
            }}
          />
        </div>
      </Dialog>
    );
  }
}

export default DataSource;
