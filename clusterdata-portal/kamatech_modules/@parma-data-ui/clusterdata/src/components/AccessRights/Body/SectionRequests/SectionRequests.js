import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import User from '../../User/User';
import { Button, Tooltip } from 'lego-on-react';
import { i18n, PERMISSION_ACTION } from '../../constants';
import { DL } from '../../../../constants/common';
import Utils from '../../../../utils';
import PermissionSelect from '../../PermissionSelect/PermissionSelect';
import DialogDenyRequest from './DialogDenyRequest/DialogDenyRequest';
import DialogAcceptRequest from './DialogAcceptRequest/DialogAcceptRequest';
import DialogDenyAllRequests from './DialogDenyAllRequests/DialogDenyAllRequests';
import DialogAcceptAllRequests from './DialogAcceptAllRequests/DialogAcceptAllRequests';
import DialogEditPermissions from '../DialogEditPermissions/DialogEditPermissions';

import Icon from '@parma-data-ui/common/src/components/Icon/Icon';
import iconTick from '@parma-data-ui/common/src/assets/icons/tick.svg';
import iconDecline from 'icons/decline.svg';
import iconComment from 'icons/comment.svg';

// import './SectionRequests.scss';

const b = block('dl-ar-section-requests');

class SectionRequests extends React.PureComponent {
  static getDerivedStateFromProps(props, state) {
    const { pendingParticipants } = props;
    if (pendingParticipants === state.pendingParticipants) {
      return null;
    }
    return {
      pendingParticipants,
      permissions: pendingParticipants.map(({ permission }) => permission),
      currentParticipantIndex: null,
      currentDialogVisible: null,
    };
  }

  state = {
    visibleTooltip: false,
    tooltipText: '',
    commentIconElement: null,
    currentParticipantIndex: null,
    currentDialogVisible: null,
  };

  onAction = ({ action, permission, index = null }) => {
    const { permissions } = this.state;
    switch (action) {
      case PERMISSION_ACTION.SELECT_CHANGE:
        this.setState({
          permissions: [...permissions.slice(0, index), permission, ...permissions.slice(index + 1)],
        });
        break;
      case PERMISSION_ACTION.DENY:
      case PERMISSION_ACTION.ACCEPT:
      case PERMISSION_ACTION.DENY_ALL:
      case PERMISSION_ACTION.ACCEPT_ALL:
      case PERMISSION_ACTION.EDIT:
        this.setState({
          currentParticipantIndex: index,
          currentDialogVisible: action,
        });
        break;
    }
  };

  onCloseDialog = () => this.setState({ currentDialogVisible: null, currentParticipantIndex: null });

  onSuccessDialog = () => {
    this.setState({ currentDialogVisible: null, currentParticipantIndex: null }, () => {
      this.props.refresh();
    });
  };

  renderDialogs() {
    const { currentParticipantIndex, currentDialogVisible } = this.state;
    const { editable } = this.props;
    return (
      <React.Fragment>
        {currentParticipantIndex !== null && editable && (
          <React.Fragment>
            <DialogDenyRequest
              sdk={this.props.sdk}
              entry={this.props.entry}
              onClose={this.onCloseDialog}
              onSuccess={this.onSuccessDialog}
              visible={currentDialogVisible === PERMISSION_ACTION.DENY}
              participant={this.props.pendingParticipants[currentParticipantIndex]}
            />
            <DialogAcceptRequest
              editable={editable}
              sdk={this.props.sdk}
              entry={this.props.entry}
              onClose={this.onCloseDialog}
              onSuccess={this.onSuccessDialog}
              visible={currentDialogVisible === PERMISSION_ACTION.ACCEPT}
              participant={this.props.pendingParticipants[currentParticipantIndex]}
              permission={this.state.permissions[currentParticipantIndex]}
            />
          </React.Fragment>
        )}
        {editable && (
          <React.Fragment>
            <DialogDenyAllRequests
              sdk={this.props.sdk}
              entry={this.props.entry}
              onClose={this.onCloseDialog}
              onSuccess={this.onSuccessDialog}
              visible={currentDialogVisible === PERMISSION_ACTION.DENY_ALL}
              participants={this.props.pendingParticipants}
            />
            <DialogAcceptAllRequests
              sdk={this.props.sdk}
              entry={this.props.entry}
              onClose={this.onCloseDialog}
              onSuccess={this.onSuccessDialog}
              visible={currentDialogVisible === PERMISSION_ACTION.ACCEPT_ALL}
              participants={this.props.pendingParticipants}
              permissions={this.state.permissions}
            />
          </React.Fragment>
        )}
        {currentParticipantIndex !== null && !editable && (
          <DialogEditPermissions
            sdk={this.props.sdk}
            entry={this.props.entry}
            onClose={this.onCloseDialog}
            onSuccess={this.onSuccessDialog}
            visible={currentDialogVisible === PERMISSION_ACTION.EDIT}
            editable={editable}
            participant={this.props.pendingParticipants[currentParticipantIndex]}
          />
        )}
      </React.Fragment>
    );
  }

