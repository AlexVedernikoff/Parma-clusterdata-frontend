import React from 'react';
import { declMod } from '@kamatech-lego/i-bem-react';
export default declMod(
  {
    glyph: 'type-arrow',
  },
  {
    block: 'icon',
    content: function content(_ref) {
      var size = _ref.size;
      return size === 'xs'
        ? React.createElement(
            'svg',
            {
              focusable: 'false',
              width: '0',
              height: '0',
              xmlns: 'http://www.w3.org/2000/svg',
              viewBox: '0 0 11 7',
            },
            React.createElement('path', {
              d: 'M9.25 1L5.5 4.6 1.75 1 1 1.72 5.5 6 10 1.72 9.25 1z',
            }),
          ) // eslint-disable-line max-len, react/jsx-space-before-closing, react/jsx-tag-spacing, react/jsx-max-props-per-line
        : React.createElement(
            'svg',
            {
              focusable: 'false',
              width: '0',
              height: '0',
              xmlns: 'http://www.w3.org/2000/svg',
              viewBox: '0 0 13 8',
            },
            React.createElement('path', {
              d: 'M11.3 1L6.5 5.7 1.7 1l-.7.7L6.5 7 12 1.7l-.7-.7z',
            }),
          ); // eslint-disable-line max-len, react/jsx-space-before-closing, react/jsx-tag-spacing, react/jsx-max-props-per-line
    },
  },
);
