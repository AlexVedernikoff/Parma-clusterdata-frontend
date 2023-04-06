import React from 'react';
import { decl } from '@kamatech-lego/i-bem-react';

export default decl({
  block: 'menu',
  elem: 'icon',
  render: function render() {
    var block = this.block,
      elem = this.elem,
      _props = this.props,
      mix = _props.mix,
      children = _props.children,
      size = _props.size;

    return React.cloneElement(children, { size: size, mix: [].concat(mix, { block: block, elem: elem }) });
  },
});
