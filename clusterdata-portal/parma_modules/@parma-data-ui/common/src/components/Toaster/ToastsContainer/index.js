import React from 'react';
import PropTypes from 'prop-types';
import Toast from '../Toast';

// import './index.scss';

const renderToasts = (toasts, removeCallback) => {
  return toasts.map(toast => {
    const { name } = toast;

    return <Toast key={name} removeCallback={() => removeCallback(name)} {...toast} />;
  });
};

const ToastsContainer = props => {
  const { toasts, removeCallback } = props;

  return <React.Fragment>{renderToasts(toasts, removeCallback)}</React.Fragment>;
};

ToastsContainer.propTypes = {
  toasts: PropTypes.array.isRequired,
  removeCallback: PropTypes.func.isRequired,
};

export default ToastsContainer;
