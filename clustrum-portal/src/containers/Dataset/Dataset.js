import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'recompose';
import { Button, Spin } from 'lego-on-react';
import { ErrorContent, EntryDialogues, ActionPanel, i18n, ErrorDialog } from '@kamatech-data-ui/clustrum';
import { Icon } from '@kamatech-data-ui/common/src';
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
  updateDatasetByValidation,
  changeAmountPreviewRows,
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

// import './Dataset.scss';
import iconData from '@kamatech-data-ui/clustrum/src/icons/data.svg';
import PageHead from '../../components/PageHeader/PageHeader';
import VerificationModal from '../../components/DataSource/VerificationModal';
import iconVerificationRules from '@kamatech-data-ui/clustrum/src/icons/verification-rules-blue.svg';

const b = block('dataset');

class Dataset extends React.Component {
  static defaultProps = {};

  static propTypes = {
    datasetId: PropTypes.string.isRequired,
    datasetName: PropTypes.string.isRequired,
    sdk: PropTypes.object.isRequired,
    initialFetchDataset: PropTypes.func.isRequired,
    fetchDataset: PropTypes.func.isRequired,
    toggleVisibilityPreview: PropTypes.func.isRequired,
    toggleVisibilityHistory: PropTypes.func.isRequired,
    syncDataSet: PropTypes.func.isRequired,
    updateDatasetByValidation: PropTypes.func.isRequired,
    saveDataset: PropTypes.func.isRequired,
    changeAmountPreviewRows: PropTypes.func.isRequired,
  };

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

    initialFetchDataset({
      datasetId,
      datasetErrorDialogRef: this.datasetErrorDialogRef,
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

      switch (item) {
        case 'update-dataset-schema': {
          await sdk.bi.modifyDatasetSource({ datasetId });
          this.closeDataSource();
          initialFetchDataset({ datasetId });

          break;
        }
        case REPLACE_SOURCE_MODE_ID: {
          const { id: connectionId } = connection;

          window.open(`/datasets/${datasetId}/source?id=${connectionId}`, '_blank');

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
              title: i18n('dataset.dataset-editor.modify', 'label_error-400-no-connection-title'),
            };
          default:
            return {
              type: 'error',
              title: i18n('dataset.dataset-editor.modify', 'label_error-400-title'),
              description: i18n('dataset.dataset-editor.modify', 'label_error-400-description'),
            };
        }
      case 403:
      case Types.NO_ACCESS:
        return {
          type: 'not-found',
          title: i18n('dataset.dataset-editor.modify', 'label_error-403-title'),
          action: {
            text: i18n('dataset.dataset-editor.modify', 'button_ask-access-rights'),
            handler: this.askAccessRights,
          },
        };
      case 404:
      case Types.NOT_FOUND:
        return {
          type: 'not-found',
          title: i18n('dataset.dataset-editor.modify', 'label_error-404-title'),
        };
      case 500:
      case Types.ERROR:
      default:
        return {
          type: 'error',
          title: i18n('dataset.dataset-editor.modify', 'label_error-500-title'),
          description: i18n('dataset.dataset-editor.modify', 'label_error-500-description'),
        };
    }
  };

  renderErrorContent() {
    const {
      datasetError: { response: { status, data: { data } = {}, headers: { 'x-request-id': reqId } = {} } = {} } = {},
      sdk,
    } = this.props;
    const { type, title, description, action } = this.getErrorMessageByCode({ status, data });

    return (
      <React.Fragment>
        <ErrorContent type={type} title={title} description={description} reqId={reqId} action={action} sdk={sdk} />
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
        errorDialogTitle: i18n('dataset.notifications.view', 'toast_dataset-save-msgs-failure'),
        errorDialogMessage: message,
      };
    }

    if (previewError) {
      const { requestId, message } = this.parseError(previewError);

      return {
        requestId: requestId,
        errorDialogTitle: i18n('dataset.notifications.view', 'toast_dataset-fetch-preview-msgs-failure'),
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
    const { requestId, errorDialogTitle, errorDialogMessage } = this.getErrorDialogMessage();

    if (isLoading) {
      return (
        <div className={b('loader')}>
          <ContainerLoader text={i18n('dataset.dataset-editor.modify', 'label_loading-dataset')} />
        </div>
      );
    }

    if (datasetError) {
      return this.renderErrorContent();
    }

    return (
      <div className={b()}>
        <PageHead title={datasetName} />
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
              cls={b('materialization-btn')}
              key='materialization'
              theme='flat'
              size='n'
              view='default'
              tone='default'
              title={i18n('dataset.dataset-editor.modify', 'button_data')}
              onClick={this.openDataSource}
            >
              <Icon data={iconData} width={22} height={22} />
            </Button>,
            <Button
              cls={b('verification-btn')}
              key='verification'
              theme='flat'
              size='n'
              view='default'
              tone='default'
              title={i18n('dataset.dataset-editor.modify', 'button_verify_data')}
              onClick={this.openVerificationModal}
            >
              <Icon data={iconVerificationRules} width={22} height={22} />
            </Button>,
          ]}
          rightItems={[
            <Button
              key='create-widget'
              cls={b('create-widget-btn')}
              theme='flat'
              size='n'
              view='default'
              tone='default'
              text={i18n('dataset.dataset-editor.modify', 'button_create-widget')}
              onClick={this.openCreationWidgetPage}
            />,
            <Button
              disabled={savingDatasetDisabled}
              progress={isProcessingSavingDataset}
              cls={b('save-dataset-btn')}
              key='save-dataset'
              theme='action'
              size='n'
              view='default'
              tone='default'
              text={isProcessingDataset ? null : i18n('dataset.dataset-editor.modify', 'button_save')}
              onClick={() =>
                saveDataset({
                  datasetErrorDialogRef: this.datasetErrorDialogRef,
                })
              }
            >
              {isProcessingDataset && (
                <React.Fragment>
                  <Spin size='xs' progress />
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
  updateDatasetByValidation,
  changeAmountPreviewRows,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Dataset);
