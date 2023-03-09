import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import DialogCopyEntry from './DialogCopyEntry/DialogCopyEntry';
import DialogRenameEntry from './DialogRenameEntry/DialogRenameEntry';
import DialogMoveEntry from './DialogMoveEntry/DialogMoveEntry';
import DialogDeleteEntry from './DialogDeleteEntry/DialogDeleteEntry';
import DialogCreateFolder from './DialogCreateFolder/DialogCreateFolder';
import DialogSaveWidget from './DialogSaveWidget/DialogSaveWidget';
import DialogSaveDashboard from './DialogSaveDashboard/DialogSaveDashboard';
import DialogDescribeEntry from './DialogDescribeEntry/DialogDescribeEntry';

const DIALOG = {
    COPY: 'copy',
    MOVE: 'move',
    RENAME: 'rename',
    DELETE: 'delete',
    CREATE_FOLDER: 'create_folder',
    SAVE_DASHBOARD: 'save_dashboard',
    SAVE_WIDGET: 'save_widget'
};

const initState = {
    dialog: null,
    resolveOpenDialog: null,
    visible: false,
    dialogProps: null,
    updateKey: 0
};

class EntryDialogues extends PureComponent {
    static propTypes = {
        sdk: PropTypes.object.isRequired
    };

    static dialogs = {};

    state = {...initState};

    openDialog({dialog, dialogProps = {}}) {
        return new Promise(resolveOpenDialog => {
            this.setState({
                dialog,
                resolveOpenDialog,
                dialogProps,
                visible: true,
                updateKey: this.state.updateKey + 1
            });
        });
    }

    _onClose = ({status, data = {}}) => {
        const {resolveOpenDialog} = this.state;
        this.setState({...initState});
        resolveOpenDialog({status, data});
    };

    render() {
        const props = {
            sdk: this.props.sdk,
            ...this.state,
            onClose: this._onClose
        };

        const serviceDialog = EntryDialogues.dialogs[this.state.dialog];
        if (serviceDialog) {
            return React.createElement(serviceDialog, {
                key: this.state.updateKey,
                ...props
            });
        }

        switch (this.state.dialog) {
            case DIALOG.COPY:
                return <DialogCopyEntry key={this.state.updateKey} {...props}/>;
            case DIALOG.MOVE:
                return <DialogMoveEntry key={this.state.updateKey} {...props}/>;
            case DIALOG.RENAME:
                return <DialogRenameEntry key={this.state.updateKey} {...props}/>;
            case DIALOG.DESCRIBE:
                return <DialogDescribeEntry key={this.state.updateKey} {...props}/>;
            case DIALOG.DELETE:
                return <DialogDeleteEntry key={this.state.updateKey} {...props}/>;
            case DIALOG.CREATE_FOLDER:
                return <DialogCreateFolder key={this.state.updateKey} {...props}/>;
            case DIALOG.SAVE_DASHBOARD:
                return <DialogSaveDashboard key={this.state.updateKey} {...props}/>;
            case DIALOG.SAVE_WIDGET:
                return <DialogSaveWidget key={this.state.updateKey} {...props}/>;
            default:
                return null;
        }
    }
}


export default EntryDialogues;
