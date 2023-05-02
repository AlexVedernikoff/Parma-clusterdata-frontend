import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Dialog, Loader } from '@kamatech-data-ui/common/src';
import { ErrorDialog } from '@kamatech-data-ui/clustrum';
import Toaster from '@kamatech-data-ui/common/src/components/Toaster';

import { REPLACE_SOURCE_MODE_ID } from '../../constants';
import { ConnectionInfo, DataSourceButton, Status } from './components';
import ErrorView from '../ErrorView/ErrorView';
import { Stage } from './Stage';

const b = block('data-source');

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

function StatusColumn(props) {
  const {
    isVerificationClearing,
    verificationStatus,
    deleteVerification,
    disableDeleteVerification,
    disableVerificationDatasetBtn,
    isVerificationRun,
    verifyDataset,
  } = props;

  let isAllowedVerification = true;
  let isAllowedClearVerification = true;

  return (
    <div className={b('column-left')}>
      <StatusPanel status={verificationStatus} isDirectDsMode={false} />
      {isAllowedVerification && (
        <div className={b('section', b('margin', { bottom: 22 }))}>
          <DataSourceButton
            disabled={disableVerificationDatasetBtn}
            label="Следующий запуск"
            cls={b('run-btn')}
            text="Запустить сейчас"
            isLoading={isVerificationRun}
            onClick={verifyDataset}
          />
        </div>
      )}
      {isAllowedClearVerification && (
        <DataSourceButton
          disabled={disableDeleteVerification}
          cls={b('delete-btn')}
          text="Очистить результаты"
          isLoading={isVerificationClearing}
          onClick={deleteVerification}
        />
      )}
    </div>
  );
}

class VerificationModal extends React.Component {
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
    isVerificationClearing: false,
    isVerificationRun: false,
    showError: false,
    progress: false,
    selectedDsMode: undefined,
    dataset: undefined,
    datasetStatus: undefined,
    store: undefined,
    error: null,
    errorMessage: null,
    verificationStatus: undefined,
  };

  _verificationStatusTimer = null;

  toaster = new Toaster();

  async componentDidUpdate(prevProps, prevState) {
    const { visible: visiblePrev } = prevProps;
    const { visible } = this.props;
    const { showError: showErrorPrev } = prevState;
    const { showError, errorType } = this.state;

    if (!showErrorPrev && showError) {
      const title = this.getErrorTitle();

      this.toaster.createToast({
        title,
        name: `${errorType}_toast`,
        type: 'error',
        allowAutoHiding: false,
        actions: [
          {
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
        this._clearTimer(this._verificationStatusTimer);
      }
    }
  }

  componentWillUnmount = () => {
    this._clearTimer(this._verificationStatusTimer);
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
      response: { data: { message: responseMessage } = {}, headers: { 'x-request-id': requestId } = {} } = {},
      message,
    } = error;

    return {
      requestId,
      errorMessage: responseMessage || message,
    };
  }

  getErrorTitle() {
    const { errorType } = this.state;

    if (!errorType) {
      return '';
    }

    switch (errorType) {
      case 'fetchVerificationStatus':
        return 'Ошибка: не удалось получить статус верификации';
      case 'saveData':
        return 'Ошибка: не удалось сохранить';
      case 'deleteVerification':
        return 'Ошибка: не удалось очистить результаты верификации';
      case 'verifyDataset':
        return 'Ошибка: не удалось произвести верификацию';
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

      const [dataset] = await Promise.all([
        await sdk.bi.getDataSetByVersion({ dataSetId: datasetId, version: 'draft' }),
        this.fetchVerificationStatus(),
      ]);

      this.setState({
        isLoading: false,
        isVerificationClearing: false,
        isVerificationRun: false,
        dataset,
      });
    } catch ({ message }) {
      this.setState({
        isLoading: false,
        isVerificationClearing: false,
        isVerificationRun: false,
        showComponentError: true,
        errorMessage: message,
      });
    }
  };

  fetchVerificationStatus = async () => {
    const { sdk, datasetId } = this.props;

    try {
      this.setState({
        showError: false,
      });

      let isProcessing = false;

      const {
        materialization: verificationStatus,
        materialization: { stage } = {},
      } = await sdk.bi.getVerificationStatus({ datasetId });

      if (stage) {
        this._clearTimer(this._verificationStatusTimer);

        this._verificationStatusTimer = setTimeout(this.fetchVerificationStatus, 5000);
      }

      if (stage) {
        isProcessing = ![Stage.DONE, Stage.FAILED, Stage.EMPTY].includes(stage);
      }

      this.setState({
        verificationStatus: {
          ...verificationStatus,
          isProcessing,
        },
      });
    } catch (error) {
      this.setState({
        error,
        errorType: 'fetchVerificationStatus',
        showError: true,
      });
    }
  };

  clickSaveBtn = async () => {
    const { onClose } = this.props;
    const { dataset: { connection: { db_type: connectionType } = {} } = {} } = this.state;

    try {
      this.setState({
        showError: false,
        progress: true,
      });

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

  verifyDataset = async () => {
    const { sdk, datasetId } = this.props;

    try {
      this.setState({
        showError: false,
        isVerificationRun: true,
      });

      await sdk.bi.verifyDataset({ datasetId });

      await this.fetchDataSourceData();
    } catch (error) {
      this.setState({
        error,
        errorType: 'verifyDataset',
        showError: true,
        isVerificationRun: false,
      });
    }
  };

  deleteVerification = async () => {
    const { sdk, datasetId } = this.props;

    try {
      this.setState({
        showError: false,
        isVerificationClearing: true,
      });

      sdk.bi.deleteVerification({ datasetId });

      setTimeout(this.fetchDataSourceData, 2000);
    } catch (error) {
      this.setState({
        error,
        errorType: 'deleteVerification',
        showError: true,
        isVerificationClearing: false,
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
          const { dataset: { origin: { table_connection_id: connectionId = '' } = {} } = {} } = this.state;

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

  renderContent = () => {
    const {
      showComponentError,
      isLoading,
      selectedDsMode,
      dataset: {
        table_db_name: tableDbName,
        tasks: { preview = [] } = {},
        connection: { db_type: connectionType } = {},
        connection,
        origin,
        origin: { table_db_name: tableDbNameOrigin } = {},
      } = {},
      verificationStatus: { isProcessing: isProcessingVerification } = {},
      isVerificationClearing,
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

    return (
      <React.Fragment>
        <div className={b('columns')}>
          <StatusColumn
            {...this.state}
            disableDeleteVerification={isVerificationClearing}
            dsMode={selectedDsMode}
            connectionType={connectionType}
            preview={preview}
            disableVerificationDatasetBtn={isProcessingVerification}
            deleteVerification={this.deleteVerification}
            verifyDataset={this.verifyDataset}
          />
        </div>
      </React.Fragment>
    );
  };

  render() {
    const { visible, onClose } = this.props;
    const { showComponentError, progress, dataset: { connection_type: connectionType } = {} } = this.state;
    const disabledApplyBtn = connectionType === 'csv' || showComponentError;
    const { requestId, errorMessage } = this.getDataFromError();

    return (
      <Dialog visible={visible} onClose={onClose}>
        <div className={b()}>
          <Dialog.Header caption="Верификация и сопоставление данных" hr={false} onClose={onClose} />
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

export default VerificationModal;
