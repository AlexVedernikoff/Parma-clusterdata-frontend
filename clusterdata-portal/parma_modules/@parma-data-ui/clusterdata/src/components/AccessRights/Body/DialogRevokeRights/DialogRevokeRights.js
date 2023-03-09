import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import User from '../../User/User';
import CommentDialogBase from '../CommentDialogBase/CommentDialogBase';
import {i18n} from '../../constants';
import Utils from '../../../../utils';

// import './DialogRevokeRights.scss';

const b = block('dl-ar-dialog-revoke-rights');

class DialogRevokeRights extends React.Component {

    apiHandler = async ({comment}) => {
        const {
            sdk,
            participant: {
                name: subject,
                permission
            },
            entry: {entryId}
        } = this.props;
        const body = Utils.removePermission({permission, subject, comment});
        return await sdk.modifyPermissions({entryId, body});
    }

    renderContent = () => {
        const {participant} = this.props;

        return (
            <div className={b()}>
                <div className={b('text')}>{i18n('label_revoke-rights')}</div>
                <User participant={participant}/>
            </div>
        );
    }

    render() {
        return (
            <CommentDialogBase
                {...this.props}
                preset="danger"
                caption={i18n('section_revoke-rights-title')}
                textButtonApply={i18n('button_revoke-rights')}
                placeholder={i18n('label_placeholder-deny-request')}
                apiHandler={this.apiHandler}
                render={this.renderContent}
            />
        );
    }
}

DialogRevokeRights.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    visible: PropTypes.bool,
    participant: PropTypes.object,
    sdk: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired
};

export default DialogRevokeRights;
