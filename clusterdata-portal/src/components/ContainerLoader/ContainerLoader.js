import React, { Component } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Loader } from '@parma-data-ui/common/src';

// import './ContainerLoader.scss';

const b = block('container-loader');

export default class ContainerLoader extends Component {
  static defaultProps = {
    size: 'l',
    sizeText: 'l',
    text: 'default',
    showDelay: 250,
  };

  static propTypes = {
    size: PropTypes.string,
    sizeText: PropTypes.string,
    text: PropTypes.string,
    showDelay: PropTypes.number,
    className: PropTypes.string,
  };

  state = {
    show: false,
  };

  componentDidMount() {
    this.showWithDelay();
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  showWithDelay() {
    const { showDelay } = this.props;

    this.timer = setTimeout(() => {
      this.setState({
        show: true,
      });
    }, showDelay);
  }

  clearTimer() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  render() {
    const { size, sizeText, text, className } = this.props;
    const { show } = this.state;

    if (!show) {
      return null;
    }

    return (
      <div className={b(false, className)}>
        <div className={b('inner')}>
          <div className={b('icon')}>
            <Loader size={size} />
          </div>
          <div className={b('text', { [size || sizeText]: true })}>{text}</div>
        </div>
      </div>
    );
  }
}
