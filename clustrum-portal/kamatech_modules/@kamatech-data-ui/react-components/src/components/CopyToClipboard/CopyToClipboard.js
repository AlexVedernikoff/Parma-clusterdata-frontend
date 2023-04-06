import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCopyToClipboard from 'react-copy-to-clipboard';

const propTypes = {
  children: PropTypes.func.isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  timeout: PropTypes.number,
  onCopy: PropTypes.func,
};

const defaultProps = {
  timeout: 500,
  onCopy: () => {},
};

const INITIAL_STATE = 'pending';

export default class CopyToClipboard extends Component {
  constructor(props) {
    super(props);

    this.handleCopy = this.handleCopy.bind(this);

    this.state = {
      state: INITIAL_STATE,
    };
  }

  handleCopy(text, copySuccess) {
    const { timeout, onCopy } = this.props;

    this.setState({ state: copySuccess ? 'success' : 'error' });

    setTimeout(() => {
      this.setState({ state: INITIAL_STATE });
    }, timeout);

    onCopy(text, copySuccess);
  }

  render() {
    const { children, text } = this.props;
    const { state } = this.state;
    const content = children(state);

    if (!React.isValidElement(content)) {
      throw new Error('Content must be a valid react element');
    }

    return (
      <ReactCopyToClipboard text={text} onCopy={this.handleCopy}>
        {content}
      </ReactCopyToClipboard>
    );
  }
}

CopyToClipboard.propTypes = propTypes;
CopyToClipboard.defaultProps = defaultProps;
