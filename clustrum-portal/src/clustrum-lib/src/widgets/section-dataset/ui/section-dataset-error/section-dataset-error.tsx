import React, { ReactElement } from 'react';
import { Button } from 'antd';
import { ErrorCode } from '@lib-shared/types';
import { DATASET_ERROR_MESSAGES } from '../../lib/constants';
import { SectionDatasetErrorProps } from '../../types';
import styles from './section-dataset-error.module.css';

export function SectionDatasetError(props: SectionDatasetErrorProps): ReactElement {
  const { errorStatus, onRequestDatasetRights, onLoadDatasetAgain } = props;

  const datasetErrorText =
    (errorStatus && DATASET_ERROR_MESSAGES[errorStatus]) ||
    DATASET_ERROR_MESSAGES.UNKNOWN;

  return (
    <div className={styles['error-block']}>
      <div className={styles['error-block__text']}>{datasetErrorText}</div>
      {errorStatus == ErrorCode.Forbidden && (
        <Button onClick={onRequestDatasetRights}>Запросить права</Button>
      )}
      {errorStatus !== ErrorCode.Forbidden && errorStatus !== ErrorCode.NotFound && (
        <Button type="primary" onClick={onLoadDatasetAgain}>
          Повторить
        </Button>
      )}
    </div>
  );
}
