import React, { Component } from 'react';
import TemplateDialog from '../../Dialog/templates/TemplateDialog/TemplateDialog';
import PropTypes from 'prop-types';
import EntryTitle from '../../Navigation/EntryTitle/EntryTitle';
import noop from 'lodash/noop';
import { ERROR_TYPE } from '../constants';

import block from 'bem-cn-lite';
// import './DialogDeleteEntry.scss';

const b = block('yc-dialog-delete-entry');

const TEXT = {
  TITLE: 'Вы уверены?',
  ERROR: 'Не удалось удалить',
  DELETE: 'Удалить',
};

class DialogDeleteEntry extends Component {
  static propTypes = {
    sdk: PropTypes.object,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    dialogProps: PropTypes.shape({
      entry: PropTypes.object.isRequired,
      title: PropTypes.string,
      errorText: PropTypes.string,
      withError: PropTypes.bool,
      onNotify: PropTypes.func,
    }).isRequired,
  };

  static defaultProps = {
    dialogProps: {
      title: TEXT.TITLE,
      errorText: TEXT.ERROR,
      withError: true,
      onNotify: noop,
    },
  };

  state = {
    progress: false,
    showError: false,
  };

  get dialogProps() {
    return { ...DialogDeleteEntry.defaultProps.dialogProps, ...this.props.dialogProps };
  }

  onClickButtonApply = () => {
    const { entry } = this.dialogProps;
    this.setState({ progress: true });
    this.props.sdk
      .deleteEntry({ entryId: entry.entryId })
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

  render() {
    const { progress, showError } = this.state;
    const { visible } = this.props;
    const { title, errorText, entry } = this.dialogProps;

    return (
      <TemplateDialog
        caption={title}
        visible={visible}
        progress={progress}
        onClickButtonApply={this.onClickButtonApply}
        onClose={this.onClose}
        showError={showError}
        errorText={errorText}
        preset="danger"
        textButtonApply={TEXT.DELETE}
        listenKeyEnter={visible}
      >
        <div className={b('content')}>
          {Boolean(entry) && (
            <span className={b('entry')}>
              <span className={b('entry-text')}>{TEXT.DELETE}</span>
              <EntryTitle entry={entry} theme="inline" />
            </span>
          )}
        </div>
      </TemplateDialog>
    );
  }
}

export default DialogDeleteEntry;
