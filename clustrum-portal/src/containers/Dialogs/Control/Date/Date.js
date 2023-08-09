import React from 'react';
import PropTypes from 'prop-types';

import CheckBox from '../Switchers/CheckBox';
import Acceptable from './Acceptable/Acceptable';
import Default from './Default/Default';
import { ControlSourceType } from '@lib-shared/types';

import { CONTROL_SOURCE_TYPE } from '../../../../constants/constants';

function Date(props) {
  const { sourceType, acceptableValues, defaultValue, isRange, onChange } = props;
  return (
    <React.Fragment>
      {sourceType === ControlSourceType.Manual && (
        <Acceptable acceptableValues={acceptableValues} onApply={onChange} />
      )}
      <CheckBox
        text="Диапазон"
        checked={isRange}
        onChange={() => onChange({ isRange: !isRange, defaultValue: undefined })}
      />
      <Default
        sourceType={sourceType}
        acceptableValues={acceptableValues}
        defaultValue={defaultValue}
        isRange={isRange}
        onApply={onChange}
      />
    </React.Fragment>
  );
}

Date.propTypes = {
  sourceType: PropTypes.oneOf(Object.values(CONTROL_SOURCE_TYPE)).isRequired,
  acceptableValues: PropTypes.object,
  defaultValue: PropTypes.object,
  isRange: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default Date;
