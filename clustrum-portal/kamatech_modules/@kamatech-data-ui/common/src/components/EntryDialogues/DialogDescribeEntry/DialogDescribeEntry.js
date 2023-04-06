import React, { Component } from 'react';
import TemplateDialog from '../../Dialog/templates/TemplateDialog/TemplateDialog';
import { TextArea } from 'lego-on-react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { ERROR_TYPE } from '../constants';

import block from 'bem-cn-lite';

const b = block('yc-dialog-describe-entry');

const TEXT = {
  TITLE: 'Описание',
  ERROR: 'Не удалось добавить описание',
  INIT_DESCRIPTION: 'Описание',
};

class DialogDescribeEntry extends Component {
  static propTypes = {
    sdk: PropTypes.object,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    dialogProps: PropTypes.shape({
      entryId: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      errorText: PropTypes.string,
      withError: PropTypes.bool,
      onNotify: PropTypes.func,
    }).isRequired,
  };

  static defaultProps = {
    dialogProps: {
      title: TEXT.TITLE,
      description: TEXT.INIT_DESCRIPTION,
      errorText: TEXT.ERROR,
      withError: true,
      onNotify: noop,
    },
  };

  state = {
    description: this.dialogProps.description,
    progress: false,
    showError: false,
  };

  get dialogProps() {
    return { ...DialogDescribeEntry.defaultProps.dialogProps, ...this.props.dialogProps };
  }

  onChange = value => {
    this.setState({ description: value, showError: false });
  };

  onClickButtonApply = () => {
    const { entryId } = this.dialogProps;
    const { description } = this.state;
    this.setState({ progress: true });
    this.props.sdk
      .describeEntry({ entryId, description })
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
    const { description, progress, showError } = this.state;
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
          <TextArea
            view="default"
            tone="default"
            theme="normal"
            innerRef={this.setTextInputRef}
            onFocus={this.onFocusTextInput}
            onChange={this.onChange}
            placeholder="Описание"
            text={description}
          />
        </div>
      </TemplateDialog>
    );
  }
}

export default DialogDescribeEntry;
