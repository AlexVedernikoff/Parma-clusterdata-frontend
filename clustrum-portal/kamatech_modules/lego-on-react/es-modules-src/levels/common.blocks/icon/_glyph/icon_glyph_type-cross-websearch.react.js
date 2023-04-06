import React from 'react';
import { declMod } from '@kamatech-lego/i-bem-react';
export default declMod(
  {
    glyph: 'type-cross-websearch',
  },
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
          viewBox: '0 0 16 16',
        },
        React.createElement('path', {
          d:
            'M6.586 8L.93 2.343 2.342.93 8 6.585 13.657.93l1.414 1.413L9.42 8l5.657 5.657-1.413 1.414L8 9.42l-5.657 5.65L.93 13.658 6.585 8z',
        }),
      ); // eslint-disable-line max-len, react/jsx-space-before-closing, react/jsx-tag-spacing, react/jsx-max-props-per-line
    },
  },
);
