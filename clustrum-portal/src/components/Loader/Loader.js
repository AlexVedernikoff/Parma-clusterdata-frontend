import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Loader as CommonLoader } from '@kamatech-data-ui/common/src';

// import './Loader.scss';

const b = block('dash-loader');

function Loader(props) {
  return (
    <div className={b()}>
      <CommonLoader size={props.size} />
      {props.text ? <div className={b('text')}>{props.text}</div> : null}
    </div>
  );
}

Loader.propTypes = {
  size: PropTypes.oneOf(['s', 'm', 'l']),
  text: PropTypes.string,
};

Loader.defaultProps = {
  size: 'm',
};

export default Loader;
