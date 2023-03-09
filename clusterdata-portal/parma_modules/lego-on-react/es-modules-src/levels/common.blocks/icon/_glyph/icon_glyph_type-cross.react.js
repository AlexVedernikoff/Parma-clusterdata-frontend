import React from 'react';
import { declMod } from '@parma-lego/i-bem-react';
export default declMod({
  glyph: 'type-cross'
}, {
  block: 'icon',
  content: function content(_ref) {
    var size = _ref.size;
    return size === 'xs' ? React.createElement("svg", {
      focusable: "false",
      xmlns: "http://www.w3.org/2000/svg",
      width: "0",
      height: "0",
      viewBox: "0 0 10 10"
    }, React.createElement("polygon", {
      points: "10,0.7 9.3,0 5,4.3 0.7,0 0,0.7 4.3,5 0,9.3 0.7,10 5,5.7 9.3,10 10,9.3 5.7,5"
    })) // eslint-disable-line max-len, react/jsx-space-before-closing, react/jsx-tag-spacing, react/jsx-max-props-per-line
    : React.createElement("svg", {
      focusable: "false",
      xmlns: "http://www.w3.org/2000/svg",
      width: "0",
      height: "0",
      viewBox: "0 0 14 14"
    }, React.createElement("polygon", {
      points: "14,0.7 13.3,0 7,6.3 0.7,0 0,0.7 6.3,7 0,13.3 0.7,14 7,7.7 13.3,14 14,13.3 7.7,7"
    })); // eslint-disable-line max-len, react/jsx-space-before-closing, react/jsx-tag-spacing, react/jsx-max-props-per-line
  }
});