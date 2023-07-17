import React, { ReactElement } from 'react';
import { Button } from 'antd';
import { DATASET_ERRORS } from '../../../../../../constants';
import { SectionDatasetErrorProps } from '../../types';
import styles from './section-dataset-error.module.css';

export function SectionDatasetError(props: SectionDatasetErrorProps): ReactElement {
  const { errorStatus, onRequestDatasetRights, onLoadDatasetAgain } = props;

  const datasetErrorText =
    (errorStatus && DATASET_ERRORS[errorStatus]) || DATASET_ERRORS.UNKNOWN;

  return (
    <div className={styles.error_block}>
      <div className={styles.error_text}>{datasetErrorText}</div>
      {errorStatus === 403 && (
        <Button onClick={onRequestDatasetRights}>Запросить права</Button>
      )}
      {errorStatus !== 403 && errorStatus !== 404 && (
        <Button className="btn-retry" type="primary" onClick={onLoadDatasetAgain}>
          Повторить
        </Button>
      )}
    </div>
  );
}
