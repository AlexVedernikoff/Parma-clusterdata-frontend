import * as React from 'react';
import './ParmaSidebar.css';
import { ParmaSidebarInterface } from './ParmaSidebar.interface';
import { ParmaSidebarItem } from './ParmaSidebarItem/ParmaSidebarItem';

export class ParmaSidebar extends React.Component<ParmaSidebarInterface> {
  public static defaultProps = { quickItems: [] as any[] };

  renderPlaces() {
    const { getPlaceParameters, currentPlace, linkWrapper, onItemClick } = this.props;
    const locatedAtQuickItems = this.locatedAtQuickItems();
    return getPlaceParameters().map((item: any, index: number) => {
      return (
        <ParmaSidebarItem
          key={index}
          item={item}
          current={!locatedAtQuickItems && item.place === currentPlace}
          linkWrapper={linkWrapper}
          onClick={onItemClick}
        />
      );
    });
  }

  locatedAtQuickItems() {
    const { quickItems, path } = this.props;
    const isSome = quickItems && quickItems.some(({ key }) => key === path);
    return Boolean(path && isSome);
  }

  render() {
    return (
      <div className={'parma-sidebar'}>
        <div className={'parma-sidebar-places'}>
          <div className={'parma-sidebar-header'}>Навигатор объектов</div>
          {this.renderPlaces()}
        </div>
      </div>
    );
  }
}
