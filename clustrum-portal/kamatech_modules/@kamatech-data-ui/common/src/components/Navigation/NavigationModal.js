import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar/Sidebar';
import NavigationEntries from './NavigationEntries';
import Dialog from '../Dialog/Dialog';

import cn from 'bem-cn-lite';
import noop from 'lodash/noop';

// import './NavigationModal.scss';
import NavigationBreadcrumbs from './NavigationBreadcrumbs/NavigationBreadcrumbs';
import CreateDropdown from './CreateDropdown/CreateDropdown';

const b = cn('yc-navigation');

class NavigationModal extends React.Component {
  static propTypes = {
    path: PropTypes.string,
    place: PropTypes.string,
    linkWrapper: PropTypes.func,
    quickItems: PropTypes.array,
    crumbLinkWrapper: PropTypes.func,
    onSidebarItemClick: PropTypes.func,
    onClose: PropTypes.func,
    onNavigate: PropTypes.func,
    getPlaceParameters: PropTypes.func.isRequired,
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
        <div className={b({ modal: true })}>
          <div className={b('sidebar')}>
            <Sidebar
              path={path}
              currentPlace={place}
              quickItems={quickItems}
              linkWrapper={linkWrapper}
              onItemClick={this.onSidebarItemClick}
              getPlaceParameters={this.props.getPlaceParameters}
            />
          </div>
          <div className={b('content')}>
            <NavigationEntries
              ref={this.refEntries}
              {...props}
              path={path ? path : ''}
              modalView={true}
              place={place}
              linkWrapper={linkWrapper}
              createMenuItems={createMenuItems}
              onCreateMenuClick={onCreateMenuClick}
              onEntryClick={this.onEntryClick}
              onEntryParentClick={this.onEntryParentClick}
              getPlaceParameters={this.props.getPlaceParameters}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

export default NavigationModal;
