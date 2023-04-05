import React from 'react';
import PropTypes from 'prop-types';
import EntryContextMenu from '@parma-data-ui/common/src/components/Navigation/EntryContextMenu/EntryContextMenu';
import { withConfiguredEntryContextMenu, ENTRY_CONTEXT_MENU_ACTION } from '../../hoc/withConfiguredEntryContextMenu';
import EntryDialogues, { ENTRY_DIALOG, entryDialoguesNotify } from '../EntryDialogues/EntryDialogues';
import Utils from '../../utils';
import navigateHelper from '../../libs/navigateHelper';
import ErrorDialog from '../ErrorDialog/ErrorDialog';

const ConfiguredEntryContextMenu = withConfiguredEntryContextMenu(EntryContextMenu);
const defaultPopupDirections = ['bottom-center', 'bottom-left', 'bottom-right'];

class EntryContextMenuService extends React.PureComponent {
  refDialogues = React.createRef();
  refErrorDialog = React.createRef();

  update({ entry }) {
    const { onUpdateEntry } = this.props;
    if (typeof onUpdateEntry === 'function') {
      onUpdateEntry({ entry });
    } else {
      window.location.reload();
    }
  }

  async renameEntry(entry) {
    const response = await this.refDialogues.current.openDialog({
      dialog: ENTRY_DIALOG.RENAME,
      dialogProps: {
        entryId: entry.entryId,
        initName: entry.name || Utils.getNameByIndex({ path: entry.key, index: -1 }),
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.RENAME, this.refErrorDialog),
      },
    });
    if (response.status === 'success') {
      this.update({ entry: response.data[0] });
    }
  }

  async describeEntry(entry) {
    const response = await this.refDialogues.current.openDialog({
      dialog: ENTRY_DIALOG.DESCRIBE,
      dialogProps: {
        entryId: entry.entryId,
        description: entry.description,
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.DESCRIBE, this.refErrorDialog),
      },
    });
    if (response.status === 'success') {
      this.update({ entry: response.data[0] });
    }
  }

  async moveEntry(entry) {
    const response = await this.refDialogues.current.openDialog({
      dialog: ENTRY_DIALOG.MOVE,
      dialogProps: {
        entryId: entry.entryId,
        initDestination: Utils.getPathBefore({ path: entry.key }),
        inactiveEntryKey: entry.scope === 'folder' ? entry.key : undefined,
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.MOVE, this.refErrorDialog),
      },
    });
    if (response.status === 'success') {
      this.update({ entry: response.data[0] });
    }
  }

  async copyEntry(entry) {
    const response = await this.refDialogues.current.openDialog({
      dialog: ENTRY_DIALOG.COPY,
      dialogProps: {
        entryId: entry.entryId,
        initDestination: Utils.getPathBefore({ path: entry.key }),
        withError: false,
        onNotify: entryDialoguesNotify(ENTRY_DIALOG.COPY, this.refErrorDialog),
      },
    });
    if (response.status === 'success') {
      // browser blocked not trusted event (async)
      // https://www.w3.org/TR/DOM-Level-3-Events/#trusted-events
      navigateHelper.open(response.data[0]);
    }
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
    if (response.status === 'success') {
      navigateHelper.openPlace(entry);
    }
  }

  async accessEntry(entry) {
    await this.refDialogues.current.openDialog({
      dialog: ENTRY_DIALOG.ACCESS,
      dialogProps: {
        entry,
      },
    });
  }

  onMenuClick = ({ entry, action }) => {
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

  onCloseEntryContextMenu = event => {
    if (
      (this.props.anchor && !this.props.anchor.contains(event.target)) ||
      (event instanceof KeyboardEvent && event.key === 'Escape')
    ) {
      this.closeEntryContextMenu();
    }
  };

  closeEntryContextMenu = () => {
    this.props.onClose();
  };

  render() {
    return (
      Boolean(this.props.anchor) && (
        <React.Fragment>
          <ConfiguredEntryContextMenu
            hasTail={this.props.hasTail}
            visible={this.props.visible}
            entry={this.props.entry}
            anchor={this.props.anchor}
            onMenuClick={this.onMenuClick}
            onClose={this.onCloseEntryContextMenu}
            popupDirections={this.props.popupDirections}
          />
          <EntryDialogues ref={this.refDialogues} sdk={this.props.sdk} />
          <ErrorDialog ref={this.refErrorDialog} />
        </React.Fragment>
      )
    );
  }
}

EntryContextMenuService.propTypes = {
  onClose: PropTypes.func,
  anchor: PropTypes.any,
  visible: PropTypes.bool,
  entry: PropTypes.object,
  sdk: PropTypes.object,
  onUpdateEntry: PropTypes.func,

  popupDirections: PropTypes.array,
  hasTail: PropTypes.bool,
};

EntryContextMenuService.defaultProps = {
  hasTail: true,
  popupDirections: defaultPopupDirections,
};

export default EntryContextMenuService;
