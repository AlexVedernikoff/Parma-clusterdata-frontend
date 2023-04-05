import React from 'react';
import { declMod } from '@parma-lego/i-bem-react';

export default declMod(
  { glyph: 'carets-v' },
  {
    block: 'icon',
    content: function content() {
      return React.createElement(
        'svg',
        { focusable: 'false', xmlns: 'http://www.w3.org/2000/svg', width: '0', height: '0', viewBox: '0 0 8 14' },
        React.createElement('path', { d: 'M4 0l4 6H0l4-6zm0 14l4-6H0l4 6z' }),
      ); // eslint-disable-line max-len, react/jsx-space-before-closing, react/jsx-tag-spacing, react/jsx-max-props-per-line
    },
  },
);
