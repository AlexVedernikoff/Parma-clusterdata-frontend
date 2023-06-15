import * as React from 'react';
import './KamatechSidebarItem.css';
import { KamatechSidebarItemInterface } from './KamatechSidebarItem.interface';
import { KamatechIcon } from '../../../KamatechIcon/KamatechIcon';
import { ClassHelper } from '../../../../helpers';

export class KamatechSidebarItem extends React.Component<KamatechSidebarItemInterface> {
  onClick = (event: React.SyntheticEvent) => {
    if (this.props.onClick) {
      this.props.onClick(this.props.item, event);
    }
  };

  render() {
    const { item, linkWrapper, current } = this.props;
    const baseClass = 'kamatech-slidebar-item';
    const currentClass = current ? `${baseClass}_current` : '';
    const className = ClassHelper.merge(baseClass, currentClass);
    const node = (
      <React.Fragment>
        <KamatechIcon
          data={item.icon}
          className={ClassHelper.merge(`${baseClass}-icon`, item.iconClassName)}
        />
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
