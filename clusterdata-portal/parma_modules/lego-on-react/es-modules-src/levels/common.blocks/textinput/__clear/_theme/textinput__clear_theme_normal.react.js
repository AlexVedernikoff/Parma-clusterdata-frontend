import { declMod } from '@parma-lego/i-bem-react';

export default declMod({ theme: 'normal' }, {
    block: 'textinput',
    elem: 'clear',
    iconType: function iconType(_ref) {
        var view = _ref.view;

        return view !== 'default' ? 'cross' : undefined;
    },
    iconGlyph: function iconGlyph(_ref2) {
        var view = _ref2.view;

        return view === 'default' ? 'x-sign' : undefined;
    }
});