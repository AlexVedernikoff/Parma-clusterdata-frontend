import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'recompose';
import { Spin } from 'lego-on-react';
import {
  ErrorContent,
  EntryDialogues,
  ActionPanel,
  ErrorDialog,
} from '@kamatech-data-ui/clustrum';
import { Types } from '@kamatech-data-ui/clustrum/src/components/ErrorContent/ErrorContent';

import DatasetPanel from '../../components/DatasetPanel/DatasetPanel';
import DatasetTabs from '../../containers/DatasetTabs/DatasetTabs';
import DatasetPreview from '../DatasetPreview/DatasetPreview';
import DatasetHistory from '../DatasetHistory/DatasetHistory';
import ContainerLoader from '../../components/ContainerLoader/ContainerLoader';
import DataSource from '../../components/DataSource/DataSource';
import Utils from '../../helpers/utils';
import { REPLACE_SOURCE_MODE_ID, TAB_DATASET } from '../../constants';

import {
  initialFetchDataset,
  fetchDataset,
  saveDataset,
  toggleVisibilityPreview,
  toggleVisibilityHistory,
  datasetKeySelector,
  datasetErrorSelector,
  datasetPreviewErrorSelector,
  datasetSavingErrorSelector,
  isDatasetChangedDatasetSelector,
  isLoadingDatasetSelector,
  isFavoriteDatasetSelector,
  isProcessingDatasetSelector,
  isSavingDatasetSelector,
  isSavingDatasetDisabledSelector,
  previewEnabledSelector,
  syncDataSet,
  datasetNameSelector,
} from '../../store/reducers/dataset';

import PageHead from '../../components/PageHeader/PageHeader';
import VerificationModal from '../../components/DataSource/VerificationModal';
import { Button } from 'antd';
import { BarChartOutlined, BlockOutlined, SafetyOutlined } from '@ant-design/icons';
import { NotificationContext } from '@entities/notification';

const b = block('dataset');

class Dataset extends React.Component {
  static defaultProps = { initialDatasetName: null };

  static propTypes = {
    datasetId: PropTypes.string.isRequired,
    datasetName: PropTypes.string.isRequired,
    initialDatasetName: PropTypes.string,
    sdk: PropTypes.object.isRequired,
    initialFetchDataset: PropTypes.func.isRequired,
    fetchDataset: PropTypes.func.isRequired,
    toggleVisibilityPreview: PropTypes.func.isRequired,
    toggleVisibilityHistory: PropTypes.func.isRequired,
    syncDataSet: PropTypes.func.isRequired,
    saveDataset: PropTypes.func.isRequired,
  };

  static contextType = NotificationContext;

  state = {
    isVisibleDatasetCreationDialog: false,
    isVisibleDataSource: false,
    isVisibleVerificationModal: false,
    isProcessingSource: false,
    viewId: null,
    progress: false,
    modeId: '',
    connectionId: '',
    connectionType: '',
    error: null,
    tab: TAB_DATASET,
    searchKeyword: '',
    propsDatasetCreationDialog: {},
  };

