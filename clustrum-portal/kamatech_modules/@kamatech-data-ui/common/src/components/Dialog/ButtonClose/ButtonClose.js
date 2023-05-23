import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const b = block('yc-dialog-btn-close');

const ButtonClose = ({ onClose }) => {
  return (
    <div className={b()}>
      <Button type="text" onClick={event => onClose(event)} icon={<CloseOutlined />} />
    </div>
  );
};

ButtonClose.propTypes = {
  onClose: PropTypes.func,
};

export default ButtonClose;
