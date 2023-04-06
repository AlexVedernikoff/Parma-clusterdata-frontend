import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

// import './Paranja.scss';

const b = block('paranja');

export default function Paranja(props) {
  return (
    <div className={b({ visible: props.visible })} onClick={props.onClick}>
      {props.children}
    </div>
  );
}
Paranja.propTypes = {
  visible: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.any,
};
