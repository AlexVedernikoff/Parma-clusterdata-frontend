import { decl } from '@parma-lego/i-bem-react';

export default decl({
    block: 'textinput',
    elem: 'box',
    tag: 'span'
}, {
    isBox: function isBox(child) {
        return child && typeof child.type === 'function' && child.type.displayName === 'textinput__box';
    }
});