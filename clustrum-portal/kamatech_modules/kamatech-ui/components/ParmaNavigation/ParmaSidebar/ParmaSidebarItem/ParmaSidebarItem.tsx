import * as React from 'react';
import './ParmaSidebarItem.css';
import { ParmaSidebarItemInterface } from './ParmaSidebarItem.interface';
import { ParmaIcon } from '../../../ParmaIcon/ParmaIcon';
import { ClassHelper } from '../../../../helpers';

export class ParmaSidebarItem extends React.Component<ParmaSidebarItemInterface> {
  onClick = (event: React.SyntheticEvent) => {
    if (this.props.onClick) {
      this.props.onClick(this.props.item, event);
    }
  };

  render() {
    const { item, linkWrapper, current } = this.props;
    const baseClass = 'parma-slidebar-item';
    const currentClass = current ? `${baseClass}_current` : '';
    const className = ClassHelper.merge(baseClass, currentClass);
    const node = (
      <React.Fragment>
        <ParmaIcon data={item.icon} className={ClassHelper.merge(`${baseClass}-icon`, item.iconClassName)} />
        {item.text}
      </React.Fragment>
    );
    return linkWrapper ? (
      linkWrapper({ entry: item, className, children: node, onClick: this.onClick })
    ) : (
      <div className={className} onClick={this.onClick}>
        {node}
      </div>
    );
  }
}
