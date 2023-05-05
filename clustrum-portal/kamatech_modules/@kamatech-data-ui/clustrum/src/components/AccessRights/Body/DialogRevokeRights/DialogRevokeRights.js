import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import User from '../../User/User';
import CommentDialogBase from '../CommentDialogBase/CommentDialogBase';
import Utils from '../../../../utils';

// import './DialogRevokeRights.scss';

const b = block('dl-ar-dialog-revoke-rights');

class DialogRevokeRights extends React.Component {
  apiHandler = async ({ comment }) => {
    const {
      sdk,
      participant: { name: subject, permission },
      entry: { entryId },
    } = this.props;
    const body = Utils.removePermission({ permission, subject, comment });
    return await sdk.modifyPermissions({ entryId, body });
  };

  renderContent = () => {
    const { participant } = this.props;

    return (
      <div className={b()}>
        <div className={b('text')}>Права будут отозваны у</div>
        <User participant={participant} />
      </div>
    );
  };

  render() {
    return (
      <CommentDialogBase
        {...this.props}
        preset="danger"
        caption="Отозвать права"
        textButtonApply="Отозвать права"
        placeholder="Причина отзыва прав (не обязательно)"
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
  entry: PropTypes.object.isRequired,
};

export default DialogRevokeRights;
