import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { i18n } from '../../../constants';
import User from '../../../User/User';
import PermissionSelect from '../../../PermissionSelect/PermissionSelect';
import { TextArea } from '@parma-data-ui/common/src';
import { Button } from 'lego-on-react';
import Utils from '../../../../../utils';
import DialogRevokeRights from '../../DialogRevokeRights/DialogRevokeRights';

// import './EditPermissionsPanel.scss';

const b = block('dl-ar-edit-permissions-panel');

class EditPermissionsPanel extends React.Component {
  state = {
    permission: this.props.participant.permission,
    progress: false,
    text: '',
    error: undefined,
    visibleDialogRevokeRights: false,
  };

  componentWillUnmount() {
    this._isUnmounted = true;
  }

  onChangeSelect = permission => this.setState({ permission, error: undefined });

  onChangeTextArea = text => this.setState({ text });

  onClickBtnDeny = () => this.setState({ visibleDialogRevokeRights: true });

  onCloseDialogRevokeRights = () => this.setState({ visibleDialogRevokeRights: false });

  onClickBtnCancel = () => this.setState({ permission: this.props.participant.permission });

  onClickBtnSave = async () => {
    try {
      this.setState({ progress: true, error: undefined });
      const body = Utils.modifyPermission({
        newPermission: this.state.permission,
        permission: this.props.participant.permission,
        subject: this.props.participant.name,
        comment: this.state.text,
      });
      await this.props.sdk.modifyPermissions({ entryId: this.props.entry.entryId, body });
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
      this.setState({ progress: false, error: i18n('label_error-general') });
    }
  };

  render() {
    const { participant, editable } = this.props;
    const { progress, permission } = this.state;

    return (
      <React.Fragment>
        <div className={b()}>
          <div className={b('action-panel')}>
            <div className={b('user')}>
              <User showIcon participant={participant} />
            </div>
            {editable ? (
              <PermissionSelect
                className={b('permission-select')}
                disabled={progress}
                val={permission}
                onChange={this.onChangeSelect}
                scope={this.props.entry.scope}
              />
            ) : (
              <div className={b('permission')}>{Utils.getTextByPermission(permission)}</div>
            )}
            <Button
              theme="pseudo"
              size="s"
              view="default"
              tone="default"
              cls={b('btn-deny')}
              disabled={progress}
              onClick={this.onClickBtnDeny}
            >
              {i18n('section_revoke-rights-title')}
            </Button>
          </div>
          {permission !== participant.permission && (
            <div className={b('textarea-place')}>
              <TextArea
                rows={3}
                theme="normal"
                size="s"
                text={this.state.text}
                onChange={this.onChangeTextArea}
                placeholder={i18n('label_placeholder-reason-change-grant')}
                error={this.state.error}
                hasClear
                focused
              />
              <div className={b('textarea-btns')}>
                <Button
                  theme="normal"
                  size="s"
                  view="default"
                  tone="default"
                  disabled={progress}
                  onClick={this.onClickBtnCancel}
                >
                  {i18n('button_cancel')}
                </Button>
                <Button
                  theme="action"
                  size="s"
                  view="default"
                  tone="default"
                  cls={b('btn-save')}
                  progress={progress}
                  onClick={this.onClickBtnSave}
                >
                  {i18n('button_save')}
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogRevokeRights
          sdk={this.props.sdk}
          entry={this.props.entry}
          onClose={this.onCloseDialogRevokeRights}
          onSuccess={this.props.onSuccess}
          visible={this.state.visibleDialogRevokeRights}
          participant={this.props.participant}
        />
      </React.Fragment>
    );
  }
}

EditPermissionsPanel.propTypes = {
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  sdk: PropTypes.object.isRequired,
  entry: PropTypes.object.isRequired,
  participant: PropTypes.object,
  editable: PropTypes.bool,
};

export default EditPermissionsPanel;
