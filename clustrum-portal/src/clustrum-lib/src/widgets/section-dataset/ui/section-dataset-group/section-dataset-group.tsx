/* eslint-disable @typescript-eslint/no-empty-function */
import React, { ReactElement } from 'react';
import { DndContainer } from '@lib-shared/ui/drag-n-drop';
import { DndItemProps } from '@lib-shared/ui/drag-n-drop/types';
import { ITEM_TYPES } from '../../../../../../constants';
import { SectionDatasetGroupProps } from '../../types';
import { SectionDatasetItem } from '../section-dataset-item';
import styles from './section-dataset-group.module.css';

export function SectionDatasetGroup(props: SectionDatasetGroupProps): ReactElement {
  const { id, title, datasetNames, indicators } = props;

  // TODO исправить тип, когда он будет исправлен в dnd
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderDatasetItem = (datasetItemProps: DndItemProps): any => (
    <SectionDatasetItem
      className={datasetItemProps.className}
      item={datasetItemProps.item}
    />
  );

  return (
    <div className={styles.group_block}>
      <div className={styles.header}>{title}</div>
      {datasetNames.map(datasetName => {
        {
          const items = indicators.filter(
            indicator => indicator.datasetName === datasetName,
          );
          return (
            items.length > 0 && (
              <div className={styles.dnd_group}>
                <div className={styles.subheader}>{datasetName}</div>
                <DndContainer
                  noRemove
                  id={id}
                  items={items}
                  allowedTypes={ITEM_TYPES.DIMENSIONS}
                  wrapTo={renderDatasetItem}
                  // TODO
                  onItemClick={(): void => {}}
                  onUpdate={(): void => {}}
                />
              </div>
            )
          );
        }
      })}
    </div>
  );
}
