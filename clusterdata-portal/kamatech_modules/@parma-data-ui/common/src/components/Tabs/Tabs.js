import React from 'react';
import PropTypes from 'prop-types';
import cn from 'bem-cn-lite';
// import './Tabs.scss';

const b = cn('yc-tabs');

class Tab extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    hint: PropTypes.string,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  };
  onClick = () => {
    this.props.onClick(this.props.id);
  };
  render() {
    const { active, disabled, hint, title = this.props.id } = this.props;
    return (
      <div className={b('tab', { active, disabled })} title={hint || title} onClick={this.onClick}>
        {title}
      </div>
    );
  }
}

class Tabs extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    activeTab: PropTypes.string,
    allowNotSelected: PropTypes.bool,
    onSelectTab: PropTypes.func,
    wrapTo: PropTypes.func,
  };
  static tabClassName = b('tab');
  static activeTabClassName = b('tab', { active: true });
  static defaultProps = {
    wrapTo: (item, node) => node,
  };
  get activeTab() {
    const { allowNotSelected, activeTab, items } = this.props;
    if (activeTab) {
      return activeTab;
    } else if (allowNotSelected || items.length === 0) {
      return undefined;
    } else {
      const [firstTab] = items;
      return firstTab.id;
    }
  }
  selectTab(tabId) {
    if (this.props.onSelectTab) {
      this.props.onSelectTab(tabId);
    }
  }
  onTabClick = tabId => {
    this.selectTab(tabId);
  };
  renderTabs = () => {
    const activeTab = this.activeTab;
    const { items, wrapTo } = this.props;
    return items.map((item, index) =>
      wrapTo(item, <Tab key={item.id} {...item} active={item.id === activeTab} onClick={this.onTabClick} />, index),
    );
  };
  render() {
    return <div className={b()}>{this.renderTabs()}</div>;
  }
}

export default Tabs;
