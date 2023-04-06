import { cloneElement } from 'react';
import { decl } from '@kamatech-lego/i-bem-react';

export default decl({
  block: 'button2',
  elem: 'icon',
  render: function render() {
    var block = this.block,
      elem = this.elem,
      _props = this.props,
      children = _props.children,
      side = _props.side,
      size = _props.size;

    return cloneElement(children, {
      size: size,
      mix: [].concat(children.props.mix, { block: block, elem: elem, mods: { side: side } }),
    });
  },
});
