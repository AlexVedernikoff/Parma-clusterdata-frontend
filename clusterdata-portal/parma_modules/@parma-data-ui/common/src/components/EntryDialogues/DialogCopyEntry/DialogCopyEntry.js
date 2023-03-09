import React, {Component} from 'react';
import TemplateDialog from '../../Dialog/templates/TemplateDialog/TemplateDialog';
import PathSelect from '../../PathSelect/PathSelect';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import {ERROR_TYPE} from '../constants';

import block from 'bem-cn-lite';
// import './DialogCopyEntry.scss';

const b = block('yc-dialog-copy-entry');

const TEXT = {
    TITLE: 'Куда скопировать?',
    ERROR: 'Не удалось скопировать.'
};

class DialogCopyEntry extends Component {
    static propTypes = {
        sdk: PropTypes.object,
        onClose: PropTypes.func,
        visible: PropTypes.bool,
        dialogProps: PropTypes.shape({
            entryId: PropTypes.string.isRequired,
            initDestination: PropTypes.string,
            title: PropTypes.string,
            errorText: PropTypes.string,
            withError: PropTypes.bool,
            onNotify: PropTypes.func
        }).isRequired
    };

    static defaultProps = {
        dialogProps: {
            initDestination: '/',
            title: TEXT.TITLE,
            errorText: TEXT.ERROR,
            withError: true,
            onNotify: noop
        }
    }

    state = {
        destination: this.dialogProps.initDestination,
        name: '',
        progress: false,
        showError: false
    }

    componentDidMount() {
        setTimeout(() => {
            if (this._textInputRef) {
                this._textInputRef.focus();
            }
        }, 0);
    }

    get dialogProps() {
        return {...DialogCopyEntry.defaultProps.dialogProps, ...this.props.dialogProps};
    }

    onChange = name => {
        this.setState({name, showError: false});
    }

    onClickButtonApply = () => {
        const {entryId} = this.dialogProps;
        const {destination, name} = this.state;
        this.setState({progress: true});
        this.props.sdk.copyEntry({entryId, destination, name})
            .then(data => {
                this.setState({progress: false});
                this.props.onClose({status: 'success', data});
                return data;
            })
            .catch((error) => {
                this.setState({progress: false, showError: this.dialogProps.withError});
                this.dialogProps.onNotify({error, message: this.dialogProps.errorText, type: ERROR_TYPE});
            });
    }

    onClose = () => {
        if (this.state.progress) {
            return;
        }
        this.props.onClose({status: 'close'});
    }

    setTextInputRef = ref => {
        this._textInputRef = ref;
    }

    onChooseFolder = destination => {
        this.setState({destination}, () => {
            this._textInputRef.focus();
        });
    }

    onClickFolderSelect = () => {
        if (this.state.showError) {
            this.setState({showError: false});
        }
    }

    render() {
        const {destination, progress, showError, name} = this.state;
        const {visible} = this.props;
        const {title, errorText} = this.dialogProps;

        return (
            <TemplateDialog
                caption={title}
                visible={visible}
                progress={progress}
                onClickButtonApply={this.onClickButtonApply}
                onClose={this.onClose}
                showError={showError}
                errorText={errorText}
                listenKeyEnter={visible}
            >
                <div className={b('content')}>
                    <PathSelect
                        sdk={this.props.sdk}
                        defaultPath={destination}
                        withInput={true}
                        onChoosePath={this.onChooseFolder}
                        onClick={this.onClickFolderSelect}
                        inputRef={this.setTextInputRef}
                        inputValue={name}
                        onChangeInput={this.onChange}
                        placeholder="Название"
                    />
                </div>
            </TemplateDialog>
        );
    }
}

export default DialogCopyEntry;
