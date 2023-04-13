import * as React from 'react';
import './KamatechMenu.css';
import { ClassHelper } from '../../helpers';

export class KamatechMenu extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  private baseClass = 'parma-menu';

  render() {
    const wrapper = React.Children.map(this.props.children, child => {
      return <div className={'parma-menu-item'}>{child}</div>;
    });
    const sizeClass = this.props.size ? `${this.baseClass}_size_${this.props.size}` : '';

    return <div className={ClassHelper.merge(this.baseClass, sizeClass)}>{wrapper}</div>;
  }
}
