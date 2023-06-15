import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import highmaps from 'highcharts/modules/map';
highmaps(Highcharts);

import getConfig from '../../../modules/map/map';

class Map extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data === prevState.prevData) {
      return null;
    }

    const {
      data: { data, libraryConfig, config, comments },
    } = nextProps;
    const { config: options, callback } = getConfig(
      Object.assign({ highcharts: libraryConfig }, config),
      data,
      null,
      comments,
    );

    return {
      prevData: nextProps.data,
      options,
      callback,
    };
  }

  state = {
    prevData: null,
    options: null,
    callback: null,
  };

  componentDidMount() {
    const container = this.chartComponent.current.container.current;
    container.style.height = '100%';
    container.style.width = '100%';
    // может вызываться после unmount, поэтому проверям наличие ref
    window.requestAnimationFrame(
      () => this.chartComponent.current && this.chartComponent.current.chart.reflow(),
    );
  }

  componentDidCatch(error, info) {
    this.props.onError({ error, widgetData: this.state.options });
  }

  widget = null;
  chartComponent = React.createRef();

  render() {
    // console.log('Map', 'render', this.props);
    const { options, prevData } = this.state;
    return (
      <HighchartsReact
        // аналогично Graph
        // это сделано для того, чтобы Highcharts не обновлял карту, а удалял и рисовал
        key={Math.random()}
        options={options}
        highcharts={Highcharts}
        constructorType={'mapChart'}
        callback={chart => {
          this.widget = chart;
          const data = { widget: chart, widgetData: options, loadedData: prevData };
          this.state.callback(chart);
          this.props.onLoad(data);
        }}
        ref={this.chartComponent}
      />
    );
  }
}

export default Map;
