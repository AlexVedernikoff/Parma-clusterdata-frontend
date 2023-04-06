import PropTypes from 'prop-types';
import { decl, bool2string } from '@kamatech-lego/i-bem-react';

export default decl(
  {
    block: 'spin2',
    mods: function mods(_ref) {
      var size = _ref.size,
        progress = _ref.progress,
        position = _ref.position,
        view = _ref.view,
        tone = _ref.tone;

      return { size: size, view: view, tone: tone, position: position, progress: bool2string(progress) };
    },
  },
  {
    propTypes: {
      view: PropTypes.string,
      tone: PropTypes.string,
      size: PropTypes.oneOf(['xxs', 'xs', 's', 'm', 'l']),
      progress: PropTypes.bool,
      position: PropTypes.oneOf(['center']),
    },
    defaultProps: {
      view: 'default',
      tone: 'default',
    },
  },
);
