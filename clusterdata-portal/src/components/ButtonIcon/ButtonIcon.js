import React from 'react';
import PropTypes from 'prop-types';

import {Bem} from 'lego-on-react';

// import './ButtonIcon.scss';

function ButtonIcon({children, size, mix}) {
    return <Bem block="icon" mods={{size, svg: true}} mix={mix}>{children}</Bem>;
}

ButtonIcon.displayName = 'Icon'; // хак для button2, которая проверяет это поле, которое теряется при минификации
ButtonIcon.propTypes = {
    children: PropTypes.node.isRequired,
    size: PropTypes.string,
    mix: PropTypes.array
};

export default ButtonIcon;
