import React, { useRef } from 'react';
import { connect } from 'react-redux';
import ChartKit from '@kamatech-data-ui/clustrum/src/components/ChartKit/ChartKit';
import { EXPORT, NEW_WINDOW } from '@kamatech-data-ui/chartkit/lib/extensions/menu-items';
import { selectConfig, selectConfigType, selectPreviewEntryId } from '../../../../../reducers/preview';
import { selectDatasetError } from '../../../../../reducers/dataset';
import { selectWidget } from '../../../../../reducers/widget';
import { setHighchartsWidget } from '../../../../../actions';
import { createStructuredSelector } from 'reselect';
import { Empty } from 'antd';
import { DownloadOutlined, EditOutlined, ExpandOutlined } from '@ant-design/icons';
import { SectionPreviewProps } from './types/section-preview-props';
import { goAwayLinkProps } from './types/go-away-link-props';
import { onLoadProps } from './types/on-load-props';
import { ExportWidgetOptions } from 'src/services/dashboard/export/export-widget/types/ExportWidgetOptions';
import './section-preview.css';

function goAwayLink({ loadedData, propsData, urlPostfix = '', idPrefix = '' }: goAwayLinkProps): string {
  let url = window.DL.endpoints.wizard + urlPostfix;
  url += loadedData.entryId || propsData.id ? idPrefix + (loadedData.entryId || propsData.id) : propsData.source;

  let query = new URLSearchParams({ ...propsData.params }).toString();
  query = query ? '?' + query : query;

  return url + query;
}

const EDIT = {
  title: 'Редактировать',
  icon: <EditOutlined />,
  isVisible: (): boolean => true,
  action: ({ loadedData = { entryId: null }, propsData }: goAwayLinkProps): Window | null =>
    window.open(goAwayLink({ loadedData, propsData, idPrefix: '/' })),
};

function SectionPreview({
  configType,
  config,
  widget,
  previewEntryId,
  datasetError,
  setHighchartsWidget,
  onExport,
}: SectionPreviewProps): JSX.Element {
  const exportWidget = useRef<(runPayload: { id: string }, options: ExportWidgetOptions) => void>();

  exportWidget.current = (runPayload: { id: string }, options: ExportWidgetOptions): void => {
    onExport(runPayload.id, widget?.name ?? '', options);
  };

  const renderChartkit = (): JSX.Element | null => {
    if (datasetError) {
      return (
        <div className="preview-chartkit__dataset-error-container">
          <Empty description={<span>Невозможно отобразить график</span>} />
        </div>
      );
    }

    if (previewEntryId || (config && configType)) {
      let LINK_NEW_WINDOW;

      if (window.DL.installationType === 'external') {
        LINK_NEW_WINDOW = {
          title: 'Открыть в новой вкладке',
          icon: <ExpandOutlined width="20" />,
          isVisible: () => true,
          action: ({ loadedData, propsData }: goAwayLinkProps) =>
            window.open(goAwayLink({ loadedData, propsData, urlPostfix: '/preview', idPrefix: '/' })),
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

      EXPORT.icon = <DownloadOutlined />;
      const menuItems = [EXPORT, LINK_NEW_WINDOW];

      if (previewEntryId) {
        menuItems.push(EDIT);
      }

      return (
        <ChartKit
          id={previewEntryId ? previewEntryId : widget ? widget.entryId : ''}
          editMode={editMode}
          onLoad={(result: onLoadProps): void => {
            setHighchartsWidget({
              highchartsWidget: result.data.widget,
            });

            if (result.status === 'success') {
              const event = new Event('chart-preview.done', { bubbles: true, cancelable: true });

              document.querySelector('.preview-container__preview-chartkit')?.dispatchEvent(event);
            } else {
              const event = new Event('chart-preview.error', { bubbles: true, cancelable: true });

              document.querySelector('.preview-container__preview-chartkit')?.dispatchEvent(event);
            }
          }}
          menu={menuItems}
          exportWidget={exportWidget.current}
        />
      );
    }
    return null;
  };

  return <div className="preview-chartkit">{renderChartkit()}</div>;
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