  render() {
    const { pendingParticipants, editable } = this.props;
    const { permissions } = this.state;

    return (
      <React.Fragment>
        {pendingParticipants.map((participant, index) => {
          const {
            name,
            description: comment,
            requester: { name: requesterName },
          } = participant;
          const permission = permissions[index];
          const inactive = !editable && DL.USER_ID !== requesterName;

          const isRequestedForSelf = name === requesterName;

          return (
            <div
              key={index}
              className={b('row', { clickable: !editable })}
              onClick={() =>
                !editable &&
                this.onAction({
                  action: PERMISSION_ACTION.EDIT,
                  index,
                })
              }
            >
              <div className={b('user')}>
                <User participant={participant} role="requester" />
                <div className={b('requested-for')}>
                  <span className={b('requested-for-text')}>{i18n('label_requested-for')}</span>
                </div>
                {isRequestedForSelf ? (
                  <div className={b('requested-for-self')}>
                    <span>{i18n('label_self')}</span>
                  </div>
                ) : (
                  <User participant={participant} />
                )}
              </div>
              {!editable && <div className={b('permission')}>{Utils.getTextByPermission(permission)}</div>}
              {editable && (
                <div className={b('interactive-panel')}>
                  <div className={b('comment-icon', { hidden: !comment, inactive })}>
                    <Icon data={iconComment} />
                    <div
                      className={b('comment-icon-cover')}
                      onMouseEnter={event =>
                        this.setState({
                          visibleTooltip: true,
                          tooltipText: comment,
                          commentIconElement: event.target,
                        })
                      }
                      onMouseLeave={() => this.setState({ visibleTooltip: false })}
                    />
                  </div>
                  <PermissionSelect
                    disabled={inactive}
                    val={permission}
                    onChange={newPermission =>
                      this.onAction({
                        action: PERMISSION_ACTION.SELECT_CHANGE,
                        permission: newPermission,
                        index,
                      })
                    }
                    scope={this.props.entry.scope}
                  />
                  <Button
                    theme="action"
                    size="s"
                    view="default"
                    tone="default"
                    disabled={inactive}
                    cls={b('permission-accept-btn', b('btn-icon'))}
                    onClick={() =>
                      this.onAction({
                        action: PERMISSION_ACTION.ACCEPT,
                        index,
                      })
                    }
                  >
                    <Icon data={iconTick} width="18" height="18" />
                  </Button>
                  <Button
                    theme="light"
                    size="s"
                    view="default"
                    tone="default"
                    disabled={inactive}
                    cls={b('permission-cancel-btn', b('btn-icon'))}
                    onClick={() =>
                      this.onAction({
                        action: PERMISSION_ACTION.DENY,
                        index,
                      })
                    }
                  >
                    <Icon data={iconDecline} width="24" height="24" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {editable && (
          <div className={b('row')}>
            <Button
              theme="pseudo"
              size="s"
              view="default"
              tone="default"
              cls={b('permission-deny-all-btn')}
              onClick={() => this.onAction({ action: PERMISSION_ACTION.DENY_ALL })}
            >
              <div className={b('btn-icon-text-content')}>
                <Icon className={b('icon-deny-all')} data={iconDecline} width="24" height="24" />
                {i18n('button_deny-all')}
              </div>
            </Button>
            <Button
              theme="pseudo"
              size="s"
              view="default"
              tone="default"
              cls={b('permission-accept-all-btn')}
              onClick={() => this.onAction({ action: PERMISSION_ACTION.ACCEPT_ALL })}
            >
              <div className={b('btn-icon-text-content')}>
                <Icon className={b('icon-accept-all')} data={iconTick} width="18" height="18" />
                {i18n('button_accept-all')}
              </div>
            </Button>
          </div>
        )}
        <Tooltip
          view="classic"
          theme="normal"
          tone="default"
          visible={this.state.visibleTooltip}
          anchor={this.state.commentIconElement}
          to="top-center"
          size="s"
        >
          <div className={b('comment-tooltip-content')}>{this.state.tooltipText}</div>
        </Tooltip>
        {this.renderDialogs()}
      </React.Fragment>
    );
  }
}

SectionRequests.propTypes = {
  pendingParticipants: PropTypes.array,
  editable: PropTypes.bool,
  sdk: PropTypes.object.isRequired,
  entry: PropTypes.object,
  refresh: PropTypes.func,
};

export default SectionRequests;
