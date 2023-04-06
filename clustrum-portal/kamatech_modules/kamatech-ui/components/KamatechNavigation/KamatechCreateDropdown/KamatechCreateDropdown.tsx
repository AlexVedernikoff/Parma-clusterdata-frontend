import * as React from 'react';
import { KamatechCreateDropdownInterface } from './KamatechCreateDropdown.interface';
import { ControlSize } from '../../../enums';
import { KamatechMenu, KamatechCreateDropdownItem, KamatechButton, KamatechDropdown } from '../..';

export class KamatechCreateDropdown extends React.Component<KamatechCreateDropdownInterface> {
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
          <KamatechCreateDropdownItem key={index} {...item} onClick={onMenuClick}></KamatechCreateDropdownItem>
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
