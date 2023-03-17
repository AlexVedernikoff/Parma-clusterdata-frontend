import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

// import './Wrapper.scss';

const b = block('control-wrapper');

function Wrapper({ title, children }) {
  return (
    <div className={b()}>
      <div className={b('title')}>{title}</div>
      <div className={b('children')}>{children}</div>
    </div>
  );
}

Wrapper.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
};

export default Wrapper;
