import React from 'react';
import PropTypes from 'prop-types';

import Graph from './Graph/Graph';
import OLMap from './OLMap/OLMap';
import SideHtml from './SideHtml/SideHtml';
import Card from './Card/Card';
import Indicator from './Indicator/Indicator';
import Table from './Table/Table';
import YandexMap from './YandexMap/YandexMap';
import Text from './WikiText/WikiText';
import Metric from './Metric/Metric';
import Control from './Control/Control';

import { WIDGET_TYPE as WIDGET_TYPE_CONST } from './WidgetType';

class Unknown extends React.PureComponent {
  static propTypes = {
    onLoad: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.onLoad();
  }

  componentDidUpdate() {
    this.props.onLoad();
  }

  render() {
    return <div>Unknown widget type</div>;
  }
}

class Widget extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    ownWidgetParams: PropTypes.instanceOf(Map),
    orderBy: PropTypes.object,
    onOrderByClickInWizard: PropTypes.func,
  };

  componentDidMount() {
    const { widgetType } = this.props.data;

    if (widgetType === WIDGET_TYPE.CONTROL) {
      this.props.onLoad();
    }
  }

  renderWidget() {
    const { widgetType } = this.props.data;

    switch (widgetType) {
      case WIDGET_TYPE.GRAPH:
        return <Graph {...this.props} />;
      case WIDGET_TYPE.MAP:
        return <OLMap {...this.props} />;
      case WIDGET_TYPE.CARD:
        return <Card {...this.props} />;
      case WIDGET_TYPE.INDICATOR:
        return <Indicator {...this.props} />;
      case WIDGET_TYPE.TABLE:
        return <Table {...this.props} />;
      case WIDGET_TYPE.YMAP:
        return <YandexMap {...this.props} />;
      case WIDGET_TYPE.TEXT:
        return <Text {...this.props} />;
      case WIDGET_TYPE.METRIC:
        return <Metric {...this.props} />;
      case WIDGET_TYPE.CONTROL:
        return null;
      default:
        return <Unknown {...this.props} />;
    }
  }

  renderSideHtml() {
    const { sideHtml, config } = this.props.data;
    return sideHtml ? (
      <SideHtml html={sideHtml} visible={!config.hideComments && config.showSideHtml} key="side" />
    ) : null;
  }

  renderControl() {
    const { uiScheme, params, entryId, widgetType } = this.props.data;

    if (uiScheme) {
      return (
        <Control
          scheme={uiScheme}
          params={params}
          entryId={entryId}
          onChange={this.props.onChange}
          standalone={widgetType === WIDGET_TYPE.CONTROL}
        />
      );
    }

    return null;
  }

  render() {
    return this.props.data ? (
      <React.Fragment>
        {this.renderSideHtml()}
        {this.renderControl()}
        {this.renderWidget()}
      </React.Fragment>
    ) : null;
  }
}

export default Widget;

export const WIDGET_TYPE = WIDGET_TYPE_CONST;
