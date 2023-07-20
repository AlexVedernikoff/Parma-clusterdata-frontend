import React, { ReactElement } from 'react';
import { DndContainer } from '@lib-shared/ui/drag-n-drop';
import { DndItemProps } from '@lib-shared/ui/drag-n-drop/types';
import { ITEM_TYPES } from '../../../../../../constants';
import { SectionDatasetGroupProps } from '../../types';
import { SectionDatasetItem } from '../section-dataset-item';
import styles from './section-dataset-group.module.css';

const ITEM_SIZE = {
  height: 40,
  margin: 4,
};

export function SectionDatasetGroup(props: SectionDatasetGroupProps): ReactElement {
  const { id, title, datasetNames, indicators } = props;

  const renderDatasetItem = (datasetItemProps: DndItemProps): JSX.Element => (
    <SectionDatasetItem
      className={datasetItemProps.className}
      itemData={datasetItemProps.itemData}
    />
  );

  return (
    <div className={styles['group-block']}>
      <div className={styles.header}>{title}</div>
      {datasetNames.map(datasetName => {
        {
          const items = indicators.filter(
            indicator => indicator.datasetName === datasetName,
          );
          return (
            items.length > 0 && (
              <div className={styles['dnd-group']}>
                <div className={styles.subheader}>{datasetName}</div>
                <DndContainer
                  isNeedSwap
                  id={id}
                  items={items}
                  allowedTypes={ITEM_TYPES.DIMENSIONS}
                  itemSize={ITEM_SIZE}
                  wrapTo={renderDatasetItem}
                />
              </div>
            )
          );
        }
      })}
    </div>
  );
}
