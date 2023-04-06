import React from 'react';
import PropTypes from 'prop-types';
import cn from 'bem-cn-lite';
import i18n from '../i18n';

import { KamatechDropdown, ParmaCreateDropdownItem, KamatechMenu, KamatechButton } from '@kamatech-ui';

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
      <KamatechMenu size="n" view="default" tone="default" theme="normal">
        {items.map((item, index) => (
          <ParmaCreateDropdownItem key={index} {...item} onClick={onMenuClick}></ParmaCreateDropdownItem>
        ))}
      </KamatechMenu>
    );
  }

  renderSwitcher() {
    return (
      <KamatechButton view="default" tone="default" theme="action" size={this.props.size}>
        {i18n('button_create')}
      </KamatechButton>
    );
  }
  render() {
    return (
      <div className={b()}>
        <KamatechDropdown switcher={this.renderSwitcher()} popup={this.renderPopup()}></KamatechDropdown>
      </div>
    );
  }
}

export default CreateDropdown;
