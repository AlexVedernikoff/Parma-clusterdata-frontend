import React, { ReactElement } from 'react';
import { Button } from 'antd';
import { ErrorCode } from '@lib-shared/config';
import { DatasetErrorMessage } from '../../lib/constants';
import { SectionDatasetErrorProps } from '../../types';
import styles from './section-dataset-error.module.css';

export function SectionDatasetError(props: SectionDatasetErrorProps): ReactElement {
  const { errorStatus, onRequestDatasetRights, onLoadDatasetAgain } = props;

  const datasetErrorText =
    (errorStatus &&
      DatasetErrorMessage[ErrorCode[errorStatus] as keyof typeof DatasetErrorMessage]) ||
    DatasetErrorMessage.Unknown;

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
