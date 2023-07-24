import React from 'react';
import { Button } from 'lego-on-react';
import { DATASET_ERRORS } from '../../../../../../constants';

export function SectionDatasetError(props) {
  const {
    datasetError,
    onButtonDatasetRequestRightsClick,
    onButtonDatasetTryAgainClick,
  } = props;

  let datasetErrorText;
  if (datasetError.response) {
    datasetErrorText =
      DATASET_ERRORS[datasetError.response.status] || DATASET_ERRORS.UNKNOWN;
  } else {
    datasetErrorText = DATASET_ERRORS.UNKNOWN;
  }

  return (
    <div className="error">
      {datasetErrorText}
      {datasetErrorText === DATASET_ERRORS[403] ? (
        <div>
          <Button
            text="Запросить права"
            onClick={onButtonDatasetRequestRightsClick}
            theme="action"
            tone="default"
            view="default"
            size="s"
          />
        </div>
      ) : datasetErrorText === DATASET_ERRORS[404] ? (
        <div></div>
      ) : (
        <div>
          <Button
            text="Повторить"
            cls="btn-retry"
            onClick={onButtonDatasetTryAgainClick}
            theme="action"
            tone="default"
            view="default"
            size="s"
          />
        </div>
      )}
    </div>
  );
}
