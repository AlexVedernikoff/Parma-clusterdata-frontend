import React from 'react';
import PropTypes from 'prop-types';
import AccessRights from 'components/AccessRights/AccessRights';

export default class DialogAccess extends React.Component {
  static propTypes = {
    sdk: PropTypes.object,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    dialogProps: PropTypes.shape({
      entry: PropTypes.object.isRequired,
    }).isRequired,
  };

  onClose = () => {
    this.props.onClose({ status: 'close' });
  };

  render() {
    const {
      dialogProps: { entry },
      ...props
    } = this.props;
    return <AccessRights {...props} onClose={this.onClose} entry={entry} />;
  }
}
