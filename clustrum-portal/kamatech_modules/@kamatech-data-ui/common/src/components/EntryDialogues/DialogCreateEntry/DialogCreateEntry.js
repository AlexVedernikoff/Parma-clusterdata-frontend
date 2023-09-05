import React, { Component } from 'react';
import TemplateDialog from '../../Dialog/templates/TemplateDialog/TemplateDialog';
import PropTypes from 'prop-types';
import PathSelect from '../../PathSelect/PathSelect';

import block from 'bem-cn-lite';
// import './DialogCreateEntry.scss';
import { normalizeDestination } from '../../Navigation/util';
import { ERROR_TYPE } from '../constants';

const b = block('yc-dialog-create-entry');

class DialogCreateEntry extends Component {
  static propTypes = {
    sdk: PropTypes.object,
    onClose: PropTypes.func,
    onApply: PropTypes.func,
    visible: PropTypes.bool,
    dialogProps: PropTypes.shape({
      path: PropTypes.string.isRequired,
      title: PropTypes.string,
      defaultName: PropTypes.string,
      errorText: PropTypes.string,
      textButtonApply: PropTypes.string,
      textButtonCancel: PropTypes.string,
      withError: PropTypes.bool,
      onNotify: PropTypes.func,
    }).isRequired,
    defaultDialogProps: PropTypes.object,
  };

  state = {
    entryName: '',
    path: this.dialogProps.path,
    progress: false,
    showError: false,
  };

  componentDidMount() {
    setTimeout(() => {
      if (this._textInputRef) {
        this._textInputRef.focus();
      }
    }, 0);
  }

  get dialogProps() {
    return { ...this.props.defaultDialogProps, ...this.props.dialogProps };
  }

  onChange = value => {
    const forbiddenCharacters = /([\\<>\|?*[\]=\/])+/g;

    !forbiddenCharacters.test(value) &&
      this.state.entryName.length < 64 &&
      this.setState({ entryName: value, showError: false });
  };

  onClickButtonApply = async () => {
    this.setState({ progress: true });
    const path = normalizeDestination(this.state.path);
    const entryName = this.state.entryName || this.dialogProps.defaultName;
    const key = path === '/' ? entryName : path + entryName;

    try {
      const data = await this.props.onApply({ key });
      this.setState({ progress: false });
      this.props.onClose({ status: 'success', data });
      return data;
    } catch (error) {
      this.setState({ progress: false, showError: this.dialogProps.withError });
      this.dialogProps.onNotify({
        error,
        message: this.dialogProps.errorText,
        type: ERROR_TYPE,
      });
      return null;
    }
  };

  onClose = () => {
    if (this.state.progress) {
      return;
    }
    this.props.onClose({ status: 'close' });
  };

  setTextInputRef = ref => {
    this._textInputRef = ref;
  };

  onChooseFolder = path => {
    this.setState({ path: normalizeDestination(path) }, () => {
      this._textInputRef.focus();
    });
  };

  onClickFolderSelect = () => {
    if (this.state.showError) {
      this.setState({ showError: false });
    }
  };

  render() {
    const { entryName, progress, showError, path } = this.state;
    const { visible } = this.props;
    const {
      title,
      errorText,
      defaultName,
      textButtonApply,
      textButtonCancel,
    } = this.dialogProps;

    return (
      <TemplateDialog
        caption={title}
        visible={visible}
        progress={progress}
        onClickButtonApply={this.onClickButtonApply}
        onClose={this.onClose}
        showError={showError}
        errorText={errorText}
        textButtonApply={textButtonApply}
        textButtonCancel={textButtonCancel}
        listenKeyEnter={visible}
      >
        <div className={b('content')}>
          <PathSelect
            sdk={this.props.sdk}
            defaultPath={path}
            withInput={true}
            onChoosePath={this.onChooseFolder}
            onClick={this.onClickFolderSelect}
            inputRef={this.setTextInputRef}
            inputValue={entryName}
            onChangeInput={this.onChange}
            placeholder={defaultName}
          />
        </div>
      </TemplateDialog>
    );
  }
}

export default DialogCreateEntry;
