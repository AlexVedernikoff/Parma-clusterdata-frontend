import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Dialog from '@parma-data-ui/common/src/components/Dialog/Dialog';
import { i18n, PERMISSION_ACTION } from '../constants';
import { withHiddenUnmount } from '../../../hoc/withHiddenUnmount';
import SectionPreviousRequests from './SectionPreviousRequests/SectionPreviousRequests';
import SectionPrepareRequests from './SectionPrepareRequests/SectionPrepareRequests';
import Utils from '../../../utils';
import AddingParticipant from '../AddingParticipant/AddingParticipant';
import { TextArea, Button } from 'lego-on-react';
import { PERMISSION } from '../../../constants/common';

import Icon from '@parma-data-ui/common/src/components/Icon/Icon';
import iconPlus from '@parma-data-ui/common/src/assets/icons/plus.svg';

// import './DialogAddParticipants.scss';

const b = block('dl-ar-dialog-add-participants');

class DialogAddParticipants extends React.Component {
  state = {
    progress: false,
    showError: false,
    success: false,
    participants: [],
    comment: '',
    visibleTextArea: false,
  };

  componentWillUnmount() {
    this._isUnmounted = true;
  }

  onClose = () => {
    if (this.state.progress) {
      return;
    }
    if (this.state.success) {
      this.props.onSuccess();
    }
    this.props.onClose();
  };

  onClickApply = async () => {
    try {
      const { entry, sdk } = this.props;
      const { participants, comment } = this.state;
      this.setState({ progress: true, showError: false });
      const resultBody = participants.reduce((body, { name: subject, permission }) => {
        return Utils.addPermission({ body, permission, subject, comment });
      }, undefined);
      await sdk.modifyPermissions({ entryId: entry.entryId, body: resultBody });
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

  onChangePreviousRequests = () => this.setState({ success: true });

  onChangeTextArea = comment => this.setState({ comment });

  onClickBtnAddComment = () => this.setState({ visibleTextArea: true });

  onAction = ({ action, permission, index }) => {
    const { participants } = this.state;
    switch (action) {
      case PERMISSION_ACTION.SELECT_CHANGE:
        this.setState({
          participants: [
            ...participants.slice(0, index),
            { ...participants[index], permission },
            ...participants.slice(index + 1),
          ],
        });
        break;
      case PERMISSION_ACTION.DELETE:
        this.setState({
          participants: [...participants.slice(0, index), ...participants.slice(index + 1)],
        });
        break;
    }
  };

  onAddParticipant = ({ participant: newParticipant }) => {
    const { participants } = this.state;
    if (!participants.find(v => v.name === newParticipant.name)) {
      newParticipant.permission = PERMISSION.READ;
      this.setState({ participants: [newParticipant, ...participants] });
    }
  };

  render() {
    const { mode } = this.props;
    return (
      <Dialog visible={this.props.visible} onClose={this.onClose}>
        <div className={b()}>
          <Dialog.Header
            caption={
              mode === 'add' ? i18n('section_add-participant-title') : i18n('section_request-access-rights-title')
            }
          />
          <Dialog.Body className={b('body')}>
            <div className={b('adding-panel')}>
              <div className={b('adding-panel-top-group')}>
                <div className={b('adding-participant')}>
                  <AddingParticipant editable onAction={this.onAddParticipant} sdk={this.props.sdk} />
                </div>
                <Button
                  theme="light"
                  size="s"
                  view="default"
                  tone="default"
                  cls={b('btn-add-comment')}
                  onClick={this.onClickBtnAddComment}
                >
                  <div className={b('btn-add-comment-content')}>
                    <Icon className={b('btn-add-comment-icon')} data={iconPlus} width="16" height="16" />
                    {i18n('button_add-comment')}
                  </div>
                </Button>
              </div>
              {this.state.visibleTextArea && (
                <TextArea
                  rows={3}
                  theme="normal"
                  size="s"
                  text={this.state.comment}
                  onChange={this.onChangeTextArea}
                  placeholder={i18n('label_placeholder-comment')}
                  cls={b('comment')}
                  hasClear
                  focused
                />
              )}
            </div>
            <div className={b('participants-sections')}>
              <SectionPrepareRequests
                inactive={this.state.progress}
                participants={this.state.participants}
                onAction={this.onAction}
                entry={this.props.entry}
              />
              {this.props.withParticipantsRequests && (
                <SectionPreviousRequests
                  sdk={this.props.sdk}
                  entry={this.props.entry}
                  onChange={this.onChangePreviousRequests}
                  inactive={this.state.progress}
                />
              )}
            </div>
          </Dialog.Body>
          <Dialog.Footer
            onClickButtonCancel={this.onClose}
            onClickButtonApply={this.onClickApply}
            textButtonApply={mode === 'add' ? i18n('button_add') : i18n('button_to-request')}
            textButtonCancel={i18n('button_cancel')}
            propsButtonCancel={{ disabled: this.state.progress }}
            propsButtonApply={{ disabled: this.state.participants.length === 0 }}
            progress={this.state.progress}
            errorText={i18n('label_error-general')}
            showError={this.state.showError}
          />
        </div>
      </Dialog>
    );
  }
}

DialogAddParticipants.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  visible: PropTypes.bool,
  sdk: PropTypes.object.isRequired,
  entry: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['add', 'request']),

  withParticipantsRequests: PropTypes.bool,
};

DialogAddParticipants.defaultProps = {
  mode: 'add',
  withParticipantsRequests: false,
};

export default withHiddenUnmount(DialogAddParticipants);
