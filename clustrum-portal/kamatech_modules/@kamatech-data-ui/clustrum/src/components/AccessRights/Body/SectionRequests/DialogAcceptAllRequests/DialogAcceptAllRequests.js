import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import CommentDialogBase from '../../CommentDialogBase/CommentDialogBase';
import Utils from '../../../../../utils';

// import './DialogAcceptAllRequests.scss';

const b = block('dl-ar-dialog-accept-all-requests');

class DialogAcceptAllRequests extends React.Component {
  apiHandler = async ({ comment }) => {
    const {
      sdk,
      participants,
      permissions,
      entry: { entryId },
    } = this.props;
    const resultBody = participants.reduce((body, { name: subject }, index) => {
      const permission = permissions[index];
      return Utils.addPermission({ body, permission, subject, comment });
    }, undefined);
    return await sdk.modifyPermissions({ entryId, body: resultBody });
  };

  renderContent = () => {
    return <div className={b()}>Будут выданы права на все запросы</div>;
  };

  render() {
    return (
      <CommentDialogBase
        {...this.props}
        preset="default"
        caption="Разрешить всем"
        textButtonApply="Подтвердить все запросы"
        placeholder="Комментарий (не обязательно)"
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
  entry: PropTypes.object.isRequired,
};

export default DialogAcceptAllRequests;
