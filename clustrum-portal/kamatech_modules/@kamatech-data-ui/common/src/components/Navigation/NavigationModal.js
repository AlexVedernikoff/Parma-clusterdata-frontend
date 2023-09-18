import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '../Dialog/Dialog';
import { BaseNavigationModal } from '@widgets/base-navigation-modal';

import noop from 'lodash/noop';

class NavigationModal extends React.Component {
  static propTypes = {
    path: PropTypes.string,
    place: PropTypes.string,
    sdk: PropTypes.object,
    linkWrapper: PropTypes.func,
    quickItems: PropTypes.array,
    crumbLinkWrapper: PropTypes.func,
    onSidebarItemClick: PropTypes.func,
    onClose: PropTypes.func,
    onNavigate: PropTypes.func,
    getPlaceParameters: PropTypes.func,
  };
  static defaultProps = {
    onCrumbClick: noop,
    onEntryClick: noop,
    onEntryParentClick: noop,
    onEntryContextClick: noop,
    onSidebarItemClick: noop,
  };
  state = {};
  static getDerivedStateFromProps(props, state) {
    const { path, place } = props;
    if (path === state.initialPath && place === state.initialPlace) {
      return null;
    } else {
      return {
        path,
        place,
        initialPath: path,
        initialPlace: place,
      };
    }
  }
  refEntries = React.createRef();
  navigate(entry, event) {
    if (this.props.onNavigate) {
      this.props.onNavigate(entry, event);
    } else if (entry.scope === 'folder') {
      event.preventDefault();
      this.setState({
        path: entry.key,
        place: entry.place,
      });
    }
  }
  onCrumbClick = (item, event, last) => {
    if (!last) {
      this.navigate(
        {
          scope: 'folder',
          key: item.path,
        },
        event,
      );
    }
    this.props.onCrumbClick(item, event, last);
  };
  onEntryClick = (entry, event) => {
    if (!entry.isLocked) {
      this.navigate(entry, event);
    }
    this.props.onEntryClick(entry, event);
  };
  onEntryParentClick = (entry, event) => {
    this.navigate(entry, event);
    this.props.onEntryParentClick(entry, event);
  };
  onSidebarItemClick = (entry, event) => {
    this.navigate(entry, event);
    this.props.onSidebarItemClick(entry, event);
  };
  refresh() {
    if (this.refEntries.current) {
      this.refEntries.current.refresh();
    }
  }
  render() {
    const {
      linkWrapper,
      crumbLinkWrapper,
      onCrumbClick, // eslint-disable-line no-unused-vars
      onSidebarItemClick, // eslint-disable-line no-unused-vars
      quickItems,
      onClose,
      createMenuItems,
      onCreateMenuClick,
      visible,
      ...props
    } = this.props;
    const { path, place } = this.state;
    return (
      <Dialog visible={visible} onClose={onClose}>
        <BaseNavigationModal sdk={this.props.sdk} />
      </Dialog>
    );
  }
}

export default NavigationModal;
