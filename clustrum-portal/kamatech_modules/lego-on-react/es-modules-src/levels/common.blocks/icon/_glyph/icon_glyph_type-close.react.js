import React from 'react';
import { declMod } from '@kamatech-lego/i-bem-react';

export default declMod(
  { glyph: 'type-close' },
  {
    block: 'icon',
    content: function content() {
      return React.createElement(
        'svg',
        {
          focusable: 'false',
          xmlns: 'http://www.w3.org/2000/svg',
          width: '0',
          height: '0',
          viewBox: '0 0 10 10',
        },
        React.createElement('polygon', {
          points:
            '10,0.714 9.287,0 5,4.286 0.714,0 0,0.714 4.286,5 0,9.285 0.714,10 5,5.714 9.287,10 10,9.285 5.714,5',
        }),
      ); // eslint-disable-line max-len, react/jsx-space-before-closing, react/jsx-tag-spacing, react/jsx-max-props-per-line
    },
  },
);
