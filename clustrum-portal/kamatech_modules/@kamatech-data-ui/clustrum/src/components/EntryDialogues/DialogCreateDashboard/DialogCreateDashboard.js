import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Hashids from 'hashids';
import TemplateDialog from '@kamatech-data-ui/common/src/components/Dialog/templates/TemplateDialog/TemplateDialog';
import PathSelect from '../../PathSelect/PathSelect';
// import './DialogCreateDashboard.scss';
import noop from 'lodash/noop';
import { NOTIFY_TYPES } from '../../../constants/common';
import Utils from '../../../utils';

const CURRENT_SCHEME_VERSION = 5;

const b = block('dl-dialog-create-dashboard');

class DialogCreateDashboard extends React.PureComponent {
  static propTypes = {
    sdk: PropTypes.object,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    dialogProps: PropTypes.shape({
      path: PropTypes.string.isRequired,
      title: PropTypes.string,
      errorText: PropTypes.string,
      withError: PropTypes.bool,
      onNotify: PropTypes.func,
    }).isRequired,
  };

  state = {
    name: '',
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

  get defaultDialogProps() {
    return {
      title: 'Создать аналитическую панель',
      errorText: 'Не удалось сохранить чарт',
      withError: true,
      onNotify: noop,
    };
  }

  get dialogProps() {
    return { ...this.defaultDialogProps, ...this.props.dialogProps };
  }

  onChange = name => {
    this.setState({ name, showError: false });
  };

  onClickButtonApply = () => {
    this.setState({ progress: true });
    const { name } = this.state;
    const path = Utils.normalizeDestination(this.state.path);
    const key = path === '/' ? name : path + name;
    this.props.sdk
      .createDash({ key, data: this.requestData() })
      .then(data => {
        this.setState({ progress: false });
        this.props.onClose({ status: 'success', data });
        return data;
      })
      .catch(error => {
        this.setState({ progress: false, showError: this.dialogProps.withError });
        this.dialogProps.onNotify({
          error,
          message: this.dialogProps.errorText,
          type: NOTIFY_TYPES.ERROR,
        });
      });
  };

  requestData() {
    const salt = Math.random().toString();
    const counter = 3;
    const hashids = new Hashids(salt);

    return {
      counter,
      salt,
      schemeVersion: CURRENT_SCHEME_VERSION,
      pages: [
        {
          id: hashids.encode(1),
          tabs: [
            {
              id: hashids.encode(2),
              title: 'Вкладка 1',
              items: [],
              layout: [],
              ignores: [],
              aliases: {},
            },
          ],
        },
      ],
    };
  }

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
    this.setState({ path }, () => {
      this._textInputRef.focus();
    });
  };

  onClickFolderSelect = () => {
    if (this.state.showError) {
      this.setState({ showError: false });
    }
  };

  render() {
    const { name, progress, showError, path } = this.state;
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
        textButtonApply="Создать"
        textButtonCancel="Отменить"
      >
        <div className={b('content')}>
          <PathSelect
            sdk={this.props.sdk}
            defaultPath={path}
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

export default DialogCreateDashboard;
