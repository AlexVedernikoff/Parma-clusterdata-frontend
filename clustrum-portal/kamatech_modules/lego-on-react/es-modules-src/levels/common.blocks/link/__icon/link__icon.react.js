import { cloneElement } from 'react';
import { decl } from '@kamatech-lego/i-bem-react';

export default decl({
  block: 'link',
  elem: 'icon',
  render: function render() {
    var block = this.block,
      elem = this.elem,
      _props = this.props,
      side = _props.side,
      children = _props.children;

    return cloneElement(children, {
      mix: [].concat(children.props.mix, {
        block: block,
        elem: elem,
        mods: { side: side },
      }),
    });
  },
});
