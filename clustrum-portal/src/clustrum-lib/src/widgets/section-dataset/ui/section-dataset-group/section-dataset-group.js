import React from 'react';
import { DndContainer } from '@lib-shared/ui/drag-n-drop';
import { ITEM_TYPES } from '../../../../../../constants';
import './section-dataset-group.css';

export function SectionDatasetGroup(props) {
  const {
    title,
    datasetNames,
    indicators,
    filteredIndicators,
    renderDatasetItem,
  } = props;

  return (
    <div className="subcontainer">
      <div className="subheader">
        <span>{title}</span>
      </div>
      {datasetNames.map(value => {
        {
          let items = indicators.filter(indicator => indicator.datasetName === value);
          if (
            items.length > 0 ||
            (filteredIndicators &&
              filteredIndicators.filter(indicator => indicator.datasetName === value)
                .length > 0)
          ) {
            return (
              <DndContainer
                id="dimensions-container"
                noRemove={true}
                title={value}
                items={
                  (filteredIndicators &&
                    filteredIndicators.length &&
                    filteredIndicators.filter(
                      indicator => indicator.datasetName === value,
                    )) ||
                  items
                }
                allowedTypes={ITEM_TYPES.DIMENSIONS}
                wrapTo={renderDatasetItem}
              />
            );
          }
        }
      })}
    </div>
  );
}
