import React from 'react';
import PropTypes from 'prop-types';

import TextInput from '../Switchers/TextInput';

import { CONTROL_SOURCE_TYPE } from '../../../../constants/constants';

import { i18n } from '@parma-data-ui/clusterdata';

function Input(props) {
  return (
    <React.Fragment>
      {props.sourceType === CONTROL_SOURCE_TYPE.MANUAL && <div />}
      <TextInput
        title={i18n('dash.control-dialog.edit', 'field_default-value')}
        text={props.defaultValue}
        onChange={defaultValue => props.onChange({ defaultValue })}
      />
    </React.Fragment>
  );
}

Input.propTypes = {
  sourceType: PropTypes.oneOf(Object.values(CONTROL_SOURCE_TYPE)).isRequired,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default Input;
