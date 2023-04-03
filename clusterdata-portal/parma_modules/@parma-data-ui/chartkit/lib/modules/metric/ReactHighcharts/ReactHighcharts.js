import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import merge from 'lodash/merge';

import debounce from 'lodash/debounce';

// import './ReactHighcharts.scss';

export default class ReactHighcharts extends React.Component {
  static propTypes = {
    chartType: PropTypes.oneOf(['Chart', 'Map', 'StockChart']).isRequired,
    config: PropTypes.object.isRequired,
    callback: PropTypes.func,
    domProps: PropTypes.object,
    vaultId: PropTypes.string,
  };

  static defaultProps = {
    callback: () => {},
    domProps: {},
  };

  _renderChart(config) {
    if (this._chart) {
      this._chart.destroy();
    }
    const { chartType, callback } = this.props;
    this._chart = new Highcharts[chartType](merge({ chart: { renderTo: this._node } }, config), callback);
    window.requestAnimationFrame(() => this._chart && this._chart.options && this._chart.reflow());
  }

  componentDidMount() {
    this._renderChart(this.props.config);
    // window.addEventListener('resize', this._onResize);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.config === nextProps.config) {
      return true;
    }
    this._renderChart(nextProps.config);
    return false;
  }

  componentWillUnmount() {
    this._chart.destroy();
    // window.removeEventListener('resize', this._onResize);
  }

  render() {
    // 99% из-за FF, в котором появляется скролл из-за дробной высоты
    const domProps = merge({ style: { height: '99%' } }, this.props.domProps);
    return (
      <div
        {...domProps}
        ref={node => {
          this._node = node;
        }}
      />
    );
  }
}
