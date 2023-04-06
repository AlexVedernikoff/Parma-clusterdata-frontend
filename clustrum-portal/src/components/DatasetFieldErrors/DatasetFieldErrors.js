import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { i18n } from '@kamatech-data-ui/clustrum';

// import './DatasetFieldErrors.scss';

const b = block('dataset-field-errors');

class DatasetFieldErrors extends React.Component {
  static propTypes = {
    fieldErrors: PropTypes.array.isRequired,
  };

  render() {
    const { fieldErrors } = this.props;

    return (
      <div className={b()}>
        {fieldErrors.map((fieldError, index) => {
          const { errors = [], title } = fieldError;

          return (
            <div key={`error-${index}`} className={b('errors')}>
              <span className={b('title')}>
                {i18n('dataset.dataset-editor.modify', 'label_field')}&nbsp;
                {title}
              </span>
              <div className={b('messages')}>
                {errors.map((error, index) => {
                  const { message } = error;

                  return (
                    <div key={`error-msg-${index}`} className={b('message')}>
                      {message}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default DatasetFieldErrors;
