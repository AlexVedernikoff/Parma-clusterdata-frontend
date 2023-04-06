import React from 'react';
import PropTypes from 'prop-types';

import block from 'bem-cn-lite';
import Icon from '../../Icon/Icon';
import iconDots from '../../../assets/icons/dots.svg';

const b = block('yc-button-edit-entry');

const EntryContextButton = ({ onClick, entry, className }) => {
  let buttonRef;

  const handleClick = event => {
    event.stopPropagation();
    event.preventDefault();
    onClick({ event, buttonRef, entry });
  };

  const setButtonRef = elem => {
    buttonRef = elem;
  };

  return (
    <div className={b(null, className)} onClick={handleClick} ref={setButtonRef}>
      <Icon className={b('icon')} data={iconDots} width="24" height="24" />
    </div>
  );
};

EntryContextButton.propTypes = {
  onClick: PropTypes.func,
  entry: PropTypes.object,
  className: PropTypes.string,
};

export default EntryContextButton;
