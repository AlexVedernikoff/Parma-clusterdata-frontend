import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

// import './DialogBody.scss';

const b = block('yc-dialog-body');

const DialogBody = props => {
  const { className } = props;

  return <div className={b(false, className)}>{props.children}</div>;
};

DialogBody.propTypes = {
  className: PropTypes.string,
};

export default DialogBody;
