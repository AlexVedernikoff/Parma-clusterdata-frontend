import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Dialog from '@kamatech-data-ui/common/src/components/Dialog/Dialog';
import EditPermissionsPanel from './EditPermissionsPanel/EditPermissionsPanel';
import GrantDetails from './GrantDetails/GrantDetails';

// import './DialogEditPermissions.scss';

const b = block('dl-ar-dialog-edit-permissions');

class DialogEditPermissions extends React.Component {
  render() {
    if (!this.props.visible) {
      return null;
    }
    const { editable } = this.props;

    return (
      <Dialog visible={this.props.visible} onClose={this.props.onClose}>
        <div className={b()}>
          <Dialog.Header caption={editable ? 'Выданные права' : 'Запрашиваемые права'} />
          <Dialog.Body className={b('body')}>
            <EditPermissionsPanel
              sdk={this.props.sdk}
              entry={this.props.entry}
              participant={this.props.participant}
              onClose={this.props.onClose}
              onSuccess={this.props.onSuccess}
              editable={this.props.editable}
            />
            <GrantDetails
              sdk={this.props.sdk}
              entry={this.props.entry}
              participant={this.props.participant}
            />
          </Dialog.Body>
        </div>
      </Dialog>
    );
  }
}

DialogEditPermissions.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  visible: PropTypes.bool,
  sdk: PropTypes.object.isRequired,
  entry: PropTypes.object.isRequired,
  editable: PropTypes.bool,
  participant: PropTypes.object,
};

export default DialogEditPermissions;
