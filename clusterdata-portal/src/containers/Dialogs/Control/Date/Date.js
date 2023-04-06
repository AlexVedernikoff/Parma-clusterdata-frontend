import React from 'react';
import PropTypes from 'prop-types';

import CheckBox from '../Switchers/CheckBox';
import Acceptable from './Acceptable/Acceptable';
import Default from './Default/Default';

import { CONTROL_SOURCE_TYPE } from '../../../../constants/constants';

import { i18n } from '@kamatech-data-ui/clusterdata';

function Date(props) {
  const { sourceType, acceptableValues, defaultValue, isRange, onChange } = props;
  return (
    <React.Fragment>
      {sourceType === CONTROL_SOURCE_TYPE.MANUAL && (
        <Acceptable acceptableValues={acceptableValues} onApply={onChange} />
      )}
      <CheckBox
        text={i18n('dash.control-dialog.edit', 'field_date-range')}
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
