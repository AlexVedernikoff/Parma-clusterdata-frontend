import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import ReactComponentsLoader from '@kamatech-data-ui/react-components/src/components/Loader';

// import './Loader.scss';

const b = block('chartkit-loader');

class Loader extends React.PureComponent {
  static propTypes = {
    size: PropTypes.oneOf(['s', 'm', 'l']),
    silentLoading: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    text: PropTypes.string,
  };

  static defaultProps = {
    size: 'm',
    silentLoading: false,
  };

  state = { visible: !this.isSilent };

  componentDidMount() {
    this.mounted = true;

    const { silentLoading } = this.props;
    if (typeof silentLoading === 'number') {
      setTimeout(() => this.mounted && this.setState({ visible: true }), silentLoading);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  get isSilent() {
    return this.props.silentLoading === true || typeof this.props.silentLoading === 'number';
  }

  mounted = false;

  render() {
    const { size, text } = this.props;
    return this.state.visible ? (
      <div className={b({ silent: this.isSilent })}>
        <ReactComponentsLoader size={size} />
        {text ? <div className={b('text')}>{text}</div> : null}
      </div>
    ) : null;
  }
}

export default Loader;
