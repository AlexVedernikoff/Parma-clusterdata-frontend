import React from 'react';
import PropTypes from 'prop-types';
import NavigationMinimal from '@kamatech-data-ui/common/src/components/Navigation/NavigationMinimal';
import { DL } from '../../constants/common';
import { PLACE } from './constants';
import { resolveNavigationPath } from './hoc/resolveNavigationPath';
import EntryDialogues, { ENTRY_DIALOG } from '../EntryDialogues/EntryDialogues';
import noop from 'lodash/noop';
import PlaceSelect from './PlaceSelect/PlaceSelect';
import { getPlaceParameters } from './Base/configure';
import { checkEntryActivity } from './util';

class NavigationMinimalService extends React.PureComponent {
  static propTypes = {
    path: PropTypes.string,
    root: PropTypes.string,
    sdk: PropTypes.object,
    onClose: PropTypes.func,
    anchor: PropTypes.any,
    onEntryClick: PropTypes.func,
    clickableScope: PropTypes.string,
    includeClickableType: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    excludeClickableType: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    placeSelectParameters: PropTypes.shape({
      items: PropTypes.array.isRequired,
      quickItems: PropTypes.array,
    }),
  };

  static defaultProps = {
    onClose: noop,
    onEntryClick: noop,
    root: PLACE.ORIGIN_ROOT,
  };

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

  state = {};

  refDialogues = React.createRef();
  refNavigation = React.createRef();
  preventClose = false;

  refresh() {
    if (this.refNavigation.current) {
      this.refNavigation.current.refresh();
    }
  }

  onClose = event => {
    const { anchor } = this.props;
    if (this.preventClose) {
      return;
    }
    if ((anchor && !anchor.contains(event.target)) || (event instanceof KeyboardEvent && event.code === 'Escape')) {
      this.props.onClose(event);
    }
  };

  onEntryClick = entry => {
    if (entry.isLocked) {
      this.unlockEntry(entry);
      return;
    }
    if (entry.scope !== 'folder') {
      this.props.onEntryClick(entry);
      return;
    }
    this.setState({
      path: entry.key,
      root: PLACE.ORIGIN_ROOT,
    });
  };

  onEntryParentClick = entry => {
    this.onCrumbClick({ path: entry.key });
  };

  onCrumbClick = (crumb, event, last) => {
    if (last) {
      this.refresh();
    } else {
      this.setState({
        path: crumb.path,
        root: PLACE.ORIGIN_ROOT,
      });
    }
  };

  onPlaceSelectChange = ({ path, root }) => {
    this.setState({
      path,
      root,
    });
  };

  async unlockEntry(entry) {
    this.preventClose = true;
    await this.refDialogues.current.openDialog({
      dialog: ENTRY_DIALOG.UNLOCK,
      dialogProps: { entry },
    });
    this.preventClose = false;
  }

  render() {
    const { includeClickableType, excludeClickableType, placeSelectParameters, ...props } = this.props;

    const placeSelectNode = placeSelectParameters ? (
      <PlaceSelect
        place={this.state.root}
        path={this.state.path}
        items={placeSelectParameters.items}
        quickItems={placeSelectParameters.quickItems}
        onChange={this.onPlaceSelectChange}
      />
    ) : null;

    return (
      <React.Fragment>
        <NavigationMinimal
          {...props}
          checkEntryActivity={checkEntryActivity(this.props.clickableScope, includeClickableType, excludeClickableType)}
          onClose={this.onClose}
          path={this.state.path}
          place={this.state.root}
          onEntryClick={this.onEntryClick}
          onEntryParentClick={this.onEntryParentClick}
          onCrumbClick={this.onCrumbClick}
          ref={this.refNavigation}
          getPlaceParameters={getPlaceParameters}
          placeSelectNode={placeSelectNode}
          userLogin={DL.USER_LOGIN}
        />
        <EntryDialogues ref={this.refDialogues} sdk={this.props.sdk} />
      </React.Fragment>
    );
  }
}

export default resolveNavigationPath(NavigationMinimalService);
