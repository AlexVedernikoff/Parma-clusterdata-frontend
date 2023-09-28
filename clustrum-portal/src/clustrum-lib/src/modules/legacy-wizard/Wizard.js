import block from 'bem-cn-lite';

import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { ErrorContent, EntryDialogues, ActionPanel } from '@kamatech-data-ui/clustrum';

import { SectionDataset } from '@lib-widgets/section-dataset';
import SectionVisualization from './SectionVisualization/SectionVisualization';
import { SectionPreview } from '@lib-widgets/section-preview';

import DialogNoRights from './components/Dialogs/DialogNoRights';

import { Loader } from '@kamatech-data-ui/common/src';

import { createStructuredSelector } from 'reselect';

import { selectDataset } from '../../../../reducers/dataset';

import { selectVisualization } from '../../../../reducers/visualization';

import {
  selectSettings,
  selectIsFullscreen,
  selectIsDefaultsSet,
} from '../../../../reducers/settings';

import {
  selectIsWidgetLoading,
  selectWidgetError,
  selectWidget,
  selectWidgetHash,
} from '../../../../reducers/widget';

import {
  selectConfig,
  selectConfigType,
  selectHighchartsWidget,
  selectPreviewHash,
} from '../../../../reducers/preview';

import {
  fetchWidget,
  setDefaults,
  toggleFullscreen,
  requestUpdateWidget,
  receiveWidget,
} from '../../../../actions';

