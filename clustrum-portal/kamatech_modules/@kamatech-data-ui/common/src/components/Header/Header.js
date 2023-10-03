import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Logo from './Logo/Logo';
import Menu from './Menu/Menu';
import Search from './Search/Search';
import UserAvatar from './UserAvatar/UserAvatar';
import { $appSettingsStore } from '@shared/app-settings';

// import './Header.scss';

const b = block('yc-header');

export default class Header extends React.PureComponent {
  static propTypes = {
    hasMenu: PropTypes.bool,
    userData: PropTypes.object,
    actionsMenu: PropTypes.array,
    menuData: PropTypes.object,
    logoIcon: PropTypes.node,
    logoText: PropTypes.string.isRequired,
    logoHref: PropTypes.string,
    onLogoClick: PropTypes.func,
    onLogin: PropTypes.func,
    children: PropTypes.any,
    search: PropTypes.object,
  };

  static defaultProps = {
    hasMenu: true,
  };

  renderSearchSection() {
    const { search } = this.props;

    if (!search) {
      return null;
    }

    return <Search {...search} />;
  }

  render() {
    if ($appSettingsStore.getState().hideHeader) {
      return null;
    }

    return (
      <header className={b()}>
        {this.props.hasMenu && (
          <div className={b('menu-section')}>
            <Menu menuData={this.props.menuData} />
          </div>
        )}
        <div className={b('logo-section')} onClick={this.props.onLogoClick}>
          {
            <Logo
              logoIcon={this.props.logoIcon}
              logoText={this.props.logoText}
              logoHref={this.props.logoHref}
            />
          }
          {$appSettingsStore.getState().title}
        </div>
        {this.renderSearchSection()}
        <div className={b('custom-section')}>{this.props.children}</div>
        <div className={b('user-section')}>
          {/*
                    <UserAvatar
                        userData={this.props.userData}
                        actionsMenu={this.props.actionsMenu}
                        onLogin={this.props.onLogin}
                    />
                    */}
        </div>
      </header>
    );
  }
}
