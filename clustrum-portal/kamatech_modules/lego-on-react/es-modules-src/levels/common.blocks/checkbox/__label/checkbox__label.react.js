import { decl } from '@kamatech-lego/i-bem-react';

export default decl({
  block: 'checkbox',
  elem: 'label',
  tag: 'label',
  attrs: function attrs(_ref) {
    var htmlFor = _ref.htmlFor,
      id = _ref.id;

    return {
      id: id,
      htmlFor: htmlFor,
      'aria-hidden': 'true',
    };
  },
});
