import React from 'react';
import PropTypes from 'prop-types';

import {Button as LegoButton, Icon} from 'lego-on-react';

import withWrap from '../withWrap/withWrap';

function Button(props) {
    return (
        <LegoButton
            theme="pseudo"
            view="default"
            tone="default"
            size="s"
            disabled={props.disabled}
            onClick={props.onClick}
        >
            {props.text}
            <Icon glyph="type-arrow" direction="bottom"/>
        </LegoButton>
    );
}

Button.propTypes = {
    text: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired
};

Button.defaultProps = {
    disabled: false
};

export default withWrap(Button);
