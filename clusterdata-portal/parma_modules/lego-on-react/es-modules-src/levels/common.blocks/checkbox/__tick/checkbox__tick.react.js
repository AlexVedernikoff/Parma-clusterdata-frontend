import React from 'react';
import { decl } from '@parma-lego/i-bem-react';
import "../../icon/icon.react.js";
import "../../icon/_glyph/icon_glyph.react.js";
import _icon_glyph_typeTick from "../../icon/_glyph/icon_glyph_type-tick.react.js";

var Icon = _icon_glyph_typeTick.applyDecls();

//import "./../../icon/icon.css";
//import "./../../icon/_glyph/icon_glyph.css";
//import "./../../icon/_glyph/icon_glyph_type-tick.css";


export default decl({
    block: 'checkbox',
    elem: 'tick',
    tag: 'i',
    content: function content(_ref) {
        var view = _ref.view,
            size = _ref.size;

        if (view === 'classic') {
            return;
        }

        return React.createElement(Icon, { glyph: 'type-tick' });
    }
});