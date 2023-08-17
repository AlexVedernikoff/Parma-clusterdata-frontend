import React, { ReactElement } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
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
    onChangeSearchInput,
  } = props;

  const datasetNames = [
    ...new Set(
      dimensions
        .map(dimension => dimension.datasetName)
        .sort((a, b) => a.localeCompare(b)),
    ),
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChangeSearchInput(e.currentTarget.value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles['search-block']}>
        <Input
          placeholder="Поиск"
          prefix={<SearchOutlined className={styles['search-block__icon']} />}
          value={searchPhrase}
          onChange={handleInputChange}
        />
      </div>
      <SectionDatasetGroup
        id="dimensions-container"
        title="Измерения"
        datasetNames={datasetNames}
        indicators={filteredDimensions || dimensions}
      />
      <SectionDatasetGroup
        id="measures-container"
        title="Показатели"
        datasetNames={datasetNames}
        indicators={filteredMeasures || measures}
      />
    </div>
  );
}
