import React from 'react';
import PropTypes from 'prop-types';

import OLMap from './OLMap/OLMap';
import SideHtml from './SideHtml/SideHtml';

import ExtensionsManager from '../../modules/extensions-manager/extensions-manager';
import Card from './Card/Card';
import Indicator from './Indicator/Indicator';
import { WIDGET_TYPE as WIDGET_TYPE_CONST } from './WidgetType';
import { ChartWidget } from '@clustrum-lib/shared/ui/widgets/chart-widget/chart-widget';

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

    if (widgetType === WIDGET_TYPE.GRAPH) {
      return <ChartWidget {...this.props} />;
    }

    if (widgetType === WIDGET_TYPE.MAP) {
      return <OLMap {...this.props} />;
    }

    if (widgetType === WIDGET_TYPE.CARD) {
      return <Card {...this.props} />;
    }

    if (widgetType === WIDGET_TYPE.INDICATOR) {
      return <Indicator {...this.props} />;
    }

    if (widgetType === WIDGET_TYPE.CONTROL) {
      return null;
    }

    if (ExtensionsManager.has(widgetType)) {
      const Component = ExtensionsManager.get(widgetType);
      return <Component {...this.props} />;
    }

    return <Unknown {...this.props} />;
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
      if (ExtensionsManager.has(WIDGET_TYPE.CONTROL)) {
        const Control = ExtensionsManager.get(WIDGET_TYPE.CONTROL);
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

      console.warn('Control extension not found');
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
