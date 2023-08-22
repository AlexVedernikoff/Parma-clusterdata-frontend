import React, { useRef } from 'react';
import { connect } from 'react-redux';
//TODO Исправить импорты после рефакторинга контейнера виджетов 683371
import ChartKit from '@kamatech-data-ui/clustrum/src/components/ChartKit/ChartKit';
import { EXPORT } from '@kamatech-data-ui/chartkit/lib/extensions/menu-items';

import {
  selectConfig,
  selectConfigType,
  selectPreviewEntryId,
} from '../../../../../reducers/preview';
import { selectDatasetError } from '../../../../../reducers/dataset';
import { selectWidget } from '../../../../../reducers/widget';
import { setWidget } from '../../../../../actions';
import { createStructuredSelector } from 'reselect';
import { Empty } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { SectionPreviewProps, OnLoadProps, ExportWidgetOptions } from '../types';
import styles from './section-preview.module.css';

const handleLoad = (result: OnLoadProps, setWidget: (widget: any) => void): void => {
  setWidget({
    widget: result.data.widget,
  });
};

function SectionPreviewContainer(props: SectionPreviewProps): JSX.Element | null {
  const { configType, config, widget, datasetError, onExport, setWidget } = props;

  const exportWidget = useRef<
    (runPayload: { id: string }, options: ExportWidgetOptions) => void
  >();

  exportWidget.current = (
    runPayload: { id: string },
    options: ExportWidgetOptions,
  ): void => {
    onExport(runPayload.id, widget?.name ?? '', options);
  };

  if (datasetError) {
    return (
      <div className={styles['preview-chartkit__dataset-error-container']}>
        <Empty description={<span>Невозможно отобразить график</span>} />
      </div>
    );
  }

  if (!(config && configType)) {
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
  const menuItems = [EXPORT];

  return (
    <div className={styles['preview-chartkit']}>
      <ChartKit
        id={widget ? widget.entryId : ''}
        editMode={editMode}
        onLoad={(result: OnLoadProps): void => handleLoad(result, setWidget)}
        menu={menuItems}
        exportWidget={exportWidget.current}
      />
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  datasetError: selectDatasetError,
  configType: selectConfigType,
  config: selectConfig,
  widget: selectWidget,
  previewEntryId: selectPreviewEntryId,
});

const mapDispatchToProps = {
  setWidget: setWidget,
};

export const SectionPreview = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SectionPreviewContainer);
