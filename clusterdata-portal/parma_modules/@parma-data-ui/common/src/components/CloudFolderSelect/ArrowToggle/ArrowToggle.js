import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import Icon from '../../Icon/Icon';
import iconChevron from '../../../assets/icons/chevron.svg';

// import './ArrowToggle.scss';

const propTypes = {
  size: PropTypes.number,
  direction: PropTypes.oneOf(['top', 'left', 'bottom', 'right']),
  className: PropTypes.string,
};

const defaultProps = {
  size: 16,
  direction: 'bottom',
};

const b = block('yc-arrow-toggle');

export default function ArrowToggle({ size, direction, className }) {
  return (
    <span style={{ width: size, height: size }} className={b({ direction }, className)}>
      <Icon data={iconChevron} width={size} height={size} />
    </span>
  );
}

ArrowToggle.propTypes = propTypes;
ArrowToggle.defaultProps = defaultProps;
