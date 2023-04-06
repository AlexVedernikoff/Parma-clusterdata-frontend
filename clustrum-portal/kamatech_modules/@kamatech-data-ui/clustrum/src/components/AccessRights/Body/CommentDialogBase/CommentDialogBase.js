import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Dialog from '@kamatech-data-ui/common/src/components/Dialog/Dialog';
import { TextArea } from 'lego-on-react';
import noop from 'lodash/noop';
import { i18n } from '../../constants';
import { withHiddenUnmount } from '../../../../hoc/withHiddenUnmount';

// import './CommentDialogBase.scss';

const b = block('dl-ar-comment-dialog-base');

class CommentDialogBase extends React.Component {
  state = {
    showError: false,
    progress: false,
    text: '',
  };

  componentWillUnmount() {
    this._isUnmounted = true;
  }

  onClose = () => {
    if (this.state.progress) {
      return;
    }
    this.props.onClose();
  };

  onClickButtonApply = async () => {
    try {
      this.setState({ progress: true, showError: false });
      await this.props.apiHandler({ comment: this.state.text });
      if (this._isUnmounted) {
        return;
      }
      this.setState({ progress: false }, () => {
        this.props.onSuccess();
      });
    } catch (error) {
      if (this._isUnmounted) {
        return;
      }
      this.setState({ progress: false, showError: true });
    }
  };

  onChangeTextArea = text => this.setState({ text });

  onRenderChange = () => {
    this.setState({ showError: false });
  };

  render() {
    return (
      <Dialog visible={this.props.visible} onClose={this.onClose}>
        <div className={b()}>
          <Dialog.Header caption={this.props.caption} />
          <Dialog.Body className={b('body')}>
            {this.props.render(this.state, this.onRenderChange)}
            <TextArea
              theme="normal"
              size="s"
              text={this.state.text}
              onChange={this.onChangeTextArea}
              placeholder={this.props.placeholder}
              hasClear
              focused
            />
          </Dialog.Body>
          <Dialog.Footer
            preset={this.props.preset}
            onClickButtonCancel={this.onClose}
            onClickButtonApply={this.onClickButtonApply}
            textButtonApply={this.props.textButtonApply}
            textButtonCancel={i18n('button_repeal')}
            propsButtonCancel={{ disabled: this.state.progress }}
            progress={this.state.progress}
            errorText={this.props.errorText || i18n('label_error-general')}
            showError={this.state.showError}
          />
        </div>
      </Dialog>
    );
  }
}

CommentDialogBase.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  visible: PropTypes.bool,
  apiHandler: PropTypes.func,
  render: PropTypes.func,
  textButtonApply: PropTypes.string,
  caption: PropTypes.string,
  preset: PropTypes.string,
  errorText: PropTypes.string,
  placeholder: PropTypes.string,
};

CommentDialogBase.defaultProps = {
  render: noop,
};

export default withHiddenUnmount(CommentDialogBase);
