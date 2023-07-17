/* eslint-disable @typescript-eslint/no-empty-function */
import React, { ReactElement } from 'react';
import { DndContainer } from '@lib-shared/ui/drag-n-drop';
import { ITEM_TYPES } from '../../../../../../constants';
import { SectionDatasetGroupProps } from '../../types';
import styles from './section-dataset-group.module.css';

export function SectionDatasetGroup(props: SectionDatasetGroupProps): ReactElement {
  const { id, title, datasetNames, indicators, renderDatasetItem } = props;

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
              <React.Fragment>
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
              </React.Fragment>
            )
          );
        }
      })}
    </div>
  );
}
