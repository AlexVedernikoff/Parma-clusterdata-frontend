import React from 'react';
import PropTypes from 'prop-types';
import cn from 'bem-cn-lite';
import { Menu, Popup } from 'lego-on-react';
import Icon from '../../Icon/Icon';

// import './EntryContextMenu.scss';

const b = cn('yc-entry-context-menu');

const defaultPopupDirections = ['left-top', 'left-center', 'left-bottom'];

class EntryContextMenuItem extends React.Component {
  static propTypes = {
    icon: PropTypes.object,
    text: PropTypes.string,
    action: PropTypes.string,
    entry: PropTypes.object,
    wrapper: PropTypes.func,
    onClick: PropTypes.func,
  };
  onClick = () => {
    const { action } = this.props;
    this.props.onClick(action);
  };
  render() {
    const { icon, text } = this.props;
    const node = (
      <div className={b('item')} onClick={this.onClick}>
        <Icon data={icon} className={b('item-icon')} />
        {text}
      </div>
    );
    return this.props.wrapper
      ? this.props.wrapper({ entry: this.props.entry, children: node })
      : node;
  }
}

class EntryContextMenu extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    hasTail: PropTypes.bool,
    anchor: PropTypes.any,
    items: PropTypes.array,
    popupDirections: PropTypes.array,
    entry: PropTypes.object,

    onMenuClick: PropTypes.func,
    onClose: PropTypes.func,
  };
  static defaultProps = {
    items: [],
    popupDirections: defaultPopupDirections,
  };
  onMenuClick = action => {
    const { entry } = this.props;
    document.dispatchEvent(new Event('click', { bubbles: true }));
    this.props.onMenuClick({ entry, action });
  };
  render() {
    const { items, entry } = this.props;
    return (
      <Popup
        autoclosable
        motionless
        hasTail={this.props.hasTail}
        theme="normal"
        directions={this.props.popupDirections}
        visible={this.props.visible}
        anchor={this.props.anchor}
        onOutsideClick={this.props.onClose}
      >
        <Menu size="n" view="default" tone="default" theme="normal" cls={b('menu')}>
          {items.map((item, index) => (
            <EntryContextMenuItem
              key={index}
              {...item}
              entry={entry}
              onClick={this.onMenuClick}
            />
          ))}
        </Menu>
      </Popup>
    );
  }
}

export default EntryContextMenu;
