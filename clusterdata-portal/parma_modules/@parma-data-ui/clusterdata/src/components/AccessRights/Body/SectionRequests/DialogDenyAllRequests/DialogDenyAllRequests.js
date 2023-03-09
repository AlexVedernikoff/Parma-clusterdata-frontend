import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import CommentDialogBase from '../../CommentDialogBase/CommentDialogBase';
import {i18n} from '../../../constants';
import Utils from '../../../../../utils';

// import './DialogDenyAllRequests.scss';

const b = block('dl-ar-dialog-deny-all-requests');

class DialogDenyAllRequests extends React.Component {

    apiHandler = async ({comment}) => {
        const {
            sdk,
            participants,
            entry: {entryId}
        } = this.props;
        const resultBody = participants.reduce((body, {name: subject, permission}) => {
            return Utils.removePermission({body, permission, subject, comment});
        }, undefined);
        return await sdk.modifyPermissions({entryId, body: resultBody});
    }

    renderContent = () => {
        return (
            <div className={b()}>
                {i18n('label_deny-all-requests')}
            </div>
        );
    }

    render() {
        return (
            <CommentDialogBase
                {...this.props}
                preset="danger"
                caption={i18n('section_deny-request-title')}
                textButtonApply={i18n('button_deny-all-requests')}
                placeholder={i18n('label_placeholder-deny-request')}
                apiHandler={this.apiHandler}
                render={this.renderContent}
            />
        );
    }
}

DialogDenyAllRequests.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    visible: PropTypes.bool,
    participants: PropTypes.array,
    sdk: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired
};

export default DialogDenyAllRequests;
