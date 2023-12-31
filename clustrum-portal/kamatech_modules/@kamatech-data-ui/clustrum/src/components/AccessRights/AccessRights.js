import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import Dialog from '@kamatech-data-ui/common/src/components/Dialog/Dialog';
import AccessRightsBodyContent from './Body/Body';
import { withHiddenUnmount } from '../../hoc/withHiddenUnmount';

// import './AccessRights.scss';

const b = block('dl-access-rights');

class AccessRights extends React.PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    visible: PropTypes.bool,
    sdk: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Dialog visible={this.props.visible} onClose={this.props.onClose}>
        <div className={b()}>
          <Dialog.Header caption="Права доступа" />
          <Dialog.Body className={b('body')}>
            <AccessRightsBodyContent {...this.props} />
          </Dialog.Body>
        </div>
      </Dialog>
    );
  }
}

export default withHiddenUnmount(AccessRights);
