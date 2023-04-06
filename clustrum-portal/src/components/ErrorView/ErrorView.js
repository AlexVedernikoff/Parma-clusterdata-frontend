import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Button } from 'lego-on-react';

// import './ErrorView.scss';

const b = block('error-view');

class ErrorView extends React.Component {
  static propTypes = {
    errorMessage: PropTypes.string.isRequired,
    actionBtnProps: PropTypes.shape({
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
  };

  render() {
    const { errorMessage, actionBtnProps } = this.props;

    return (
      <div className={b()}>
        <div className={b('error-message')}>
          <span>{errorMessage}</span>
        </div>
        {actionBtnProps && <Button size='s' type='submit' theme='action' {...actionBtnProps} />}
      </div>
    );
  }
}

export default ErrorView;
