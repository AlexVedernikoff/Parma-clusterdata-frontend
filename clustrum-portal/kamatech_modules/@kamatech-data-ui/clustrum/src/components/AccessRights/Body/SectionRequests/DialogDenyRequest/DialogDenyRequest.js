import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import User from '../../../User/User';
import CommentDialogBase from '../../CommentDialogBase/CommentDialogBase';
import Utils from '../../../../../utils';

// import './DialogDenyRequest.scss';

const b = block('dl-ar-dialog-deny-request');

class DialogDenyRequest extends React.Component {
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
        <div className={b('text')}>Для</div>
        <User participant={participant} />
      </div>
    );
  };

  render() {
    return (
      <CommentDialogBase
        {...this.props}
        preset="danger"
        caption="Отклонить запрос"
        textButtonApply="Отклонить запрос"
        placeholder="Причина отзыва прав (не обязательно)"
        apiHandler={this.apiHandler}
        render={this.renderContent}
      />
    );
  }
}

DialogDenyRequest.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  visible: PropTypes.bool,
  participant: PropTypes.object,
  sdk: PropTypes.object.isRequired,
  entry: PropTypes.object.isRequired,
};

export default DialogDenyRequest;