import { getNavigationPathFromKey } from '../../../../helpers/utils-dash';
import PageHead from '../../../../components/PageHeader/PageHeader';
import { FullscreenOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { NotificationType } from '@shared/types/notification';
import { NotificationContext } from '@entities/notification';

const b = block('wizard');

class Wizard extends Component {
  static propTypes = {
    sdk: PropTypes.object,
    entryId: PropTypes.string,
    onSavingStart: PropTypes.func,
    onSavingEnd: PropTypes.func,
    onExport: PropTypes.func,
  };

  static contextType = NotificationContext;

  entryDialoguesRef = React.createRef();

  constructor(props) {
    super(props);

    const { isDefaultsSet, setDefaults, preview, sdk, entryId } = props;

    if (!isDefaultsSet || entryId) {
      setDefaults({ sdk, preview, entryId });
    }

    this.state = {
      copyTooltipVisible: false,
      dialogNoRightsVisible: false,
    };
  }

  async openSaveAsWidgetDialog() {
    const { config, dataset, visualization, receiveWidget } = this.props;

    const labelVisualization = {
      'label_visualization-area': 'Диаграмма с областями',
      'label_visualization-area-100p': '100% диаграмма с областями',
      'label_visualization-column': 'Столбчатая диаграмма',
      'label_visualization-column-100p': '100% cтолбчатая диаграмма',
      'label_visualization-flat-table': 'Таблица',
      'label_visualization-line': 'Линейная диаграмма',
      'label_visualization-pie': 'Круговая диаграмма',
      'label_visualization-pivot-table': 'Сводная таблица',
      map: 'Карта',
      heatmap: 'Фоновая карта',
      map_cluster_focus_point: 'Карта очагов по кластеризации',
      label_visualization_card: 'Карточка объекта',
      'label_visualization-scatter': 'Точечная  диаграмма',
      'label_visualization-treemap': 'Древовидная диаграмма',
      label_visualization_indicator: 'Индикатор',
      label_visualization_multiline: 'График',
      label_visualization_column_plan_fact: 'Индикатор сопоставления план-факт',
    };

    const result = await this.entryDialoguesRef.current.openDialog({
      dialog: 'save_widget',
      dialogProps: {
        path: `${getNavigationPathFromKey(dataset.key)}`,
        widgetName: `${dataset.name} — ${labelVisualization[visualization.name]}`,
        widgetData: config.shared,
        title: 'Сохранить чарт',
        onNotify: ({ error }) => {
          if (error && error.response && error.response.status === 400) {
            const openNotification = this.context;
            openNotification({
              title: 'Диаграмма с таким именем уже существует',
              key: 'WIZARD',
              type: NotificationType.Error,
            });
          }
        },
      },
    });

    if (!result || result.status === 'close') {
      return;
    }

    receiveWidget(result);
  }

  openSaveWidgetDialog = async () => {
    const {
      widget,
      sdk,
      config,
      requestUpdateWidget,
      onSavingStart,
      onSavingEnd,
    } = this.props;

    // Обновляем существующий или сохраняем новый?
    if (widget && !widget.fake) {
      // Обновляем существующий
      const { entryId, revId } = widget;

      if (onSavingStart) {
        onSavingStart();
      }

      requestUpdateWidget({
        entryId,
        revId,
        data: config.shared,
        sdk,
        callback: onSavingEnd,
      });
    } else {
      this.openSaveAsWidgetDialog();
    }
  };

  openNoRightsDialog = () => {
    this.setState({
      dialogNoRightsVisible: true,
    });
  };

  openRequestWidgetAccessRightsDialog = () => {
    const { widget } = this.props;
    const { entryDialoguesRef } = this;

    entryDialoguesRef.current.openDialog({
      dialog: 'unlock',
      dialogProps: {
        entry: {
          ...widget,
          entryId: widget.entryId,
        },
      },
    });
  };

  getErrorInfo = ({ code }) => {
    switch (code) {
      case 403:
      case 'no-access':
        return {
          type: 'no-access',
          title: 'Нет доступа к чарту',
        };
      case 404:
      case 'not-found':
        return {
          type: 'not-found',
          title: 'Диаграмма не найдена',
        };
      case 500:
      case 'error':
      default:
        return {
          type: 'error',
          title: 'Произошла ошибка',
        };
    }
  };

  renderError() {
    const { widgetError } = this.props;

    const { type, title, description } = this.getErrorInfo(widgetError);

    return <ErrorContent type={type} title={title} description={description} />;
  }

  handleOpenDataset(id) {
    window.open(`/datasets/${id}`);
  }

  renderApp() {
    const {
      sdk,
      widget,
      isFullscreen,
      preview,
      isWidgetLoading,
      toggleFullscreen,
      onExport,
      config,
      configType,
      previewHash,
      widgetHash,
    } = this.props;

    const fullscreen = isFullscreen || preview ? ' fullscreen-mode' : '';
    const hidden = isFullscreen ? ' hidden' : '';
    const isSaveBtnDisabled = !config || !configType || previewHash === widgetHash;
    const isSaveMoreBtnDisabled = !config || !configType;
    const { entryDialoguesRef } = this;

    if (isWidgetLoading) {
      return (
        <div className={b('loader')}>
          <Loader size={'l'} />
        </div>
      );
    }

    const entryLocked = widget && widget.editable === false;

    const saveItems = [
      {
        label: (
          <a
            onClick={() => {
              this.openSaveAsWidgetDialog();
            }}
          >
            Сохранить как
          </a>
        ),
        key: '1',
        disabled: isSaveMoreBtnDisabled,
      },
    ];

    return (
      <div className={`${b()}${fullscreen}`}>
        {!BUILD_SETTINGS.isLib && <PageHead title={widget.name} />}
        <DialogNoRights
          visible={this.state.dialogNoRightsVisible}
          onClose={() => {
            this.setState({
              dialogNoRightsVisible: false,
            });
          }}
          onAccessRights={() => {
            this.openRequestWidgetAccessRightsDialog();
          }}
          onSaveAs={() => {
            this.openSaveAsWidgetDialog();
          }}
        />
        {preview ? '' : <EntryDialogues sdk={sdk} ref={entryDialoguesRef} />}
        {preview ? (
          ''
        ) : (
          <ActionPanel
            sdk={sdk}
            entry={widget}
            rightItems={[
              <Button
                key="fullscreen"
                title="На весь экран"
                type="text"
                icon={<FullscreenOutlined />}
                onClick={toggleFullscreen}
              >
                На весь экран
              </Button>,
              <div
                className={`pseudosave-btn${entryLocked ? ' active' : ''}`}
                onClick={this.openNoRightsDialog}
              ></div>,
              <Space>
                <Dropdown.Button
                  type="primary"
                  menu={{ items: saveItems }}
                  disabled={isSaveBtnDisabled}
                  onClick={this.openSaveWidgetDialog}
                  trigger={['click']}
                >
                  Сохранить
                </Dropdown.Button>
              </Space>,
            ]}
          />
        )}
        <div className="columns">
          {this.props.preview ? (
            ''
          ) : (
            <div className={`column data-column${hidden}`}>
              <SectionDataset
                entryDialoguesRef={entryDialoguesRef}
                openDataset={this.handleOpenDataset}
                sdk={sdk}
              />
            </div>
          )}
          {this.props.preview ? (
            ''
          ) : (
            <div className={`column visual-column${hidden}`}>
              <SectionVisualization entryDialoguesRef={entryDialoguesRef} sdk={sdk} />
            </div>
          )}
          <div className="column preview-column">
            <SectionPreview
              entryDialoguesRef={entryDialoguesRef}
              sdk={sdk}
              onExport={onExport}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { widgetError } = this.props;

    if (widgetError) {
      return this.renderError();
    }

    return this.renderApp();
  }

  componentDidUpdate() {
    const { highchartsWidget } = this.props;

    if (highchartsWidget && highchartsWidget.chartWidth) {
      highchartsWidget.reflow();
    }
  }
}

const mapStateToProps = createStructuredSelector({
  settings: selectSettings,
  config: selectConfig,
  configType: selectConfigType,
  widget: selectWidget,
  dataset: selectDataset,
  visualization: selectVisualization,
  widgetError: selectWidgetError,
  isFullscreen: selectIsFullscreen,
  isWidgetLoading: selectIsWidgetLoading,
  isDefaultsSet: selectIsDefaultsSet,
  highchartsWidget: selectHighchartsWidget,
  widgetHash: selectWidgetHash,
  previewHash: selectPreviewHash,
});

const mapDispatchToProps = {
  fetchWidget,
  setDefaults,
  toggleFullscreen,
  requestUpdateWidget,
  receiveWidget,
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Wizard);
