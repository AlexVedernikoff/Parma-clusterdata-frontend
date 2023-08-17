import React, { ReactElement } from 'react';
import { WIZARD_ITEM_TYPES } from '@lib-shared/config/wizard-item-types';
import { DndContainer } from '@lib-shared/ui/drag-n-drop';
import { DndItemData, DndItemProps } from '@lib-shared/ui/drag-n-drop/types';
import { SectionDatasetGroupProps } from '../../types';
import { SectionDatasetItem } from '../section-dataset-item';
import { DATASET_DND_ITEM_SIZE } from '../../lib/constants';
import styles from './section-dataset-group.module.css';

export function SectionDatasetGroup(props: SectionDatasetGroupProps): ReactElement {
  const { id, title, datasetNames, indicators } = props;

  const renderDatasetItem = (
    datasetItemProps: DndItemProps<DndItemData>,
  ): ReactElement => (
    <SectionDatasetItem
      className={datasetItemProps.className}
      itemData={datasetItemProps.itemData}
    />
  );

  return (
    <div className={styles['group-block']}>
      <div className={styles.header}>{title}</div>
      {datasetNames.map(datasetName => {
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
                allowedTypes={WIZARD_ITEM_TYPES.DIMENSIONS}
                itemSize={DATASET_DND_ITEM_SIZE}
                wrapTo={renderDatasetItem}
              />
            </div>
          )
        );
      })}
    </div>
  );
}
