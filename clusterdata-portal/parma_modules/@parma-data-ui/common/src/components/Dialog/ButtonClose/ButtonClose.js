import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Icon from '../../Icon/Icon';
import iconClose from '../../../assets/icons/preview-close.svg';
import {Button} from 'lego-on-react';
// import './ButtonClose.scss';

const b = block('yc-dialog-btn-close');

const ButtonClose = ({onClose}) => {
    return (
        <div className={b()}>
            <Button
                theme="flat"
                size="n"
                view="default"
                tone="default"
                cls={b('btn')}
                onClick={event => onClose(event)}
            >
                <Icon data={iconClose} width="24" height="24"/>
            </Button>
        </div>
    );
};

ButtonClose.propTypes = {
    onClose: PropTypes.func
};

export default ButtonClose;
