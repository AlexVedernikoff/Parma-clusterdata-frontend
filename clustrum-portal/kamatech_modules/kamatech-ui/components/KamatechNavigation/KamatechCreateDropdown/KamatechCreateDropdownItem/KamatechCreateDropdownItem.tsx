import * as React from 'react';
import './KamatechCreateDropdownItem.css';
import { KamatechCreateDropdownItemInterface } from './KamatechCreateDropdownItem.interface';
import { KamatechIcon } from '../../..';

export class KamatechCreateDropdownItem extends React.Component<KamatechCreateDropdownItemInterface> {
  onClick = (event: React.SyntheticEvent) => {
    if (this.props.onClick) {
      this.props.onClick(this.props.value, event);
    }
  };

  render() {
    const { icon, text } = this.props;
    const className = 'parma-create-dropdown-item';
    return (
      <div className={className} onClick={this.onClick}>
        <KamatechIcon data={icon} className={`${className}-icon`} />
        {text}
      </div>
    );
  }
}
