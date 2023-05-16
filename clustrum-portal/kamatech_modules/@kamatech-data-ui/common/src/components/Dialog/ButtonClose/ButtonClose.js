import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Icon from '../../Icon/Icon';
import iconClose from '../../../assets/icons/preview-close.svg';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
// import './ButtonClose.scss';

const b = block('yc-dialog-btn-close');

const ButtonClose = ({ onClose }) => {
  return (
    <div className={b()}>
      <Button type="text" cls={b('btn')} onClick={event => onClose(event)} icon={<CloseOutlined />} />
    </div>
  );
};

ButtonClose.propTypes = {
  onClose: PropTypes.func,
};

export default ButtonClose;
