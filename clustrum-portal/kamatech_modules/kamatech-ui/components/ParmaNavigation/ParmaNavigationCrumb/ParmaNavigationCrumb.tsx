import * as React from 'react';
import './ParmaNavigationCrumb.css';
import { ParmaNavigationCrumbInterface } from './ParmaNavigationCrumb.interface';
import { ClassHelper } from '../../../helpers';

export class ParmaNavigationCrumb extends React.PureComponent<ParmaNavigationCrumbInterface> {
  onClick = (event: React.SyntheticEvent) => {
    if (this.props.onClick) {
      this.props.onClick(this.props.item, event, this.props.last, this.props.first);
    }
  };

  render() {
    const { last, item, linkWrapper } = this.props;
    const baseClass = 'parma-navigation-crumb';
    const nodeClass = `${baseClass}-node`;
    const itemClass = `${baseClass}-item`;
    const lastClass = last ? `${itemClass}_last` : '';
    const className = ClassHelper.merge(itemClass, lastClass);
    const node = (
      <div className={nodeClass} onClick={this.onClick}>
        <span>{item.name}</span>
      </div>
    );
    return linkWrapper ? (
      linkWrapper({ item, last, className, children: node })
    ) : (
      <div className={className} onClick={this.onClick}>
        {node}
      </div>
    );
  }
}
