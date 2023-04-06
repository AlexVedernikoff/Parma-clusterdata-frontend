import React from 'react';
import PropTypes from 'prop-types';
import NavigationBase from './Base/NavigationBase';
import { PLACE, PLACE_VALUES } from './constants';
import Utils from '../../utils';
import { DL } from '../../constants/common';
import { mapPlaceBackward, isRoot, mapPlace } from './util';

// use only with react-router
class ServiceNavigation extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object,
    sdk: PropTypes.object,
    startFrom: PropTypes.string,
    history: PropTypes.object,
    navigationUrl: PropTypes.string,
    place: PropTypes.string,
  };

  static defaultProps = {
    navigationUrl: '', // for example: '/path-to-nav'
  };

  state = {};

  componentDidMount() {
    const {
      startFrom = DL.USER_FOLDER,
      match: {
        params: { path, root },
      },
    } = this.props;
    let originPath;
    let originRoot;
    const isStartFromAtRoot = PLACE_VALUES.includes(startFrom);
    if (path) {
      originPath = path;
      originRoot = root;
    } else if (PLACE_VALUES.includes(root)) {
      originPath = isRoot(root) && !isStartFromAtRoot ? startFrom : '';
      originRoot = isRoot(root) ? PLACE.ROOT : root;
    } else if (isStartFromAtRoot) {
      originPath = '';
      originRoot = startFrom;
    } else {
      originPath = startFrom;
      originRoot = PLACE.ROOT;
    }
    this.setPath(originPath, originRoot);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.path !== this.props.match.params.path ||
      prevProps.match.params.root !== this.props.match.params.root
    ) {
      this.setPath(this.props.match.params.path, this.props.match.params.root);
    }
  }

  onSidebarItemClick = item => {
    if (item.place) {
      const root = mapPlaceBackward(item.place);
      this.setState({ path: '', root });
      this.props.history.push(`${this.props.navigationUrl}/${root}`);
    } else {
      this.onCrumbClick({ path: item.key });
    }
  };

  onEntryParentClick = entry => {
    this.onCrumbClick({ path: entry.key });
  };

  onCrumbClick = async item => {
    const { path } = item;
    const root_ = this.state.root;
    this.setState({ path, root: mapPlace(root_) });
    try {
      const entry = await this.getEntryByKey(path);
      this.props.history.push(this.getFolderUrl(entry));
    } catch (e) {
      console.warn('failed to update url');
    }
  };

  getFolderUrl(entry) {
    const { navigationUrl } = this.props;
    return entry ? `${navigationUrl}/${PLACE.ROOT}/${entry.entryId}` : `${navigationUrl}/${PLACE.ROOT}`;
  }

  getEntryByKey(key) {
    return key && key !== '/' ? this.props.sdk.getEntryByKey({ key: Utils.normalizeDestination(key) }) : undefined;
  }

  onEntryClick = entry => {
    // не ждем пока setPath разрезолвится через entryId
    if (entry.scope === 'folder' && entry.key) {
      const root_ = this.state.root;
      this.setState({ path: entry.key, root: mapPlace(root_) });
    }
  };

  async setPath(originPath, originRoot) {
    const { sdk } = this.props;
    let path;
    let root;
    if (Utils.isEntryId(originPath)) {
      try {
        const { key } = await sdk.getEntry(
          {
            entryId: originPath,
          },
          { cancelable: true },
        );
        path = key;
        const root_ = this.state.root;
        root = mapPlace(root_); //PLACE.ROOT;
      } catch (error) {
        if (sdk.isCancel(error)) {
          return;
        }
        console.warn(error);
      }
    } else if (PLACE_VALUES.includes(originRoot) && !originPath) {
      path = '';
      root = originRoot;
    } else {
      path = originPath;
      root = PLACE.ROOT;
      try {
        const entry = await this.getEntryByKey(path);
        this.props.history.replace(this.getFolderUrl(entry));
      } catch (e) {
        console.warn('failed to replace url');
      }
    }
    this.setState({ path, root });
  }

  render() {
    return 'path' in this.state ? (
      <NavigationBase
        {...this.props}
        path={this.state.path}
        root={this.state.root}
        onCrumbClick={this.onCrumbClick}
        onEntryClick={this.onEntryClick}
        onEntryParentClick={this.onEntryParentClick}
        onSidebarItemClick={this.onSidebarItemClick}
      />
    ) : null;
  }
}

export default ServiceNavigation;
