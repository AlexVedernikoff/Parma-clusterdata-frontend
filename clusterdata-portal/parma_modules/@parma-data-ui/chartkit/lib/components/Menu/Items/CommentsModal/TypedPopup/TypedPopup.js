import React from 'react';
import PropTypes from 'prop-types';

import {Popup} from 'lego-on-react';

// import './TypedPopup.scss';

// Компонент для того, чтобы можно было обернуть контент popup2 в отдельный div,
// и менять стили этого div в зависимости от пропса type.
// Переопределить поведение popup2 для этого не получилось: в declMod не вызывается content.

export default function TypedPopup(props) {
    const {children, ..._props} = props;
    return (
        <Popup {..._props}>
            <div className="typed-popup2__content">
                {children}
            </div>
        </Popup>
    );
}
TypedPopup.propTypes = {
    type: PropTypes.string
};
