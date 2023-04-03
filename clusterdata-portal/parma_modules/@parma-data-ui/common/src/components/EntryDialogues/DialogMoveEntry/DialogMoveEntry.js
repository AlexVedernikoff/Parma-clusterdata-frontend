import React, { Component } from 'react';
import TemplateDialog from '../../Dialog/templates/TemplateDialog/TemplateDialog';
import PropTypes from 'prop-types';
import PathSelect from '../../PathSelect/PathSelect';
import noop from 'lodash/noop';
import { ERROR_TYPE } from '../constants';

import block from 'bem-cn-lite';
// import './DialogMoveEntry.scss';

const b = block('yc-dialog-move-entry');

const TEXT = {
  TITLE: 'Куда переместить?',
  ERROR: 'Не удалось переместить.',
};

class DialogMoveEntry extends Component {
  static propTypes = {
    sdk: PropTypes.object,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    dialogProps: PropTypes.shape({
      entryId: PropTypes.string.isRequired,
      inactiveEntryKey: PropTypes.string,
      initDestination: PropTypes.string,
      title: PropTypes.string,
      errorText: PropTypes.string,
      withError: PropTypes.bool,
      onNotify: PropTypes.func,
    }).isRequired,
  };

  static defaultProps = {
    dialogProps: {
      initDestination: '/',
      title: TEXT.TITLE,
      errorText: TEXT.ERROR,
      withError: true,
      onNotify: noop,
    },
  };

  state = {
    destination: this.dialogProps.initDestination,
    progress: false,
    showError: false,
  };

  get dialogProps() {
    return { ...DialogMoveEntry.defaultProps.dialogProps, ...this.props.dialogProps };
  }

  onClickButtonApply = () => {
    const { entryId } = this.dialogProps;
    const { destination } = this.state;
    this.setState({ progress: true });
    this.props.sdk
      .moveEntry({ entryId, destination })
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

  onChooseFolder = destination => {
    this.setState({ destination });
  };

  onClickFolderSelect = () => {
    if (this.state.showError) {
      this.setState({ showError: false });
    }
  };

  render() {
    const { destination, progress, showError } = this.state;
    const { visible } = this.props;
    const { title, errorText, inactiveEntryKey } = this.dialogProps;

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
            withInput={false}
            onChoosePath={this.onChooseFolder}
            onClick={this.onClickFolderSelect}
            inactiveEntryKey={inactiveEntryKey}
          />
        </div>
      </TemplateDialog>
    );
  }
}

export default DialogMoveEntry;
