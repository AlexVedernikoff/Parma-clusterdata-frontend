import React from 'react';
import PropTypes from 'prop-types';
import { ControlSourceType } from '@clustrum-lib/shared/types';

import TextInput from '../Switchers/TextInput';

import { CONTROL_SOURCE_TYPE } from '../../../../constants/constants';

function Input(props) {
  return (
    <React.Fragment>
      {props.sourceType === ControlSourceType.Manual && <div />}
      <TextInput
        title="Значение по умолчанию"
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
