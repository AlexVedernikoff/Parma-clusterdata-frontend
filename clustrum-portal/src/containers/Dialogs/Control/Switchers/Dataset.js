import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DropdownNavigation from '../../../DropdownNavigation/DropdownNavigation';
import withWrap from '../withWrap/withWrap';

import { ENTRY_SCOPE } from '../../../../constants/constants';

function Dataset({
  datasetId,
  onClick,
  entryId,
  sdk,
  parentBlock = blockName => {
    return blockName;
  },
}) {
  const [path, setPath] = useState();

  const updatePath = async () => {
    const { key } = await sdk.getEntry({ entryId });
    setPath(key);
  };

  useEffect(() => {
    updatePath();
  }, [entryId]);

  return (
    path && (
      <DropdownNavigation
        size="s"
        entryId={datasetId}
        path={path}
        clickableScope={ENTRY_SCOPE.DATASET}
        onClick={({ entry: { entryId } }) => onClick(entryId)}
      />
    )
  );
}

Dataset.propTypes = {
  datasetId: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default withWrap(Dataset);
