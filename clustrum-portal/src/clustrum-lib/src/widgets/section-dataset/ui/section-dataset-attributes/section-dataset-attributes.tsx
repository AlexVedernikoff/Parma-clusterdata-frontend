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
    onChangeSearchInputField,
  } = props;

  const datasetNames = [
    ...new Set(
      [...dimensions.sort((a, b) => a.datasetName.localeCompare(b.datasetName))].map(
        d => d.datasetName,
      ),
    ),
  ];

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChangeSearchInputField(e.currentTarget.value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles['search-block']}>
        <Input
          className={styles['search-block__input']}
          placeholder="Поиск"
          prefix={<SearchOutlined style={{ width: 16 }} />}
          value={searchPhrase}
          onChange={onInputChange}
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
