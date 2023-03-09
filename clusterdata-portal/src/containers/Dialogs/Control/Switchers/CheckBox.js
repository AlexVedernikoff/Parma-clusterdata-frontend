import React from 'react';
import PropTypes from 'prop-types';

import {CheckBox as LegoCheckBox} from 'lego-on-react';

import withWrap from '../withWrap/withWrap';

function CheckBox(props) {
    return (
        <LegoCheckBox
            theme="normal"
            view="default"
            tone="default"
            size="s"
            checked={props.checked}
            onChange={props.onChange}
        >
            {props.text}
        </LegoCheckBox>
    );
}

CheckBox.propTypes = {
    text: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired
};

export default withWrap(CheckBox);
