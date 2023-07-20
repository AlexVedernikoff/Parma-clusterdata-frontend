import React, { useRef } from 'react';
import { connect } from 'react-redux';
import ChartKit from '@kamatech-data-ui/clustrum/src/components/ChartKit/ChartKit';
import { EXPORT } from '@kamatech-data-ui/chartkit/lib/extensions/menu-items';
import {
  selectConfig,
  selectConfigType,
  selectPreviewEntryId,
} from '../../../../../reducers/preview';
import { selectDatasetError } from '../../../../../reducers/dataset';
import { selectWidget } from '../../../../../reducers/widget';
import { setHighchartsWidget } from '../../../../../actions';
import { createStructuredSelector } from 'reselect';
import { Empty } from 'antd';
import { DownloadOutlined, EditOutlined } from '@ant-design/icons';
import {
  SectionPreviewProps,
  GoAwayLinkProps,
  OnLoadProps,
  ExportWidgetOptions,
} from '../types/index';
import styles from './section-preview.module.css';
import { goAwayLink } from '@lib-shared/lib/utils/go-away-link';

const EDIT = {
  title: 'Редактировать',
  icon: <EditOutlined />,
  isVisible: (): boolean => true,
  action: ({
    loadedData = { entryId: null },
    propsData,
  }: GoAwayLinkProps): Window | null =>
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
  const exportWidget = useRef<
    (runPayload: { id: string }, options: ExportWidgetOptions) => void
  >();

  exportWidget.current = (
    runPayload: { id: string },
    options: ExportWidgetOptions,
  ): void => {
    onExport(runPayload.id, widget?.name ?? '', options);
  };

  const renderChartKit = (): JSX.Element | null => {
    if (datasetError) {
      return (
        <div className={styles['preview-chartkit__dataset-error-container']}>
          <Empty description={<span>Невозможно отобразить график</span>} />
        </div>
      );
    }

    if (!(previewEntryId || (config && configType))) {
      return null;
    }

    let editMode;
    if (config && configType) {
      editMode = {
        config,
        type: configType,
      };
    }

    EXPORT.icon = <DownloadOutlined />;
    const menuItems = [];

    if (previewEntryId) {
      menuItems.push(EDIT, EXPORT);
    } else {
      menuItems.push(EXPORT);
    }

    return (
      <ChartKit
        id={previewEntryId ? previewEntryId : widget ? widget.entryId : ''}
        editMode={editMode}
        onLoad={(result: OnLoadProps): void => {
          setHighchartsWidget({
            highchartsWidget: result.data.widget,
          });
          createEvent(result);
        }}
        menu={menuItems}
        exportWidget={exportWidget.current}
      />
    );
  };

  return <div className={styles['preview-chartkit']}>{renderChartKit()}</div>;
}

const createEvent = (result: OnLoadProps): void => {
  const eventName =
    result.status === 'success' ? 'chart-preview.done' : 'chart-preview.error';
  const event = new Event(eventName, { bubbles: true, cancelable: true });
  document.querySelector('.preview-container__preview-chartkit')?.dispatchEvent(event);
};

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

export const ConnectedSectionPreview = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SectionPreview);
