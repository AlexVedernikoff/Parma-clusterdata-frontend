import React, { Component } from 'react';

import Icon from '@kamatech-data-ui/common/src/components/Icon/Icon';

import { connect } from 'react-redux';

import ChartKit from '@kamatech-data-ui/clustrum/src/components/ChartKit/ChartKit';

import iconFullscreen from 'icons/fullscreen.svg';
import iconPencil from 'icons/pencil.svg';
import iconPreviewDatasetError from 'icons/preview-dataset-error.svg';

import { EXPORT, NEW_WINDOW } from '@kamatech-data-ui/chartkit/lib/extensions/menu-items';

import { selectConfig, selectConfigType, selectPreviewEntryId } from '../../../reducers/preview';

import { selectDatasetError } from '../../../reducers/dataset';

import { selectWidget } from '../../../reducers/widget';

import { setHighchartsWidget } from '../../../actions';

import { createStructuredSelector } from 'reselect';

import { exportWidget } from '../model/exportWidget';

function goAwayLink({ loadedData, propsData }, { extraParams = {}, urlPostfix = '', idPrefix = '' }) {
  let url = window.DL.endpoints.wizard + urlPostfix;

  url += loadedData.entryId || propsData.id ? idPrefix + (loadedData.entryId || propsData.id) : propsData.source;

  let query = new URLSearchParams({ ...propsData.params, ...extraParams }).toString();
  query = query ? '?' + query : query;

  return url + query;
}

window.DL.chartkit.requestDecorator = request => {
  if (window.DL.currentCloudFolderId) {
    request.headers['x-yacloud-folderid'] = window.DL.currentCloudFolderId;
  }

  const csrfTokenElement = document.getElementsByName('csrf-token')[0];

  if (csrfTokenElement) {
    request.headers['X-CSRF-Token'] = csrfTokenElement.content;
  }

  return request;
};

const EDIT = {
  title: 'Редактировать',
  icon: <Icon size="20" data={iconPencil} />,
  isVisible: () => true,
  action: ({ loadedData = {}, propsData }) => window.open(goAwayLink({ loadedData, propsData }, { idPrefix: '/' })),
};

class SectionPreview extends Component {
  #exportWidget = (runPayload, options) => {
    const { widget } = this.props;

    exportWidget(runPayload.id, widget?.name ?? '', options);
  };

  renderChartkit() {
    const { configType, config, widget, previewEntryId, setHighchartsWidget, datasetError } = this.props;

    if (datasetError) {
      return (
        <div className="dataset-error-container">
          <Icon width="236" data={iconPreviewDatasetError} />
          <span>Невозможно отобразить график</span>
        </div>
      );
    }

    if (previewEntryId || (config && configType)) {
      let LINK_NEW_WINDOW;

      if (DL.installationType === 'external') {
        LINK_NEW_WINDOW = {
          title: 'Открыть в новой вкладке',
          icon: <Icon width="20" data={iconFullscreen} />,
          isVisible: () => true,
          action: ({ loadedData, propsData }) =>
            window.open(goAwayLink({ loadedData, propsData }, { urlPostfix: '/preview', idPrefix: '/' })),
        };
      } else {
        LINK_NEW_WINDOW = NEW_WINDOW;
      }

      let editMode;
      if (config && configType) {
        editMode = {
          config,
          type: configType,
        };
      }

      const menuItems = [EXPORT, LINK_NEW_WINDOW];

      if (previewEntryId) {
        menuItems.push(EDIT);
      }

      return (
        <ChartKit
          id={previewEntryId ? previewEntryId : widget ? widget.entryId : ''}
          editMode={editMode}
          onLoad={result => {
            setHighchartsWidget({
              highchartsWidget: result.data.widget,
            });

            if (result.status === 'success') {
              const event = document.createEvent('HTMLEvents');

              event.initEvent('chart-preview.done', true, true);
              document.querySelector('.preview-chartkit').dispatchEvent(event);
            } else {
              const event = document.createEvent('HTMLEvents');

              event.initEvent('chart-preview.error', true, true);
              document.querySelector('.preview-chartkit').dispatchEvent(event);
            }
          }}
          menu={menuItems}
          exportWidget={this.#exportWidget}
        />
      );
    }
  }

  render() {
    return (
      <div className="container preview-container">
        <div className="preview-chartkit">{this.renderChartkit()}</div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  datasetError: selectDatasetError,
  configType: selectConfigType,
  config: selectConfig,
  widget: selectWidget,
  previewEntryId: selectPreviewEntryId,
});

const mapDispatchToProps = {
  setHighchartsWidget,
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionPreview);
