import * as React from 'react';
import { ParmaCreateDropdownInterface } from './ParmaCreateDropdown.interface';
import { ControlSize } from '../../../enums';
import { ParmaMenu, ParmaCreateDropdownItem, ParmaButton, ParmaDropdown } from '../..';

export class ParmaCreateDropdown extends React.Component<ParmaCreateDropdownInterface> {
  static defaultProps = {
    size: ControlSize.N,
    items: [] as any[],
  };

  componentDidMount() {
    this.forceUpdate();
  }

  renderPopup() {
    const { items, onMenuClick } = this.props;
    return (
      <ParmaMenu view="default" tone="default" theme="normal" size={this.props.size}>
        {items.map((item, index) => (
          <ParmaCreateDropdownItem key={index} {...item} onClick={onMenuClick}></ParmaCreateDropdownItem>
        ))}
      </ParmaMenu>
    );
  }

  renderSwitcher() {
    return (
      <ParmaButton view="default" tone="default" theme="action" size={this.props.size}>
        Создать
      </ParmaButton>
    );
  }

  render() {
    return <ParmaDropdown switcher={this.renderSwitcher()} popup={this.renderPopup()}></ParmaDropdown>;
  }
}