  componentDidMount() {
    const { datasetId, initialFetchDataset } = this.props;
    const openNotification = this.context;

    initialFetchDataset({
      datasetId,
      datasetErrorDialogRef: this.datasetErrorDialogRef,
      openNotification,
    });

    window.addEventListener('beforeunload', this.confirmClosePage);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.confirmClosePage);
  }

  datasetErrorDialogRef = React.createRef();
  _datasetEditorRef = React.createRef();
  _askAccessRightsDialogRef = React.createRef();

  confirmClosePage = event => {
    const { isDatasetChanged } = this.props;

    if (isDatasetChanged) {
      event.returnValue = true;
    }
  };

  openCreationWidgetPage = () => {
    const { datasetId } = this.props;

    Utils.openCreationWidgetPage({ datasetId });
  };

  openDataSource = () => {
    this.setState({
      isVisibleDataSource: true,
    });
  };

  closeDataSource = (rest = {}) => {
    this.setState({
      isVisibleDataSource: false,
      ...rest,
    });
  };

  openVerificationModal = () => {
    this.setState({
      isVisibleVerificationModal: true,
    });
  };

  closeVerificationModal = (rest = {}) => {
    this.setState({
      isVisibleVerificationModal: false,
      ...rest,
    });
  };

  askAccessRights = () => {
    const { datasetId } = this.props;

    this._askAccessRightsDialogRef.current.openDialog({
      dialog: 'unlock',
      dialogProps: {
        entry: {
          entryId: datasetId,
        },
      },
    });
  };

  onClickConnectionMenuItem = async ({ item, datasetId, connection }) => {
    const { sdk, initialFetchDataset } = this.props;

    try {
      this.setState({
        error: null,
        isProcessingSource: true,
      });

      const openNotification = this.context;

      switch (item) {
        case 'update-dataset-schema': {
          await sdk.bi.modifyDatasetSource({ datasetId });
          this.closeDataSource();
          initialFetchDataset({ datasetId, openNotification });

          break;
        }
        case REPLACE_SOURCE_MODE_ID: {
          const { id: connectionId } = connection;

          window.open(`/datasets/source?id=${connectionId}`, '_blank');

          break;
        }
        case 'open-connection':
        default: {
          break;
        }
      }

      this.setState({
        isProcessingSource: false,
      });
    } catch (error) {
      this.setState({
        errorType: item,
        error,
        isProcessingSource: false,
      });
    }
  };

  getErrorMessageByCode = ({ status, data = {} }) => {
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
              title: 'Ошибка: некорректный запрос к датасету',
              description: '',
            };
        }
      case 403:
      case Types.NO_ACCESS:
        return {
          type: 'not-found',
          title: 'У вас нет доступа к датасету или к его подключению',
          action: {
            text: 'Запросить права доступа на датасет',
            handler: this.askAccessRights,
          },
        };
      case 404:
      case Types.NOT_FOUND:
        return {
          type: 'not-found',
          title: 'Ошибка: датасет не найден',
        };
      case 500:
      case Types.ERROR:
      default:
        const { initialDatasetName } = this.props;
        return {
          type: 'error',
          title: initialDatasetName
            ? `Набор данных с названием ${initialDatasetName} уже существует.`
            : 'Ошибка: не удалось загрузить датасет.',
          description: '',
        };
    }
  };

  renderErrorContent() {
    const {
      datasetError: {
        response: {
          status,
          data: { data } = {},
          headers: { 'x-request-id': reqId } = {},
        } = {},
      } = {},
      sdk,
    } = this.props;
    const { type, title, description, action } = this.getErrorMessageByCode({
      status,
      data,
    });

    return (
      <React.Fragment>
        <ErrorContent
          type={type}
          title={title}
          description={description}
          reqId={reqId}
          action={action}
          sdk={sdk}
        />
        <EntryDialogues ref={this._askAccessRightsDialogRef} sdk={sdk} />
      </React.Fragment>
    );
  }

  parseError = error => {
    const {
      response: {
        data: { message: responseMessage, data: { description } = {} } = {},
        headers: { 'x-request-id': requestId } = {},
      } = {},
      message,
    } = error;

    let errorDialogMessage = responseMessage || message;

    if (description) {
      errorDialogMessage += `\n${description}`;
    }

    return {
      requestId,
      message: errorDialogMessage,
    };
  };

  getErrorDialogMessage = () => {
    const { previewError, savingError } = this.props;

    if (!savingError && !previewError) {
      return {};
    }

    if (savingError) {
      const { requestId, message } = this.parseError(savingError);

      return {
        requestId,
        errorDialogTitle: 'Ошибка: не удалось сохранить датасет',
        errorDialogMessage: message,
      };
    }

    if (previewError) {
      const { requestId, message } = this.parseError(previewError);

      return {
        requestId: requestId,
        errorDialogTitle: 'Ошибка: не удалось загрузить данные для предпросмотра',
        errorDialogMessage: message,
      };
    }
  };

  switchTab = tab => {
    this.setState({
      tab,
    });
  };

  openFieldEditor = () => {
    console.log('this._datasetEditorRef >>> ', this._datasetEditorRef);
    const datasetEditorRef = this._datasetEditorRef.current;

    if (datasetEditorRef) {
      datasetEditorRef.openFieldEditor();
    }
  };

  changeSearchKeyword = searchKeyword => {
    this.setState({
      searchKeyword,
    });
  };

  render() {
    const {
      sdk,
      datasetId,
      datasetName,
      datasetError,
      isLoading,
      isFavorite,
      isProcessingDataset,
      datasetKey,
      savingDatasetDisabled,
      isProcessingSavingDataset,
      saveDataset,
      syncDataSet,
      previewEnabled,
      toggleVisibilityPreview,
      toggleVisibilityHistory,
    } = this.props;
    const {
      isVisibleDataSource,
      isVisibleVerificationModal,
      errorType,
      error,
      progressDataSource,
      isProcessingSource,
      tab,
      searchKeyword,
    } = this.state;
    const {
      requestId,
      errorDialogTitle,
      errorDialogMessage,
    } = this.getErrorDialogMessage();

    if (isLoading) {
      return (
        <div className={b('loader')}>
          <ContainerLoader text="Загрузка датасета" />
        </div>
      );
    }

    if (datasetError) {
      return this.renderErrorContent();
    }
    const openNotification = this.context;
    return (
      <div className={b()}>
        {!BUILD_SETTINGS.isLib && <PageHead title={datasetName} />}
        <ActionPanel
          sdk={sdk}
          entry={{
            entryId: datasetId,
            key: datasetKey,
            isFavorite,
            scope: 'dataset',
          }}
          additionalEntryItems={[
            <Button
              className="ant-d-header-small-btn"
              key="materialization"
              onClick={this.openDataSource}
              icon={<BlockOutlined style={{ color: '#1890ff' }} />}
              key="materialization-btn"
            />,
            <Button
              className="ant-d-header-small-btn"
              key="verification"
              onClick={this.openVerificationModal}
              icon={<SafetyOutlined style={{ color: '#1890ff' }} />}
              key="verification-btn"
            />,
          ]}
          rightItems={[
            <Button
              key="create-widget"
              onClick={this.openCreationWidgetPage}
              icon={<BarChartOutlined />}
              key="create-widget-btn"
            >
              Создать элемент аналитической панели
            </Button>,
            <Button
              disabled={savingDatasetDisabled}
              type="primary"
              onClick={() =>
                saveDataset({
                  datasetErrorDialogRef: this.datasetErrorDialogRef,
                  openNotification,
                })
              }
              key="save-dataset-btn"
            >
              Сохранить
              {isProcessingDataset && (
                <React.Fragment>
                  <Spin size="xs" progress />
                  &nbsp;&nbsp;
                </React.Fragment>
              )}
            </Button>,
          ]}
        />
        <DatasetPanel
          tab={tab}
          previewEnabled={previewEnabled}
          searchKeyword={searchKeyword}
          switchTab={this.switchTab}
          toggleVisibilityPreview={toggleVisibilityPreview}
          toggleVisibilityHistory={toggleVisibilityHistory}
          syncDataSet={syncDataSet}
          openFieldEditor={this.openFieldEditor}
          changeSearchKeyword={this.changeSearchKeyword}
        />
        <DatasetTabs
          ref={this._datasetEditorRef}
          tab={tab}
          sdk={sdk}
          datasetId={datasetId}
          searchKeyword={searchKeyword}
          datasetErrorDialogRef={this.datasetErrorDialogRef}
        />
        <DatasetPreview tab={tab} datasetUpdated={false} />
        <DatasetHistory tab={tab} datasetUpdated={!isProcessingSavingDataset} />
        <ErrorDialog
          ref={this.datasetErrorDialogRef}
          title={errorDialogTitle}
          requestId={requestId}
          message={errorDialogMessage}
        />
        <DataSource
          sdk={sdk}
          visible={isVisibleDataSource}
          datasetId={datasetId}
          progress={progressDataSource}
          isProcessingSource={isProcessingSource}
          onClose={this.closeDataSource}
          onClickConnectionMenuItem={this.onClickConnectionMenuItem}
          errorType={errorType}
          error={error}
        />
        <VerificationModal
          visible={isVisibleVerificationModal}
          datasetId={datasetId}
          sdk={sdk}
          onClose={this.closeVerificationModal}
        />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  datasetKey: datasetKeySelector,
  datasetName: datasetNameSelector,
  datasetError: datasetErrorSelector,
  previewError: datasetPreviewErrorSelector,
  savingError: datasetSavingErrorSelector,
  isDatasetChanged: isDatasetChangedDatasetSelector,
  isLoading: isLoadingDatasetSelector,
  isFavorite: isFavoriteDatasetSelector,
  isProcessingDataset: isProcessingDatasetSelector,
  savingDatasetDisabled: isSavingDatasetDisabledSelector,
  isProcessingSavingDataset: isSavingDatasetSelector,
  previewEnabled: previewEnabledSelector,
});
const mapDispatchToProps = {
  initialFetchDataset,
  fetchDataset,
  saveDataset,
  toggleVisibilityPreview,
  toggleVisibilityHistory,
  syncDataSet,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Dataset);
