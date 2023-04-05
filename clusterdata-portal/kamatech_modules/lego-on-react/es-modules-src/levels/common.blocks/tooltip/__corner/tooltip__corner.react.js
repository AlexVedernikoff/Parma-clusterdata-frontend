import PropTypes from 'prop-types';
import { decl } from '@kamatech-lego/i-bem-react';

export default decl(
  {
    block: 'tooltip',
    elem: 'corner',
    mods: function mods(_ref) {
      var _mods = _ref.mods;

      /*%%%ISLDEBUG%%%*/ +0 &&
        console.assert((_mods || {}).side, 'tooltip: Модификатор side элемента corner скоро станет обязательным');

      return _mods;
    },
  },
  {
    propTypes: {
      mods: PropTypes.object,
    },
  },
);
