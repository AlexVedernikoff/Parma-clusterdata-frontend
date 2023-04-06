import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import { Button, Icon } from 'lego-on-react';

import { Context } from '../Context/Context';

// import './Header.scss';

const b = block('chartkit-modal-header');

class Header extends React.PureComponent {
  static contextType = Context;

  static propTypes = {
    caption: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className={b()}>
        {this.props.caption}
        <Button theme="clear" view="default" tone="default" size="head" onClick={this.context.onClose}>
          <Icon glyph="type-cross" />
        </Button>
      </div>
    );
  }
}

export default Header;
