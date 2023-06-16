import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Button } from 'lego-on-react';
import Dialog from '@kamatech-data-ui/common/src/components/Dialog/Dialog';
import CopyToClipboard from '@kamatech-data-ui/react-components/src/components/CopyToClipboard';
import isEqual from 'lodash/isEqual';

// import './ErrorDialog.scss';

const b = block('error-dialog');

class ErrorDialog extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    requestId: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  };

  static getDerivedStateFromProps(props, state) {
    if (isEqual(props, state.prevProps)) {
      return null;
    }
    return {
      prevProps: props,
      ...props,
    };
  }

  state = {
    isVisible: false,
  };

  open = (overrideProps = {}) => this.setState({ isVisible: true, ...overrideProps });

  onClose = () => this.setState({ isVisible: false, ...this.props });

  getMessage() {
    const { message } = this.state;

    if (typeof message === 'string') {
      return message;
    }

    return `${JSON.stringify(message, null, 4)}`;
  }

  renderRequestIdRow() {
    const { requestId } = this.state;

    if (!requestId) {
      return null;
    }

    return (
      <div className={b('request-id')}>
        <span className={b('request-id-caption')}>Request-ID:</span>
        <span className={b('request-id-value')}>{requestId}</span>
        <div className={b('request-id-copy-btn')}>
          <CopyToClipboard text={requestId} resetTimeout={5000} onCopy={this.onCopy}>
            {() => (
              <Button
                theme="light"
                tone="default"
                view="default"
                size="s"
                text="Скопировать"
              />
            )}
          </CopyToClipboard>
        </div>
      </div>
    );
  }

  renderMessage() {
    const { message } = this.state;

    if (!message) {
      return null;
    }

    return <div className={b('message')}>{this.getMessage()}</div>;
  }

  render() {
    const { isVisible, title } = this.state;

    return (
      <Dialog visible={isVisible} onClose={this.onClose}>
        <div className={b()}>
          <Dialog.Header caption={title} />
          <Dialog.Body className={b('content')}>
            {this.renderRequestIdRow()}
            {this.renderMessage()}
          </Dialog.Body>
          <Dialog.Footer
            onClickButtonCancel={this.onClose}
            textButtonCancel="Закрыть"
            textButtonApply={''}
            progress={false}
          />
        </div>
      </Dialog>
    );
  }
}

export default ErrorDialog;
