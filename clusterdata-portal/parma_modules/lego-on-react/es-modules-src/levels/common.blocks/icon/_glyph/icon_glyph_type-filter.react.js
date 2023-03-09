import React from 'react';
import { declMod } from '@parma-lego/i-bem-react';
export default declMod({
  glyph: 'type-filter'
}, {
  block: 'icon',
  content: function content() {
    return React.createElement("svg", {
      focusable: "false",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 16",
      width: "0",
      height: "0"
    }, React.createElement("path", {
      d: "M7.17 12H0v2h7.17c.413 1.165 1.524 2 2.83 2s2.417-.835 2.83-2H20v-2h-7.17c-.413-1.165-1.524-2-2.83-2s-2.417.835-2.83 2zm-7-10H0v2h.17C.584 5.165 1.695 6 3 6s2.417-.835 2.83-2H20V2H5.83C5.416.835 4.305 0 3 0S.583.835.17 2z"
    })); // eslint-disable-line max-len, react/jsx-space-before-closing, react/jsx-tag-spacing, react/jsx-max-props-per-line
  }
});