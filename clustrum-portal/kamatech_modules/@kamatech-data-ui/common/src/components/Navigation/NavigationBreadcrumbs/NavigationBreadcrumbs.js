import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import {
  NAVIGATION_ROOT,
  NAVIGATION_FAVORITES,
  NAVIGATION_LATEST,
  NAVIGATION_DASHBOARDS,
  NAVIGATION_DATASETS,
  NAVIGATION_WIDGETS,
  NAVIGATION_CONNECTIONS,
} from '../constants';

// import './NavigationBreadcrumbs.scss';

const b = block('yc-navigation-breadcrumbs');

class Crumb extends PureComponent {
  static propTypes = {
    last: PropTypes.bool,
    item: PropTypes.object,
    onClick: PropTypes.func,
    linkWrapper: PropTypes.func,
  };
  onClick = event => {
    if (this.props.onClick) {
      this.props.onClick(this.props.item, event, this.props.last, this.props.first);
    }
  };
  render() {
    const { last, item, linkWrapper } = this.props;
    const node = (
      <div className={b('crumb')} onClick={this.onClick}>
        <span className={b('folder-name', { last })}>{item.name}</span>
      </div>
    );
    return linkWrapper ? (
      linkWrapper({ item, last, className: b('item', { last }), children: node })
    ) : (
      <div className={b('item', { last })} onClick={this.onClick}>
        {node}
      </div>
    );
  }
}

class NavigationBreadcrumbs extends PureComponent {
  static propTypes = {
    size: PropTypes.string,
    path: PropTypes.string,
    place: PropTypes.string,
    onClick: PropTypes.func,
    linkWrapper: PropTypes.func,
    getPlaceParameters: PropTypes.func,
  };

  static defaultProps = {
    size: 'm',
    path: '',
    place: NAVIGATION_ROOT,
  };

  getFolderNameByPathMap() {
    const { path } = this.props;
    let partialPath = '';

    return path
      .split('/')
      .filter(name => name)
      .map(name => {
        partialPath += name + '/';
        return { name, path: partialPath };
      });
  }

  getFolderParts() {
    const { place, getPlaceParameters } = this.props;
    const { text } = getPlaceParameters(place);
    switch (this.props.place) {
      case NAVIGATION_ROOT:
      case NAVIGATION_FAVORITES:
      case NAVIGATION_LATEST:
      case NAVIGATION_DASHBOARDS:
      case NAVIGATION_DATASETS:
      case NAVIGATION_WIDGETS:
      case NAVIGATION_CONNECTIONS: {
        return [
          {
            path: '',
            name: text,
            place: place,
          },
          ...this.getFolderNameByPathMap(),
        ];
      }
      default: {
        return [
          {
            path: '',
            name: text,
            place: place,
          },
        ];
      }
    }
  }

  renderBreadcrumbs() {
    return this.getFolderParts()
      .filter(Boolean)
      .map((item, index, arr) => {
        const last = arr.length - 1 === index;
        const first = 0 === index;
        return (
          <Crumb
            key={`brd-folder-name-${index}`}
            onClick={this.props.onClick}
            linkWrapper={this.props.linkWrapper}
            item={item}
            last={last}
            first={first}
          />
        );
      });
  }

  render() {
    return <div className={b({ size: this.props.size })}>{this.renderBreadcrumbs()}</div>;
  }
}

export default NavigationBreadcrumbs;
