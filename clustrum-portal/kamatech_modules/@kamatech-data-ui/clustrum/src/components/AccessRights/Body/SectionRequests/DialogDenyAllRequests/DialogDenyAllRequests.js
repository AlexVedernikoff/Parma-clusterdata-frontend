import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import CommentDialogBase from '../../CommentDialogBase/CommentDialogBase';
import Utils from '../../../../../utils';

// import './DialogDenyAllRequests.scss';

const b = block('dl-ar-dialog-deny-all-requests');

class DialogDenyAllRequests extends React.Component {
  apiHandler = async ({ comment }) => {
    const {
      sdk,
      participants,
      entry: { entryId },
    } = this.props;
    const resultBody = participants.reduce((body, { name: subject, permission }) => {
      return Utils.removePermission({ body, permission, subject, comment });
    }, undefined);
    return await sdk.modifyPermissions({ entryId, body: resultBody });
  };

  renderContent = () => {
    return (
      <div className={b()}>Будут отклонены все запросы на получение прав доступа</div>
    );
  };

  render() {
    return (
      <CommentDialogBase
        {...this.props}
        preset="danger"
        caption="Отклонить запрос"
        textButtonApply="Отклонить все запросы"
        placeholder="Причина отзыва прав (не обязательно)"
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
  entry: PropTypes.object.isRequired,
};

export default DialogDenyAllRequests;
