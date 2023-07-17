import React, { ReactElement } from 'react';
// TODO поменять импорт после переписывания SearchInput
import SearchInput from '@lib-modules/legacy-wizard/components/SearchInput/SearchInput';
import { SectionDatasetGroup } from '../section-dataset-group';
import { SectionDatasetAttributesProps } from '../../types';
import styles from './section-dataset-attributes.module.css';

export function SectionDatasetAttributes(
  props: SectionDatasetAttributesProps,
): ReactElement {
  const {
    filteredMeasures,
    filteredDimensions,
    searchPhrase,
    dimensions,
    measures,
    onChangeSearchInputField,
    renderDatasetItem,
  } = props;

  const datasetNames = [
    ...new Set(
      [...dimensions.sort((a, b) => a.datasetName.localeCompare(b.datasetName))].map(
        d => d.datasetName,
      ),
    ),
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.search_block}>
        <SearchInput
          hasClear
          borderDisabled
          className={styles.search_input}
          text={searchPhrase}
          placeholder="Поиск"
          size="s"
          onChange={onChangeSearchInputField}
        />
      </div>
      <SectionDatasetGroup
        id="dimensions-container"
        title="Измерения"
        datasetNames={datasetNames}
        indicators={filteredDimensions || dimensions}
        renderDatasetItem={renderDatasetItem}
      />
      <SectionDatasetGroup
        id="measures-container"
        title="Показатели"
        datasetNames={datasetNames}
        indicators={filteredMeasures || measures}
        renderDatasetItem={renderDatasetItem}
      />
    </div>
  );
}
