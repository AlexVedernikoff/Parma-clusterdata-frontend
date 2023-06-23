import React from 'react';
import PropTypes from 'prop-types';

import DatasetEditor from '../DatasetEditor/DatasetEditor';
import { TAB_DATA, TAB_DATASET, DATASET_TABS } from '../../constants';

function DatasetTabs(props) {
  const {
    tab,
    sdk,
    datasetId,
    searchKeyword,
    forwardedRef,
    datasetErrorDialogRef,
  } = props;

  switch (tab) {
    case TAB_DATA:
      return null;
    case TAB_DATASET:
    default:
      return (
        <DatasetEditor
          ref={forwardedRef}
          datasetErrorDialogRef={datasetErrorDialogRef}
          sdk={sdk}
          datasetId={datasetId}
          searchKeyword={searchKeyword}
        />
      );
  }
}

DatasetTabs.propTypes = {
  tab: PropTypes.oneOf(DATASET_TABS),
  sdk: PropTypes.object.isRequired,
  datasetId: PropTypes.string,
  searchKeyword: PropTypes.string,
  forwardedRef: PropTypes.object,
  datasetErrorDialogRef: PropTypes.object,
};

function ForwardedDatasetTabs(props, ref) {
  return <DatasetTabs {...props} forwardedRef={ref} />;
}

ForwardedDatasetTabs.displayName = 'DatasetTabs';

export default React.forwardRef(ForwardedDatasetTabs);
