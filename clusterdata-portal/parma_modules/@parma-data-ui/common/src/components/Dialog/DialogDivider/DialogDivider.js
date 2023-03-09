import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

// import './DialogDivider.scss';

const b = block('yc-dialog-divider');

function DialogDivider({className}) {
    return <div className={b(false, className)}/>;
}

DialogDivider.propTypes = {
    className: PropTypes.string
};

export default DialogDivider;
