import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ErrorContent, i18n } from '@kamatech-data-ui/clustrum';
import { load as loadDash } from '../../store/actions/dash';
import { SDK } from '../../modules/sdk';

// TODO: типы ошибок
function Error(props) {
  return (
    <ErrorContent
      sdk={SDK}
      title={i18n('dash.error.view', 'label_error')}
      action={{
        text: i18n('dash.error.view', 'button_retry'),
        handler: props.loadDash,
      }}
    />
  );
}

Error.propTypes = {
  loadDash: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  loadDash,
};

export default connect(null, mapDispatchToProps)(Error);
