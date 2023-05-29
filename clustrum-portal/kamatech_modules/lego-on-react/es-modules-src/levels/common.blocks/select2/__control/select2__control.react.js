import React from 'react';
import { decl } from '@kamatech-lego/i-bem-react';

export default decl(
  {
    block: 'select2',
    elem: 'control',
    tag: 'select',
    attrs: function attrs(_ref) {
      var name = _ref.name,
        multiple = _ref.multiple,
        disabled = _ref.disabled,
        value = _ref.val,
        tabIndex = _ref.tabIndex,
        onChange = _ref.onChange;

      return {
        name: name,
        multiple: multiple,
        disabled: disabled,
        value: value,
        tabIndex: tabIndex,
        onChange: disabled ? undefined : onChange,
      };
    },
    content: function content(_ref2) {
      var val = _ref2.val,
        native = _ref2.native,
        items = _ref2.items;

      return items.map(function(item, i) {
        return React.createElement(
          'option',
          {
            key: i, // eslint-disable-line react/no-array-index-key
            value: item.props.val,
            disabled: item.props.disabled,
          },
          native ? item.props.children : undefined,
        );
      });
    },
  },
  {
    defaultProps: {
      tabIndex: '-1',
      onChange: function onChange() {},
    },
  },
);
