import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import NavigationInline from '@parma-data-ui/common/src/components/Navigation/NavigationInline';
import { PLACE } from '../constants';
import '../../EntryIcon/EntryIcon';
import Utils from '../../../utils';
import EntryDialogues, { ENTRY_DIALOG, entryDialoguesNotify } from '../../EntryDialogues/EntryDialogues';
import { getEntryContextMenuItems, ENTRY_CONTEXT_MENU_ACTION } from '../../../hoc/withConfiguredEntryContextMenu';
import { DL } from '../../../constants/common';
import navigateHelper from '../../../libs/navigateHelper';
import { mapPlace, mapPlaceBackward } from '../util';
import ErrorDialog from '../../ErrorDialog/ErrorDialog';
import { getQuickItems, getCreateMenuItemsInternal, getCreateMenuItemsExternal, getPlaceParameters } from './configure';

const geEntryUrl = (entry, navigationUrl, place) => {
  const link = navigateHelper.redirectUrlSwitcher(entry, place);
  const folderLink = navigationUrl
    ? `${navigationUrl}/${PLACE.ROOT}/${entry.entryId}`
    : `${new window.URL(linkWithHost(link)).pathname}`;
  return entry.scope === 'folder' ? folderLink : link;
};

const linkWithHost = link => {
  if (link.includes('http')) {
    return link;
  }

  return `${locationWithoutSlash()}${link}`;
};

const locationWithoutSlash = () => {
  return window.location.origin;
};

class LinkWrapper extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    entry: PropTypes.object,
    inactive: PropTypes.bool,
    children: PropTypes.node,
    onClick: PropTypes.func,
    navigationUrl: PropTypes.string,
    place: PropTypes.string,
  };
  renderEntryLink() {
    const { entry, className, onClick, navigationUrl } = this.props;
    const place = this.props.place;
    const link = geEntryUrl(entry, navigationUrl, place);
    return entry.scope === 'folder' ? (
      <Link to={link} className={className}>
        {this.props.children}
      </Link>
    ) : (
      <a href={link} className={className} onClick={onClick}>
        {this.props.children}
      </a>
    );
  }
  renderUrl() {
    const { entry, className } = this.props;
    return (
      <a href={entry.url} className={className}>
        {this.props.children}
      </a>
    );
  }
  render() {
    const { className, onClick, entry } = this.props;
    if (entry.entryId) {
      return this.renderEntryLink();
    }
    if (entry.url) {
      return this.renderUrl();
    }
    return (
      <span className={className} onClick={onClick}>
        {this.props.children}
      </span>
    );
  }
}

class CrumbLinkWrapper extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    item: PropTypes.object,
    last: PropTypes.bool,
    children: PropTypes.node,
  };
  onClick = event => {
    if (this.props.last) {
      event.preventDefault();
    }
  };
  render() {
    const { className } = this.props;
    return (
      <span className={className} onClick={this.onClick}>
        {this.props.children}
      </span>
    );
  }
}

// eslint-disable-next-line react/display-name
const linkWrapper = propsBefore => propsAfter => {
  return <LinkWrapper {...propsBefore} {...propsAfter} />;
};

const crumbLinkWrapper = props => {
  return <CrumbLinkWrapper {...props} />;
};

