import React from 'react';
import { declMod } from '@parma-lego/i-bem-react';

export default declMod(
  { glyph: 'type-tick' },
  {
    block: 'icon',
    content: function content() {
      return React.createElement(
        'svg',
        { focusable: 'false', viewBox: '0 0 12 10', width: '0', height: '0', xmlns: 'http://www.w3.org/2000/svg' },
        React.createElement('path', {
          d:
            'M.49 5.385l1.644-1.644 4.385 4.385L4.874 9.77.49 5.385zm4.384 1.096L10.356 1 12 2.644 6.519 8.126 4.874 6.48v.001z',
        }),
      ); // eslint-disable-line
    },
  },
);
