import React, { Component } from 'react';
import TemplateDialog from '../../Dialog/templates/TemplateDialog/TemplateDialog';
import { TextInput } from 'lego-on-react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { ERROR_TYPE } from '../constants';

import block from 'bem-cn-lite';
// import './DialogRenameEntry.scss';

const b = block('yc-dialog-rename-entry');

const TEXT = {
  TITLE: 'Переименовать',
  ERROR: 'Не удалось переименовать',
  INIT_NAME: 'название',
};

class DialogRenameEntry extends Component {
  static propTypes = {
    sdk: PropTypes.object,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    dialogProps: PropTypes.shape({
      entryId: PropTypes.string.isRequired,
      initName: PropTypes.string,
      title: PropTypes.string,
      errorText: PropTypes.string,
      withError: PropTypes.bool,
      onNotify: PropTypes.func,
    }).isRequired,
  };

  static defaultProps = {
    dialogProps: {
      initName: TEXT.INIT_NAME,
      title: TEXT.TITLE,
      errorText: TEXT.ERROR,
      withError: true,
      onNotify: noop,
    },
  };

  state = {
    name: this.dialogProps.initName,
    progress: false,
    showError: false,
  };

  get dialogProps() {
    return { ...DialogRenameEntry.defaultProps.dialogProps, ...this.props.dialogProps };
  }

  onChange = value => {
    this.setState({ name: value, showError: false });
  };

  onClickButtonApply = () => {
    const { entryId } = this.dialogProps;
    const { name } = this.state;
    this.setState({ progress: true });
    this.props.sdk
      .renameEntry({ entryId, newName: name })
      .then(data => {
        this.setState({ progress: false });
        this.props.onClose({ status: 'success', data });
        return data;
      })
      .catch(error => {
        this.setState({ progress: false, showError: this.dialogProps.withError });
        this.dialogProps.onNotify({ error, message: this.dialogProps.errorText, type: ERROR_TYPE });
      });
  };

  onClose = () => {
    if (this.state.progress) {
      return;
    }
    this.props.onClose({ status: 'close' });
  };

  setTextInputRef = ref => {
    this._textInputRef = ref;
    if (this._textInputRef) {
      this._textInputRef.focus();
      this._textInputRef.select();
    }
  };

  onFocusTextInput = e => {
    const length = e.target.value.length;
    e.target.setSelectionRange(length, length);
  };

  render() {
    const { name, progress, showError } = this.state;
    const { visible } = this.props;
    const { title, errorText } = this.dialogProps;

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
          <TextInput
            view="default"
            tone="default"
            theme="normal"
            innerRef={this.setTextInputRef}
            onFocus={this.onFocusTextInput}
            onChange={this.onChange}
            placeholder="Название"
            text={name}
            hasClear
          />
        </div>
      </TemplateDialog>
    );
  }
}

export default DialogRenameEntry;