export default class NavigationBase extends React.Component {
  static propTypes = {
    sdk: PropTypes.object,
    root: PropTypes.string,
    path: PropTypes.string,
    history: PropTypes.object,
    onUpdate: PropTypes.func,
    navConstructor: PropTypes.func,
    navigationUrl: PropTypes.string,
    onCrumbClick: PropTypes.func,
    onEntryClick: PropTypes.func,
    currentPageEntry: PropTypes.object,

    onActionCreateDataset: PropTypes.func,
    onActionCreate: PropTypes.func,
  };
  static defaultProps = {
    navConstructor: NavigationInline,
    root: PLACE.ROOT,
  };
  constructor(props) {
    super(props);
    this.quickItems = getQuickItems();
  }
  refNavigation = React.createRef();
  refDialogues = React.createRef();
  refErrorDialog = React.createRef();
  update(response, entryDialog, entry = {}) {
    const { currentPageEntry } = this.props;
    if (response.status === 'success') {
      this.refNavigation.current.refresh();
      if (this.props.onUpdate) {
        this.props.onUpdate(response);
      } else if (currentPageEntry) {
        switch (entryDialog) {
          case ENTRY_DIALOG.RENAME:
            if (currentPageEntry.entryId === entry.entryId) {
              window.location.reload();
            }
            break;
          case ENTRY_DIALOG.MOVE:
            if ((currentPageEntry.key || '').startsWith(entry.key)) {
              window.location.reload();
            }
            break;
          case ENTRY_DIALOG.DELETE:
            if ((currentPageEntry.key || '').startsWith(entry.key)) {
              navigateHelper.openPlace(entry);
            }
            break;
        }
      }
    }
  }
  async createFolder() {
    const response = await this.refDialogues.current.openDialog({
      dialog: ENTRY_DIALOG.CREATE_FOLDER,
      dialogProps: {
        path: this.props.path,
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.CREATE_FOLDER, this.refErrorDialog),
      },
    });
    this.update(response, ENTRY_DIALOG.CREATE_FOLDER);
  }
  async renameEntry(entry) {
    const response = await this.refDialogues.current.openDialog({
      dialog: ENTRY_DIALOG.RENAME,
      dialogProps: {
        entryId: entry.entryId,
        initName: entry.name,
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.RENAME, this.refErrorDialog),
      },
    });
    this.update(response, ENTRY_DIALOG.RENAME, entry);
  }
  async describeEntry(entry) {
    const response = await this.refDialogues.current.openDialog({
      dialog: ENTRY_DIALOG.describe,
      dialogProps: {
        entryId: entry.entryId,
        description: entry.description,
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.DESCRIBE, this.refErrorDialog),
      },
    });
    this.update(response, ENTRY_DIALOG.DESCRIBE, entry);
  }
  async moveEntry(entry) {
    const response = await this.refDialogues.current.openDialog({
      dialog: ENTRY_DIALOG.MOVE,
      dialogProps: {
        entryId: entry.entryId,
        initDestination: this.props.path,
        inactiveEntryKey: entry.scope === 'folder' ? entry.key : undefined,
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.MOVE, this.refErrorDialog),
      },
    });
    this.update(response, ENTRY_DIALOG.MOVE, entry);
  }
  async copyEntry(entry) {
    const response = await this.refDialogues.current.openDialog({
      dialog: ENTRY_DIALOG.COPY,
      dialogProps: {
        entryId: entry.entryId,
        initDestination: this.props.path,
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.COPY, this.refErrorDialog),
      },
    });
    this.update(response, ENTRY_DIALOG.COPY, entry);
  }
  async deleteEntry(entry) {
    const response = await this.refDialogues.current.openDialog({
      dialog: ENTRY_DIALOG.DELETE,
      dialogProps: {
        entry,
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.DELETE, this.refErrorDialog),
      },
    });
    this.update(response, ENTRY_DIALOG.DELETE, entry);
  }
  async createDashboard() {
    const response = await this.refDialogues.current.openDialog({
      dialog: ENTRY_DIALOG.CREATE_DASHBOARD,
      dialogProps: {
        path: this.props.path,
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.CREATE_DASHBOARD, this.refErrorDialog),
      },
    });
    if (DL.IS_INTERNAL && response.status === 'success') {
      window.location.assign(`${this.props.sdk.config.endpoints.dash}/${response.data.entryId}`);
    }
    this.update(response, ENTRY_DIALOG.CREATE_DASHBOARD);
  }
  async accessEntry(entry) {
    await this.refDialogues.current.openDialog({
      dialog: ENTRY_DIALOG.ACCESS,
      dialogProps: {
        entry,
      },
    });
  }
  async unlockEntry(entry) {
    await this.refDialogues.current.openDialog({
      dialog: ENTRY_DIALOG.UNLOCK,
      dialogProps: {
        entry,
      },
    });
  }
  onCreateMenuClick = type => {
    Utils.emitBodyClick();
    const { path, sdk } = this.props;
    switch (type) {
      case 'folder': {
        this.createFolder();
        return;
      }
      case 'dashboard': {
        this.createDashboard();
        return;
      }
      case 'connection':
        const currentPath = path ? `?currentPath=${encodeURIComponent(path)}` : '';
        window.location.assign(`${sdk.config.endpoints.connections}/new${currentPath}`);
        break;
      case 'dataset': {
        const currentPath = path ? `?currentPath=${encodeURIComponent(path)}` : '';
        window.location.assign(`${sdk.config.endpoints.dataset}/new${currentPath}`);
        break;
      }
      case 'widget': {
        const queryPath = path ? `/?currentPath=${encodeURIComponent(path)}` : '';
        window.location.assign(`${sdk.config.endpoints.wizard}${queryPath}`);
        break;
      }
      case 'script':
      case 'legacyWizard': {
        if (this.props.onActionCreate) {
          this.defaulActionCreate(type);
        } else {
          // TODO: возможно стоит оторвать часть с new в enpoints.editor после того как он выйдет в prod
          const place = this.props.root ? `&place=${encodeURIComponent(this.props.root)}` : '';
          const currentPath = path ? `&currentPath=${encodeURIComponent(path)}` : '';
          const url =
            type === 'script' ? sdk.config.endpoints.editor : sdk.config.endpoints.legacyWizard + place + currentPath;
          window.location.assign(url);
        }
        break;
      }
      default:
        this.defaulActionCreate(type);
    }
  };
  defaulActionCreate(type) {
    const { path, root, onActionCreate } = this.props;
    if (onActionCreate) {
      onActionCreate(type, {
        place: root,
        currentPath: path,
      });
    }
  }
  onContextMenuClick = ({ entry, action }) => {
    switch (action) {
      case ENTRY_CONTEXT_MENU_ACTION.RENAME: {
        return this.renameEntry(entry);
      }
      case ENTRY_CONTEXT_MENU_ACTION.DESCRIBE: {
        return this.describeEntry(entry);
      }
      case ENTRY_CONTEXT_MENU_ACTION.MOVE: {
        return this.moveEntry(entry);
      }
      case ENTRY_CONTEXT_MENU_ACTION.COPY: {
        return this.copyEntry(entry);
      }
      case ENTRY_CONTEXT_MENU_ACTION.DELETE: {
        return this.deleteEntry(entry);
      }
      case ENTRY_CONTEXT_MENU_ACTION.ACCESS: {
        return this.accessEntry(entry);
      }
      case ENTRY_CONTEXT_MENU_ACTION.COPY_LINK: {
        // do nothing
        return false;
      }
      default:
        return false;
    }
  };
  onEntryClick = (entry, event) => {
    if (entry.isLocked) {
      event.preventDefault();
      this.unlockEntry(entry);
    } else if (this.props.onEntryClick) {
      this.props.onEntryClick(entry, event);
    }
  };
  onCrumbClick = (item, event, last, first) => {
    if (first) {
      // При клике на первом элементе заголовка повторяем действия
      // по клику на соответствующем пункте в меню слева
      if (item.place) {
        const root = mapPlaceBackward(item.place);
        this.setState({ path: '', root });
        this.props.history.push(`${this.props.navigationUrl}/${root}`);
      } else {
        this.onCrumbClick({ path: item.key });
      }
    } else if (last) {
      event.preventDefault();
      this.refresh();
    } else if (this.props.onCrumbClick) {
      this.props.onCrumbClick(item, event, last);
    }
  };
  refresh() {
    if (this.refNavigation.current) {
      this.refNavigation.current.refresh();
    }
  }
  render() {
    const { root, navConstructor, sdk, navigationUrl, ...props } = this.props;
    const place = mapPlace(root);
    const navigationNode = React.createElement(navConstructor, {
      ref: this.refNavigation,
      sdk,
      place: place,
      quickItems: this.quickItems,
      createMenuItems: DL.IS_INTERNAL ? getCreateMenuItemsInternal() : getCreateMenuItemsExternal(),
      onCreateMenuClick: this.onCreateMenuClick,
      linkWrapper: linkWrapper({ navigationUrl, place }),
      crumbLinkWrapper,
      getContextMenuItems: getEntryContextMenuItems,
      onContextMenuClick: this.onContextMenuClick,
      showHidden: Boolean(Utils.restore('dlShowHiddenEntries')),
      userLogin: DL.USER_LOGIN,
      getPlaceParameters,
      ...props,
      onEntryClick: this.onEntryClick,
      onCrumbClick: this.onCrumbClick,
    });
    return (
      <Fragment>
        {navigationNode}
        <EntryDialogues ref={this.refDialogues} sdk={sdk} />
        <ErrorDialog ref={this.refErrorDialog} />
      </Fragment>
    );
  }
}
