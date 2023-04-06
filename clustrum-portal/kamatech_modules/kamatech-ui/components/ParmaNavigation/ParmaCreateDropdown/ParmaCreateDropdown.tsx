import * as React from 'react';
import { ParmaCreateDropdownInterface } from './ParmaCreateDropdown.interface';
import { ControlSize } from '../../../enums';
import { KamatechMenu, ParmaCreateDropdownItem, KamatechButton, KamatechDropdown } from '../..';

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
      <KamatechMenu view="default" tone="default" theme="normal" size={this.props.size}>
        {items.map((item, index) => (
          <ParmaCreateDropdownItem key={index} {...item} onClick={onMenuClick}></ParmaCreateDropdownItem>
        ))}
      </KamatechMenu>
    );
  }

  renderSwitcher() {
    return (
      <KamatechButton view="default" tone="default" theme="action" size={this.props.size}>
        Создать
      </KamatechButton>
    );
  }

  render() {
    return <KamatechDropdown switcher={this.renderSwitcher()} popup={this.renderPopup()}></KamatechDropdown>;
  }
}
