import React, { Component } from 'react';
import TemplateDialog from '@parma-data-ui/common/src/components/Dialog/templates/TemplateDialog/TemplateDialog';
import PropTypes from 'prop-types';
import PathSelect from 'components/PathSelect/PathSelect';
import block from 'bem-cn-lite';
// import './DialogSaveWidget.scss';
import noop from 'lodash/noop';
import { NOTIFY_TYPES } from '../../../constants/common';

const b = block('dl-dialog-save-widget');
import Utils from '../../../utils';
import { I18n } from 'utils/i18n';
import Charts from '../../../../../chartkit/lib/modules/charts/charts';
const i18n = I18n.keyset('component.dialog-save-widget.view');

class DialogSaveWidget extends Component {
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
    widgetName: this.dialogProps.widgetName || '',
    widgetData: this.dialogProps.widgetData,
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
      title: i18n('section_title'),
      errorText: i18n('label_error'),
      withError: true,
      onNotify: noop,
    };
  }

  get dialogProps() {
    return { ...this.defaultDialogProp, ...this.props.dialogProps };
  }

  onChange = value => {
    this.setState({ widgetName: value, showError: false });
  };

  onClickButtonApply = () => {
    this.setState({ progress: true });

    let { widgetName } = this.state;
    const { widgetData } = this.state;
    const path = Utils.normalizeDestination(this.state.path);

    widgetName = widgetName === '' ? i18n('label_widget-name-default') : widgetName;

    const key = path === '/' ? widgetName : path + widgetName;

    this.props.sdk
      .createWidget({
        key,
        data: Charts.lightWeightWidgetDataConfig(widgetData),
      })
      .then(response => {
        this.setState({ progress: false });
        this.props.onClose({ status: 'success', data: response });
        return response;
      })
      .catch(error => {
        this.setState({ progress: false, showError: this.dialogProps.withError });
        this.dialogProps.onNotify({ error, message: this.dialogProps.errorText, type: NOTIFY_TYPES.ERROR });
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
    const { widgetName, progress, showError, path } = this.state;
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
        textButtonApply={i18n('button_save')}
        textButtonCancel={i18n('button_cancel')}
      >
        <div className={b('content')}>
          <PathSelect
            sdk={this.props.sdk}
            defaultPath={path}
            withInput={true}
            onChoosePath={this.onChooseFolder}
            onClick={this.onClickFolderSelect}
            inputRef={this.setTextInputRef}
            inputValue={widgetName}
            onChangeInput={this.onChange}
            placeholder={i18n('label_widget-name-default')}
          />
        </div>
      </TemplateDialog>
    );
  }
}

export default DialogSaveWidget;
