import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DialogCreateEntry from '../DialogCreateEntry/DialogCreateEntry';
import noop from 'lodash/noop';

const TEXT = {
  TITLE: 'Сохранить виджет',
  WIDGET_NAME: 'Новый виджет',
  ERROR: 'Не удалось сохранить виджет',
};

const defaultDialogProps = {
  title: TEXT.TITLE,
  defaultName: TEXT.WIDGET_NAME,
  errorText: TEXT.ERROR,
  withError: true,
  onNotify: noop,
};

class DialogSaveWidget extends Component {
  static propTypes = {
    dialogProps: PropTypes.object,
    sdk: PropTypes.shape({
      saveEntry: PropTypes.func,
    }),
  };
  get saveEntry() {
    return this.props.dialogProps.saveEntry || this.props.sdk.saveEntry;
  }
  onApply = ({ key }) => {
    return this.saveEntry({ key });
  };
  render() {
    return <DialogCreateEntry {...this.props} onApply={this.onApply} defaultDialogProps={defaultDialogProps} />;
  }
}

export default DialogSaveWidget;
