import React from 'react';
import PropTypes from 'prop-types';
import NavigationModal from '@kamatech-data-ui/common/src/components/Navigation/NavigationModal';
import { PLACE } from './constants';
import { resolveNavigationPath } from './hoc/resolveNavigationPath';

class ServiceNavigationModal extends React.PureComponent {
  static propTypes = {
    path: PropTypes.string,
    root: PropTypes.string,
    sdk: PropTypes.object,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    onChangeFavorite: PropTypes.func,
    currentPageEntry: PropTypes.object,
  };

  static defaultProps = {
    root: PLACE.ORIGIN_ROOT,
  };

  state = {};

  static getDerivedStateFromProps(props, state) {
    const { path, root } = props;
    if (path === state.initialPath && root === state.initialRoot) {
      return null;
    } else {
      return {
        path,
        root,
        initialPath: path,
        initialRoot: root,
      };
    }
  }

  onNavigate = (entry, event) => {
    if (entry.scope === 'folder' || entry.place) {
      event.preventDefault();
      this.setState({
        path: entry.key,
        root: entry.place,
      });
    }
  };

  render() {
    const { path, root } = this.state;
    return <NavigationModal sdk={this.props.sdk} path={path} {...this.props} />;
  }
}

export default resolveNavigationPath(ServiceNavigationModal);
