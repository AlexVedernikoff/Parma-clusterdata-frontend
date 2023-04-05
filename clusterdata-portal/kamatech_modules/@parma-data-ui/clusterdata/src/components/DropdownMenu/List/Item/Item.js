import React from 'react';
import PropTypes from 'prop-types';
import cn from 'bem-cn-lite';

import List from '../List';
// import './Item.scss';

const b = cn('dl-dropdown-menu');

class Item extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    hasIcons: PropTypes.bool,
    data: PropTypes.object.isRequired,
    wrapTo: PropTypes.func,
  };

  state = {
    submenuVisible: undefined,
  };

  componentWillUnmount() {
    clearTimeout(this.openTimeout);
    clearTimeout(this.hideTimeout);
  }

  showSubmenu = () => {
    if (!this.props.data.submenu) {
      return;
    }

    if (this.state.submenuVisible) {
      clearTimeout(this.hideTimeout);
      return;
    }

    this.openTimeout = setTimeout(() => {
      this.setState({ submenuVisible: true });
    }, 200);
  };

  hideSubmenu = () => {
    if (!this.props.data.submenu) {
      return;
    }

    if (!this.state.submenuVisible) {
      clearTimeout(this.openTimeout);
    } else {
      this.hideTimeout = setTimeout(() => {
        this.setState({ submenuVisible: false });
      }, 200);
    }
  };

  renderIcon(icon) {
    return (
      <div className={b('item-icon')}>
        <svg width={24} height={24} viewBox="0 0 24 24">
          {typeof icon === 'string' ? <g dangerouslySetInnerHTML={{ __html: icon }} /> : icon}
        </svg>
      </div>
    );
  }

  renderItemContent(props) {
    return (
      <div className={props.hasIcons ? b.builder()('item-content')({ offset: true }) : b('item-content')}>
        {props.data.icon && this.renderIcon(props.data.icon)}
        <div className={b('item-title')}>{props.data.name}</div>
      </div>
    );
  }

  getMenuWidth() {
    return (this.item && this.item.getBoundingClientRect().width) || 0;
  }

  render() {
    const { data, wrapTo } = this.props;
    const node = this.renderItemContent(this.props);

    return (
      <div
        className={b('item')}
        ref={node => {
          this.item = node;
        }}
        onMouseEnter={this.showSubmenu}
        onMouseLeave={this.hideSubmenu}
        onClick={() => {
          if (this.props.onClick) {
            this.props.onClick();
          }

          if (this.props.data.action) {
            this.props.data.action();
          }
        }}
        {...{ 'data-id': data.id }}
      >
        {node}
        {Boolean(data.submenu) && (
          <List width={this.getMenuWidth()} data={data.submenu} visible={this.state.submenuVisible} wrapTo={wrapTo} />
        )}
      </div>
    );
  }
}

export default Item;
