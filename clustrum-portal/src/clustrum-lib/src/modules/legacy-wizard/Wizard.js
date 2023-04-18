import block from 'bem-cn-lite';

import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Icon from '@kamatech-data-ui/common/src/components/Icon/Icon';

import iconFullscreen from 'icons/fullscreen.svg';
import iconDisclose from 'icons/disclose.svg';
import iconLock from 'icons/lock.svg';

import { Button, Dropdown, Popup, Menu } from 'lego-on-react';

import { ErrorContent, EntryDialogues, ActionPanel } from '@kamatech-data-ui/clustrum';

import Toaster from '@kamatech-data-ui/common/src/components/Toaster';

import SectionDataset from './SectionDataset/SectionDataset';
import SectionVisualization from './SectionVisualization/SectionVisualization';
import SectionPreview from './SectionPreview/SectionPreview';

import DialogNoRights from './components/Dialogs/DialogNoRights';

import { Loader } from '@kamatech-data-ui/common/src';

import { createStructuredSelector } from 'reselect';

import { selectDataset } from '../../../../reducers/dataset';

import { selectVisualization } from '../../../../reducers/visualization';

import { selectSettings, selectIsFullscreen, selectIsDefaultsSet } from '../../../../reducers/settings';

import { selectIsWidgetLoading, selectWidgetError, selectWidget, selectWidgetHash } from '../../../../reducers/widget';

import {
  selectConfig,
  selectConfigType,
  selectHighchartsWidget,
  selectPreviewHash,
} from '../../../../reducers/preview';

import { fetchWidget, setDefaults, toggleFullscreen, requestUpdateWidget, receiveWidget } from '../../../../actions';

import { getNavigationPathFromKey } from '../../../../helpers/utils-dash';
import PageHead from '../../../../components/PageHeader/PageHeader';

// import './Wizard.scss';

const b = block('wizard');

class Wizard extends Component {
  static propTypes = {
    sdk: PropTypes.object,
    entryId: PropTypes.string,
    onSavingStart: PropTypes.func,
    onSavingEnd: PropTypes.func,
  };

  entryDialoguesRef = React.createRef();

  constructor(props) {
    super(props);

    const { isDefaultsSet, setDefaults, preview, sdk, entryId } = props;

    if (!isDefaultsSet || entryId) {
      setDefaults({ sdk, preview, entryId });
    }

    this.toaster = new Toaster();

    this.state = {
      copyTooltipVisible: false,
      dialogNoRightsVisible: false,
    };
  }

  openSaveAsWidgetDialog = async () => {
    const { config, dataset, visualization, defaultPath, receiveWidget } = this.props;

    const labelVisualization = {
      'label_visualization-scatter': 'Точечная  диаграмма',
      'label_visualization-treemap': 'Древовидная диаграмма',
      'label_visualization-types-all': 'Все',
      'label_visualization-types-column': 'Столбчатые',
      'label_visualization-types-line': 'Графики',
      'label_visualization-types-pie': 'Круговые',
      'label_visualization-types-table': 'Таблицы',
    };

    const result = await this.entryDialoguesRef.current.openDialog({
      dialog: 'save_widget',
      dialogProps: {
        path: `${getNavigationPathFromKey(dataset.key)}`,
        widgetName: `${dataset.name} — ${labelVisualization[visualization.name]}`,
        widgetData: config.shared,
        title: 'Сохранить чарт',
        onNotify: ({ error, message, type }) => {
          if (error && error.response && error.response.status === 400) {
            this.toaster.createToast({
              title: 'Диаграмма с таким именем уже существует',
              name: 'WIZARD',
              type: 'error',
              allowAutoHiding: true,
            });
          }
        },
      },
    });

    if (!result || result.status === 'close') {
      return;
    }

    receiveWidget(result);
  };

  openSaveWidgetDialog = async () => {
    const { widget, sdk, config, requestUpdateWidget, onSavingStart, onSavingEnd } = this.props;

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

  renderApp() {
    const {
      sdk,
      widget,
      config,
      configType,
      isFullscreen,
      preview,
      isWidgetLoading,
      toggleFullscreen,
      previewHash,
      widgetHash,
    } = this.props;

    const fullscreen = isFullscreen || preview ? ' fullscreen-mode' : '';
    const hidden = isFullscreen ? ' hidden' : '';
    const { entryDialoguesRef } = this;
    const widgetChanged = previewHash !== widgetHash;

    if (isWidgetLoading) {
      return (
        <div className={b('loader')}>
          <Loader size={'l'} />
        </div>
      );
    }

    let link = '';
    if (widget && widget.entryId) {
      link = `${DL.endpoints.wizard}/${widget.entryId}`;
    }

    const saveDisabled = !config || !configType || !widgetChanged;
    const saveMoreDisabled = !config || !configType;

    const entryLocked = widget && widget.editable === false;

    return (
      <div className={`${b()}${fullscreen}`}>
        <PageHead title={widget.name} />
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
                cls={b('fullscreen-btn')}
                theme="flat"
                size="n"
                view="default"
                tone="default"
                text="На весь экран"
                iconLeft={<Icon data={iconFullscreen} width="24" />}
                onClick={toggleFullscreen}
              />,
              <Button
                disabled={saveDisabled}
                cls={b('save-btn')}
                key="save-dataset"
                theme="action"
                size="n"
                view="default"
                tone="default"
                text="Сохранить"
                iconLeft={entryLocked ? <Icon data={iconLock} width="24" /> : null}
                onClick={this.openSaveWidgetDialog}
              ></Button>,
              <div className={`pseudosave-btn${entryLocked ? ' active' : ''}`} onClick={this.openNoRightsDialog}></div>,
              <Dropdown
                disabled={saveMoreDisabled}
                cls="save-more-dropdown"
                view="default"
                tone="default"
                theme="flat"
                size="n"
                switcher={
                  <Button cls="save-more-btn" theme="action" size="n" width="max" view="default" tone="default">
                    <Icon data={iconDisclose} width="20" />
                  </Button>
                }
                popup={
                  <Popup autoclosable onOutsideClick={() => {}}>
                    <Menu theme="normal" view="default" tone="default" size="s" type="navigation">
                      <Menu.Item
                        type="option"
                        val="access"
                        onClick={() => {
                          this.openSaveAsWidgetDialog();
                        }}
                      >
                        Сохранить как
                      </Menu.Item>
                    </Menu>
                  </Popup>
                }
                hasTail
              />,
            ]}
          />
        )}
        <div className="columns">
          {this.props.preview ? (
            ''
          ) : (
            <div className={`column data-column${hidden}`}>
              <SectionDataset entryDialoguesRef={entryDialoguesRef} sdk={sdk} />
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
            <SectionPreview entryDialoguesRef={entryDialoguesRef} sdk={sdk} />
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
