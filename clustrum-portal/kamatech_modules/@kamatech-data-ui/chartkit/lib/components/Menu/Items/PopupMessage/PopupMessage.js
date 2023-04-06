import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Popup } from 'lego-on-react';

// import './PopupMessage.scss';

const b = block('popup-message');

export default function PopupMessage(props) {
  const {
    anchor,
    autoclosable,
    visible,
    children,
    to,
    toSide,
    offset,
    mainOffset,
    size,
    theme,
    tail,
    onOutsideClick,
  } = props;

  return (
    <Popup
      {...{
        mix: { block: b(), mods: { size, theme, autoclosable } },
        theme: 'normal',
        target: 'anchor',
        hasTail: tail,
        onOutsideClick,
        visible,
        offset,
        mainOffset,
        directions: [].concat(to).map(dir => `${dir}-${toSide}`),
        autoclosable,
        anchor,
      }}
    >
      <div className={b('content')}>{children}</div>
    </Popup>
  );
}

PopupMessage.propTypes = {
  anchor: PropTypes.object,
  autoclosable: PropTypes.bool,
  visible: PropTypes.bool,
  offset: PropTypes.number,
  to: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  toSide: PropTypes.oneOf(['left', 'center', 'right', 'top', 'bottom']),
  mainOffset: PropTypes.number,
  size: PropTypes.oneOf(['s']),
  theme: PropTypes.oneOf(['normal', 'error', 'hint']),
  tail: PropTypes.bool,
  onOutsideClick: PropTypes.func,
};

PopupMessage.defaultProps = {
  to: ['right', 'bottom', 'top', 'left'],
  toSide: 'center',
  tail: true,
};
