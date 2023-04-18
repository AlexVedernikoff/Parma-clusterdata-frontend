import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DialogCreateEntry from '../DialogCreateEntry/DialogCreateEntry';
import noop from 'lodash/noop';

const TEXT = {
  TITLE: 'Создать папку',
  FOLDER_NAME: 'Новая папка',
  ERROR: 'Не удалось создать папку',
};

const defaultDialogProps = {
  title: TEXT.TITLE,
  defaultName: TEXT.FOLDER_NAME,
  errorText: TEXT.ERROR,
  withError: true,
  onNotify: noop,
};

class DialogCreateFolder extends Component {
  static propTypes = {
    sdk: PropTypes.shape({
      createFolder: PropTypes.func.isRequired,
    }),
  };
  onApply = ({ key }) => {
    return this.props.sdk.createFolder({ key });
  };
  render() {
    return <DialogCreateEntry {...this.props} onApply={this.onApply} defaultDialogProps={defaultDialogProps} />;
  }
}

export default DialogCreateFolder;
