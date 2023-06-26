import React from 'react';
import { declMod } from '@kamatech-lego/i-bem-react';

export default declMod(
  { glyph: 'type-check' },
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
          viewBox: '0 0 16 10',
        },
        React.createElement('path', {
          d: 'M7.207 7.506L3.629 3.81 2.343 4.939l4.841 5.002 8.462-8.428L14.382.362z',
        }),
      ); // eslint-disable-line max-len, react/jsx-space-before-closing, react/jsx-tag-spacing, react/jsx-max-props-per-line
    },
  },
);
