import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

// import './FieldWrapper.scss';

const b = block('yc-field-wrapper');

function renderError(errorText) {
    return (
        <div className={b('error-text')}>
            {errorText}
        </div>
    );
}

export default function FieldWrapper({error, children}) {
    return (
        <span
            className={b({
                state: error ? 'error' : null
            })}
        >
            {children}
            {error && renderError(error)}
        </span>
    );
}

FieldWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    error: PropTypes.string
};
