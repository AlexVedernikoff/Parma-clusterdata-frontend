import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import isElement from 'lodash/isElement';

import ChartMetric from '../../../modules/metric/metric';

function _unmountNode(node) {
  // в частности для удаления попапов после manager-refresh
  Array.from(node.childNodes).forEach(child => {
    if (child.childNodes) {
      Array.from(child.childNodes).forEach(node => {
        if (isElement(node)) {
          ReactDOM.unmountComponentAtNode(node);
        }
      });
    }
    ReactDOM.unmountComponentAtNode(child);
    child.remove();
  });
}

class Metric extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  };

  componentDidMount() {
    // console.log('Metric', 'componentDidMount');
    const { htmlElement } = new ChartMetric(this.props.data.config, this.props.data.data);
    this.htmlElement = htmlElement;
    this._node.appendChild(htmlElement);
    this.props.onLoad();
  }

  componentWillUpdate() {
    _unmountNode(this._node);
  }

  componentDidUpdate() {
    // console.log('Metric', 'componentDidUpdate');
    this._node.appendChild(this.htmlElement);
    this.props.onLoad();
  }

  componentWillUnmount() {
    _unmountNode(this._node);
  }

  render() {
    return (
      <div
        className="chartkit-metric"
        ref={node => {
          this._node = node;
        }}
      />
    );
  }
}

export default Metric;
