import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
// import './DialogHeader.scss';

const b = block('yc-dialog-header');

const DialogHeader = props => {
  const { caption, insertBefore, insertAfter } = props;

  return (
    <div className={b()}>
      {insertBefore}
      <div className={b('caption')}>{caption}</div>
      {insertAfter}
    </div>
  );
};

DialogHeader.propTypes = {
  caption: PropTypes.string,
  insertBefore: PropTypes.any,
  insertAfter: PropTypes.any,
};

DialogHeader.defaultProps = {
  caption: '',
};

export default DialogHeader;
