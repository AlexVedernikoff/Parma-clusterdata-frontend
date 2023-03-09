import React from 'react';
import { decl } from '@parma-lego/i-bem-react';

export default decl({
    block: 'textinput',
    elem: 'icon',
    mods: function mods(_ref) {
        var side = _ref.side;

        return { side: side };
    },
    render: function render() {
        var block = this.block,
            elem = this.elem,
            _props = this.props,
            children = _props.children,
            mix = _props.mix;

        if (children) {
            return React.cloneElement(children, {
                mix: [{ block: block, elem: elem, mods: this.mods(this.props) }, mix]
            });
        }
    }
});