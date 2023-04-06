import React from 'react';
import PropTypes from 'prop-types';
import cn from 'bem-cn-lite';
import NavigationEntries from './NavigationEntries';

import { ParmaCreateDropdown, ParmaSidebar, ParmaNavigationBreadcrumbs } from '@kamatech-ui';

import './NavigationInline.css';

const b = cn('yc-navigation');

class NavigationInline extends React.Component {
  static propTypes = {
    size: PropTypes.string,
    path: PropTypes.string,
    place: PropTypes.string,
    linkWrapper: PropTypes.func,
    quickItems: PropTypes.array,
    createMenuItems: PropTypes.array,
    onCrumbClick: PropTypes.func,
    crumbLinkWrapper: PropTypes.func,
    onCreateMenuClick: PropTypes.func,
    onSidebarItemClick: PropTypes.func,
    getPlaceParameters: PropTypes.func.isRequired,
  };
  refEntries = React.createRef();
  refresh() {
    if (this.refEntries.current) {
      this.refEntries.current.refresh();
    }
  }
  renderHeader() {
    const {
      path,
      place,
      size,
      onCrumbClick,
      crumbLinkWrapper,
      createMenuItems,
      onCreateMenuClick,
      getPlaceParameters,
    } = this.props;
    return (
      <div className={b('header')}>
        <ParmaNavigationBreadcrumbs
          size={size}
          path={path}
          place={place}
          linkWrapper={crumbLinkWrapper}
          onClick={onCrumbClick}
          getPlaceParameters={getPlaceParameters}
        />
        <div className={'parma-navigation-inline-dropdown'}>
          <ParmaCreateDropdown
            items={createMenuItems}
            size={size}
            onMenuClick={onCreateMenuClick}
          ></ParmaCreateDropdown>
        </div>
      </div>
    );
  }
  render() {
    const { linkWrapper, quickItems, onSidebarItemClick, ...props } = this.props;
    return (
      <div className={b({ inline: true })}>
        <div className={b('sidebar')}>
          <ParmaSidebar
            path={this.props.path}
            currentPlace={this.props.place}
            quickItems={quickItems}
            linkWrapper={linkWrapper}
            onItemClick={onSidebarItemClick}
            getPlaceParameters={this.props.getPlaceParameters}
          ></ParmaSidebar>
        </div>
        <div className={b('content')}>
          {this.renderHeader()}
          <NavigationEntries
            ref={this.refEntries}
            {...props}
            linkWrapper={linkWrapper}
            getPlaceParameters={this.props.getPlaceParameters}
          />
        </div>
      </div>
    );
  }
}

export default NavigationInline;
