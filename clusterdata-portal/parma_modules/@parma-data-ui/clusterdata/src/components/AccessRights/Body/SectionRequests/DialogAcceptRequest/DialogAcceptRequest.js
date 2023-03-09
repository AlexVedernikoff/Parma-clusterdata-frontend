import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import User from '../../../User/User';
import CommentDialogBase from '../../CommentDialogBase/CommentDialogBase';
import {i18n} from '../../../constants';
import Utils from '../../../../../utils';
import PermissionSelect from '../../../PermissionSelect/PermissionSelect';

// import './DialogAcceptRequest.scss';

const b = block('dl-ar-dialog-accept-request');

class DialogAcceptRequest extends React.Component {
    static getDerivedStateFromProps(props, state) {
        const {permission} = props;
        if (permission === state.initPermission) {
            return null;
        }
        return {
            permission,
            initPermission: permission
        };
    }

    state = {};

    apiHandler = async ({comment}) => {
        const {permission} = this.state;
        const {
            sdk,
            participant: {
                name: subject
            },
            entry: {entryId}
        } = this.props;
        const body = Utils.addPermission({permission, subject, comment});
        return await sdk.modifyPermissions({entryId, body});
    }

    renderContent = ({progress}, onRenderChange) => {
        const {participant} = this.props;

        return (
            <div className={b()}>
                <div className={b('user')}>
                    <div className={b('text')}>{i18n('label_for')}</div>
                    <User participant={participant}/>
                </div>
                <div className={b('permission-select')}>
                    <PermissionSelect
                        disabled={progress}
                        val={this.state.permission}
                        onChange={
                            newPermission => {
                                onRenderChange();
                                this.setState({permission: newPermission});
                            }
                        }
                        scope={this.props.entry.scope}
                    />
                </div>
            </div>
        );
    }

    render() {
        return (
            <CommentDialogBase
                {...this.props}
                preset="default"
                caption={
                    this.props.editable
                        ? i18n('section_accept-grant-title')
                        : i18n('section_change-grant-title')
                }
                textButtonApply={i18n('button_accept-request')}
                placeholder={i18n('label_placeholder-comment')}
                apiHandler={this.apiHandler}
                render={this.renderContent}
            />
        );
    }
}

DialogAcceptRequest.propTypes = {
    editable: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    visible: PropTypes.bool,
    participant: PropTypes.object,
    permission: PropTypes.string,
    sdk: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired
};

export default DialogAcceptRequest;
