import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Button } from 'lego-on-react';
import Icon from '../../Icon/Icon';

import tickIcon from '../../../assets/icons/tick.svg';

// import './Item.scss';

const b = block('yc-select-item');

export default class Item extends React.PureComponent {
  static propTypes = {
    onItemClick: PropTypes.func,
    selectOnlyCurrentItem: PropTypes.func,
    selectType: PropTypes.string,
    showItemIcon: PropTypes.bool,
    showItemMeta: PropTypes.bool,
    isSelected: PropTypes.bool,
    item: PropTypes.object,
    selectedCurrentItem: PropTypes.object,
    style: PropTypes.object,
  };

  _onOnlyButtonClick = e => {
    const { item, selectOnlyCurrentItem } = this.props;

    e.stopPropagation();
    selectOnlyCurrentItem(item);
  };

  _onItemClick = e => {
    const { onItemClick, item } = this.props;

    e.stopPropagation();
    onItemClick(item);
  };

  _renderItemIcon() {
    const {
      showItemIcon,
      showItemMeta,
      item: { icon },
    } = this.props;

    if (!showItemIcon || !icon) {
      return null;
    }

    const mods = {
      small: !showItemMeta,
      large: showItemMeta,
    };

    return <div className={b('icon', mods)}>{icon}</div>;
  }

  _renderItemInfo() {
    const {
      item: { title, meta },
      showItemMeta,
    } = this.props;

    return (
      <div className={b('info')}>
        <div className={b('title')} title={title}>
          {title}
        </div>
        {showItemMeta && meta && (
          <div className={b('meta')} title={meta}>
            {meta}
          </div>
        )}
      </div>
    );
  }

  _renderOnlyButton() {
    const {
      item: { value },
      selectedCurrentItem: { value: selectedCurrentItemValue } = {},
      selectType,
    } = this.props;

    if (selectType !== 'multiple') {
      return null;
    }

    return (
      <Button
        cls={b('only-btn')}
        theme="clear"
        size="xs"
        view="default"
        tone="default"
        text={selectedCurrentItemValue === value ? 'Кроме' : 'Только'}
        onClick={this._onOnlyButtonClick}
      />
    );
  }

  render() {
    const {
      item: { disabled },
      showItemMeta,
      isSelected,
      style,
    } = this.props;

    const mods = {
      disabled,
      'show-meta': showItemMeta,
      selected: isSelected,
    };

    return (
      <div className={b(mods)} style={style} onClick={this._onItemClick}>
        {this._renderItemIcon()}
        {this._renderItemInfo()}
        {this._renderOnlyButton()}
        {isSelected && (
          <div className={b('tick-wrap')}>
            <Icon data={tickIcon} className={b('tick')} width={10} height={10} />
          </div>
        )}
      </div>
    );
  }
}
