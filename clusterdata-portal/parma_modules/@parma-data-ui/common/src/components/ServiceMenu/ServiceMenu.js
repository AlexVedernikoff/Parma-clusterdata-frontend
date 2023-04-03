import React from 'react';
import PropTypes from 'prop-types';
import cn from 'bem-cn-lite';
import Icon from '../Icon/Icon';
import { TextInput, Link } from 'lego-on-react';

// import './ServiceMenu.scss';

const b = cn('yc-service-menu');

function filterItems(item, searchText) {
  return (
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );
}

function defaultWrapper(item, { url, target }) {
  return (
    <Link url={url} target={target} theme="normal">
      {item}
    </Link>
  );
}

const MENU_ITEM_HEIGHT = 40;

class MenuGroup extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
    items: PropTypes.array,
    current: PropTypes.bool,
    disabled: PropTypes.bool,
    wrapper: PropTypes.func,
    onItemClick: PropTypes.func,
    onTitleClick: PropTypes.func,
  };
  getItemsHeight() {
    const { current } = this.props;
    return current ? MENU_ITEM_HEIGHT * this.props.items.length : 0;
  }
  onTitleClick = () => {
    this.props.onTitleClick(this.props.name);
  };
  renderTitle() {
    const { title, current, disabled, wrapper = defaultWrapper } = this.props;
    const item = <div className={b('group-title', { current, disabled })}>{title}</div>;
    return (
      <div className={b('item-wrapper', { disabled })} onClick={this.onTitleClick}>
        {wrapper(item, this.props)}
      </div>
    );
  }
  render() {
    const { items, current, searchText, onItemClick } = this.props;
    return (
      <div className={b('group', { current })}>
        {this.renderTitle()}
        <div className={b('items', { current })} style={{ height: this.getItemsHeight() }}>
          {Array.isArray(items) &&
            items
              .filter(item => filterItems(item, searchText))
              .map(item => <MenuItem key={item.name} {...item} onClick={onItemClick} />)}
        </div>
      </div>
    );
  }
}

function MenuItem(props) {
  const { icon: iconData, title, alpha, disabled, wrapper = defaultWrapper, onClick, iconClassName } = props;
  const item = (
    <div className={b('item', { disabled })}>
      <div className={b('item-icon')}>{Boolean(iconData) && <Icon data={iconData} className={iconClassName} />}</div>
      <div className={b('item-text')}>{title}</div>
      {Boolean(alpha) && <div className={b('alpha')}>{alpha}</div>}
    </div>
  );

  return (
    <div className={b('item-wrapper', { disabled })} onClick={onClick}>
      {wrapper(item, props)}
    </div>
  );
}

class ServiceMenu extends React.Component {
  static propTypes = {
    menuData: PropTypes.shape({
      hasSearch: PropTypes.bool,
      currentGroup: PropTypes.string,
      groups: PropTypes.array.isRequired,
      common: PropTypes.array.isRequired,
    }),
    accordion: PropTypes.bool,
    onItemClick: PropTypes.func,
    onGroupTitleClick: PropTypes.func,
  };
  static defaultProps = {
    accordion: false,
    menuData: {
      hasSearch: false,
      groups: [],
      common: [],
    },
  };
  state = {
    searchText: '',
    currentGroup:
      this.props.menuData.currentGroup || (this.props.menuData.groups.length && this.props.menuData.groups[0].name),
  };
  onGroupTitleClick = groupName => {
    if (this.props.accordion) {
      this.setState({ currentGroup: groupName });
    }

    if (this.props.onGroupTitleClick) {
      this.props.onGroupTitleClick(groupName);
    }
  };
  renderGroup = (group, index) => {
    const { onItemClick } = this.props;
    const { searchText } = this.state;
    return (
      <MenuGroup
        key={index}
        {...group}
        current={this.state.currentGroup === group.name}
        searchText={searchText}
        onTitleClick={this.onGroupTitleClick}
        onItemClick={onItemClick}
      />
    );
  };
  renderCommon = () => {
    const { searchText } = this.state;
    const { common = [] } = this.props.menuData;
    return common.filter(item => filterItems(item, searchText)).map(item => <MenuItem key={item.name} {...item} />);
  };
  renderSearch() {
    const { hasSearch, searchPlaceholder } = this.props.menuData;
    const { searchText } = this.state;
    if (hasSearch) {
      return (
        <div className={b('input-place')}>
          <TextInput
            theme="normal"
            size="m"
            view="default"
            tone="default"
            text={searchText}
            onChange={this.onFilterChange}
            placeholder={searchPlaceholder}
            hasClear
          />
        </div>
      );
    } else {
      return null;
    }
  }
  onFilterChange = searchText => {
    this.setState({ searchText });
  };
  render() {
    const { groups = [] } = this.props.menuData;
    return (
      <div className={b()}>
        {this.renderSearch()}
        <div className={b('groups')}>{groups.map(this.renderGroup)}</div>
        <div className={b('core')}>{this.renderCommon()}</div>
      </div>
    );
  }
}

export default ServiceMenu;
