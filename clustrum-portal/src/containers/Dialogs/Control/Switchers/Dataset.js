import React from 'react';
import PropTypes from 'prop-types';

import DropdownNavigation from '../../../DropdownNavigation/DropdownNavigation';
import withWrap from '../withWrap/withWrap';

import { ENTRY_SCOPE } from '../../../../constants/constants';

function Dataset({
  datasetId,
  onClick,
  parentBlock = blockName => {
    return blockName;
  },
}) {
  return (
    <DropdownNavigation
      size="s"
      entryId={datasetId}
      clickableScope={ENTRY_SCOPE.DATASET}
      onClick={({ entry: { entryId } }) => onClick(entryId)}
    />
  );
}

Dataset.propTypes = {
  datasetId: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default withWrap(Dataset);
