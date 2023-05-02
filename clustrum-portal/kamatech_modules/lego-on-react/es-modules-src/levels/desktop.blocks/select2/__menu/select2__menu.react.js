import { decl } from '@kamatech-lego/i-bem-react';
import PropTypes from 'prop-types';

export default decl(
  {
    block: 'select2',
    elem: 'menu',
    willInit: function willInit() {
      this.__base.apply(this, arguments);

      this._hoverOnOpen = this._hoverOnOpen.bind(this);
    },
    didUpdate: function didUpdate() {
      this.__base.apply(this, arguments);

      this.context.wasOpened && this._menu.items.length && this._hoverOnOpen();
    },
    _hoverOnOpen: function _hoverOnOpen() {
      var menu = this._menu;

      if (!menu.items.length) {
        return;
      }

      var checked = menu.items.filter(function(item) {
        return item.props.checked;
      })[0];
      var hovered = menu._hoveredItem;

      if (!hovered) {
        if (checked) {
          menu.hoverText(checked.getText());
        } else {
          menu.hoverItem(menu.items[0]);
          menu.scrollToItem(menu.items[0]);
        }
      }
    },
  },
  {
    contextTypes: {
      getMenu: PropTypes.func,
      wasOpened: PropTypes.bool,
    },
  },
);
