import React from 'react';
import PropTypes from 'prop-types';

import { TextInput as LegoTextInput } from 'lego-on-react';

import withWrap from '../withWrap/withWrap';

function Button(props) {
  return (
    <LegoTextInput theme='normal' view='default' tone='default' size='s' text={props.text} onChange={props.onChange} />
  );
}

Button.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default withWrap(Button);
