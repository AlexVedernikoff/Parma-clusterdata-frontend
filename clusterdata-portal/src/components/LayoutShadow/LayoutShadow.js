import React, {useEffect} from 'react';
import block from 'bem-cn-lite';
import PropTypes from 'prop-types';

const b = block('layout-shadow');

export default function LayoutShadow ({onShadowClick = () => {}, isShown = false}) {
    useEffect(() => {
        document.body.style.overflow = isShown ? 'hidden' : '';
    }, [isShown]);

    return <div className={b({view: isShown ? 'show' : 'hide'})} onClick={onShadowClick}> </div>;
}

LayoutShadow.propTypes = {
    onShadowClick: PropTypes.func,
    isShowed: PropTypes.bool
};