import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { RadioBox } from 'lego-on-react';

import { CONTROL_SOURCE_TYPE } from '../../../../../constants/constants';

// import './SourceType.scss';

const b = block('control-switcher-source-type');

function SourceType({ type, selectedType, title, onChange }) {
  return (
    <RadioBox
      theme="normal"
      view="default"
      tone="default"
      size="s"
      name={type}
      value={selectedType}
      onChange={event => onChange(event.target.value)}
      cls={b()}
    >
      <RadioBox.Radio value={type}>{title}</RadioBox.Radio>
    </RadioBox>
  );
}

SourceType.propTypes = {
  type: PropTypes.oneOf(Object.values(CONTROL_SOURCE_TYPE)).isRequired,
  selectedType: PropTypes.oneOf(Object.values(CONTROL_SOURCE_TYPE)).isRequired,
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SourceType;
