import React from 'react';
import PropTypes from 'prop-types';
import cn from 'bem-cn-lite';
import i18n from '../i18n';

import { ParmaDropdown, ParmaCreateDropdownItem, ParmaMenu, ParmaButton } from '@parma-ui';

const b = cn('yc-create-dropdown');

class CreateDropdown extends React.Component {
  static propTypes = {
    size: PropTypes.string,
    items: PropTypes.array,
    onMenuClick: PropTypes.func,
  };
  static defaultProps = {
    size: 'n',
    items: [],
  };
  componentDidMount() {
    this.forceUpdate();
  }

  renderPopup() {
    const { items, onMenuClick } = this.props;
    return (
      <ParmaMenu size="n" view="default" tone="default" theme="normal">
        {items.map((item, index) => (
          <ParmaCreateDropdownItem key={index} {...item} onClick={onMenuClick}></ParmaCreateDropdownItem>
        ))}
      </ParmaMenu>
    );
  }

  renderSwitcher() {
    return (
      <ParmaButton view="default" tone="default" theme="action" size={this.props.size}>
        {i18n('button_create')}
      </ParmaButton>
    );
  }
  render() {
    return (
      <div className={b()}>
        <ParmaDropdown switcher={this.renderSwitcher()} popup={this.renderPopup()}></ParmaDropdown>
      </div>
    );
  }
}

export default CreateDropdown;
