import React from 'react';
import PropTypes from 'prop-types';

/* eslint-disable max-len */
const PATHS = {
  lock: (
    <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
  ),
};
/* eslint-enable max-len */

function extend(newPaths) {
  Object.assign(PATHS, newPaths);
}

// не Icon т.к. Button смотрит на имя компоненты и сверяет его с Icon
function ChartKitIcon({ name, size, viewBoxSize, className, onClick }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      onClick={onClick}
    >
      {PATHS[name]}
    </svg>
  );
}

ChartKitIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  viewBoxSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
};

ChartKitIcon.defaultProps = {
  size: 16,
  viewBoxSize: 24,
  className: '',
  onClick: () => {},
};

export default ChartKitIcon;

export { extend };
