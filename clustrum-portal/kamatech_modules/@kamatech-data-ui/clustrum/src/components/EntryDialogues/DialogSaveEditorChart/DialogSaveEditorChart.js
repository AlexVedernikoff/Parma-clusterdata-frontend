import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DialogCreateEntry from '@kamatech-data-ui/common/src/components/EntryDialogues/DialogCreateEntry/DialogCreateEntry';
import noop from 'lodash/noop';

class DialogSaveEditorChart extends Component {
  static propTypes = {
    dialogProps: PropTypes.shape({
      path: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      data: PropTypes.object,
      title: PropTypes.string,
      defaultName: PropTypes.string,
      errorText: PropTypes.string,
      textButtonApply: PropTypes.string,
      textButtonCancel: PropTypes.string,
      withError: PropTypes.bool,
      onNotify: PropTypes.func,
    }),
    sdk: PropTypes.shape({
      createEditorChart: PropTypes.func.isRequired,
    }),
  };
  onApply = ({ key }) => {
    return this.props.sdk.createEditorChart({
      key,
      data: this.props.dialogProps.data || {},
      type: this.props.dialogProps.type,
    });
  };
  render() {
    const defaultDialogProps = {
      title: 'Сохранить чарт',
      defaultName: 'Новая диаграмма',
      errorText: 'Не удалось сохранить чарт',
      textButtonApply: 'Сохранить',
      textButtonCancel: 'Отменить',
      withError: true,
      onNotify: noop,
    };
    return <DialogCreateEntry {...this.props} onApply={this.onApply} defaultDialogProps={defaultDialogProps} />;
  }
}

export default DialogSaveEditorChart;
