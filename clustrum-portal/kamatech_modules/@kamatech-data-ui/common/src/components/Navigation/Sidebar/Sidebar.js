import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'bem-cn-lite';
import Icon from '../../Icon/Icon';

// import './Sidebar.scss';

const b = cn('yc-navigation-sidebar');

class SidebarItem extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    current: PropTypes.bool,
    linkWrapper: PropTypes.func,
    onClick: PropTypes.func,
  };
  onClick = event => {
    if (this.props.onClick) {
      this.props.onClick(this.props.item, event);
    }
  };
  render() {
    const { item, linkWrapper, current } = this.props;
    const node = (
      <Fragment>
        <Icon data={item.icon} className={b('item-icon', item.iconClassName)} />
        {item.text}
      </Fragment>
    );
    const className = b('item', { current });
    return linkWrapper ? (
      linkWrapper({ entry: item, className, children: node, onClick: this.onClick })
    ) : (
      <div className={className} onClick={this.onClick}>
        {node}
      </div>
    );
  }
}

// i18n
class Sidebar extends React.Component {
  static propTypes = {
    path: PropTypes.string,
    currentPlace: PropTypes.string,
    quickItems: PropTypes.array,
    linkWrapper: PropTypes.func,
    onItemClick: PropTypes.func,
    getPlaceParameters: PropTypes.func.isRequired,
  };
  static defaultProps = {
    quickItems: [],
  };
  renderPlaces() {
    const { getPlaceParameters, currentPlace, linkWrapper, onItemClick } = this.props;
    const locatedAtQuickItems = this.locatedAtQuickItems();
    return getPlaceParameters().map((item, index) => {
      return (
        <SidebarItem
          key={index}
          item={item}
          current={!locatedAtQuickItems && item.place === currentPlace}
          linkWrapper={linkWrapper}
          onClick={onItemClick}
        />
      );
    });
  }
  locatedAtQuickItems() {
    return Boolean(this.props.path && this.props.quickItems.some(({ key }) => key === this.props.path));
  }
  renderQuickItems() {
    const { quickItems, linkWrapper, onItemClick, path } = this.props;
    return quickItems.map((item, index) => {
      return (
        <SidebarItem
          key={index}
          item={item}
          current={item.key === path}
          linkWrapper={linkWrapper}
          onClick={onItemClick}
        />
      );
    });
  }
  render() {
    return (
      <div className={b()}>
        <div className={b('places')}>
          <div className={b('header')}>Навигатор объектов</div>
          {this.renderPlaces()}
        </div>
        {/*
                    <div className={b('quick-items')}>
                        <div className={b('quick-header')}>
                            Быстрый доступ
                        </div>
                        {this.renderQuickItems()}
                    </div>
                */}
      </div>
    );
  }
}

export default Sidebar;
