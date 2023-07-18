import React, { ReactElement } from 'react';
// TODO: убрать зависимость после её переписывания
// eslint-disable-next-line
// @ts-ignore
import { Loader } from '@kamatech-data-ui/common/src';
import { SectionDatasetAttributes } from '../section-dataset-attributes';
import { SectionDatasetError } from '../section-dataset-error';
import { SectionDatasetMainProps } from '@lib-widgets/section-dataset/types';
import styles from './section-dataset-main.module.css';

export function SectionDatasetMain(props: SectionDatasetMainProps): ReactElement {
  const {
    isDatasetLoading,
    isDatasetLoaded,
    datasetError,
    onRequestDatasetRights,
    onLoadDatasetAgain,
    ...attributesProps
  } = props;

  if (isDatasetLoading) {
    return (
      <div className={styles.loader_container}>
        <Loader size={'l'} />
      </div>
    );
  }

  if (datasetError) {
    return (
      <SectionDatasetError
        errorStatus={datasetError.response?.status}
        onRequestDatasetRights={onRequestDatasetRights}
        onLoadDatasetAgain={onLoadDatasetAgain}
      />
    );
  }

  if (isDatasetLoaded) {
    return <SectionDatasetAttributes {...attributesProps} />;
  }

  return <div className={styles.blank}>Для начала работы выберите набор данных</div>;
}
