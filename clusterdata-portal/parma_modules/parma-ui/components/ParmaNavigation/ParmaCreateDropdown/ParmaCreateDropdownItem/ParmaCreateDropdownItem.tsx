import * as React from 'react';
import './ParmaCreateDropdownItem.css';
import { ParmaCreateDropdownItemInterface } from './ParmaCreateDropdownItem.interface';
import { ParmaIcon } from '../../..';

export class ParmaCreateDropdownItem extends React.Component<ParmaCreateDropdownItemInterface> {
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
        <ParmaIcon data={icon} className={`${className}-icon`} />
        {text}
      </div>
    );
  }
}
