import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import CommentDialogBase from '../../CommentDialogBase/CommentDialogBase';
import {i18n} from '../../../constants';
import Utils from '../../../../../utils';

// import './DialogAcceptAllRequests.scss';

const b = block('dl-ar-dialog-accept-all-requests');

class DialogAcceptAllRequests extends React.Component {

    apiHandler = async ({comment}) => {
        const {
            sdk,
            participants,
            permissions,
            entry: {entryId}
        } = this.props;
        const resultBody = participants.reduce((body, {name: subject}, index) => {
            const permission = permissions[index];
            return Utils.addPermission({body, permission, subject, comment});
        }, undefined);
        return await sdk.modifyPermissions({entryId, body: resultBody});
    }

    renderContent = () => {
        return (
            <div className={b()}>
                {i18n('label_accept-all-requests')}
            </div>
        );
    }

    render() {
        return (
            <CommentDialogBase
                {...this.props}
                preset="default"
                caption={i18n('section_accept-all-title')}
                textButtonApply={i18n('button_accept-all-requests')}
                placeholder={i18n('label_placeholder-comment')}
                apiHandler={this.apiHandler}
                render={this.renderContent}
            />
        );
    }
}

DialogAcceptAllRequests.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    visible: PropTypes.bool,
    participants: PropTypes.array,
    permissions: PropTypes.array,
    sdk: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired
};

export default DialogAcceptAllRequests;
