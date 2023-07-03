import React from 'react';
import PropTypes from 'prop-types';

import { ChartWidget } from '@lib-shared/ui/widgets-factory/widgets/chart-widget';
import { ChartWidgetProps, ChartWidgetData } from './widgets/chart-widget/types';
import OLMap from '@kamatech-data-ui/chartkit/lib/components/Widget/OLMap/OLMap';
import SideHtml from '@kamatech-data-ui/chartkit/lib/components/Widget/SideHtml/SideHtml';
import Card from '@kamatech-data-ui/chartkit/lib/components/Widget/Card/Card';
import Indicator from '@kamatech-data-ui/chartkit/lib/components/Widget/Indicator/Indicator';
import { TableAdapter as Table } from '@kamatech-data-ui/chartkit/lib/components/Widget/Table/TableAdapter';
import YandexMap from '@kamatech-data-ui/chartkit/lib/components/Widget/YandexMap/YandexMap';
import Text from '@kamatech-data-ui/chartkit/lib/components/Widget/WikiText/WikiText';
import Metric from '@kamatech-data-ui/chartkit/lib/components/Widget/Metric/Metric';
import Control from '@kamatech-data-ui/chartkit/lib/components/Widget/Control/Control';

import { WIDGET_TYPE } from './WidgetType';

interface UnknownProps {
  onLoad(): void;
}

class Unknown extends React.PureComponent<UnknownProps> {
  static propTypes = {
    onLoad: PropTypes.func.isRequired,
  };

  componentDidMount(): void {
    const { onLoad } = this.props;
    onLoad();
  }

  componentDidUpdate(): void {
    const { onLoad } = this.props;
    onLoad();
  }

  render(): JSX.Element {
    return <div>Unknown widget type</div>;
  }
}

interface ConfigType {
  hideComments: boolean;
  showSideHtml: boolean;
}

// TODO: Взято из `Control.js`, после типизации `Control`-а импортировать типы оттуда
interface SchemeItem {
  type: 'select' | 'button' | 'input' | 'checkbox' | 'datepicker' | 'range-datepicker';
  param: string;
  label: string;
  updateOnChange: boolean;
  updateControlsOnChange: boolean;
}

interface WidgetData {
  widgetType: WIDGET_TYPE;
  // Следующие два нужны только для `SideHtml`
  config: ConfigType;
  sideHtml: string;
  // Всё что ниже, нужно только для проброса в `Control`
  entryId: string;
  // Тип `object` в `Control.js`
  // TODO: Типизировать `params` после типизации `Control`
  params: object;
  uiScheme: SchemeItem[];
}

interface WidgetProps extends UnknownProps, ChartWidgetProps {
  data: ChartWidgetData & WidgetData;
  onChange(): void;
}

export class Widget extends React.PureComponent<WidgetProps> {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    ownWidgetParams: PropTypes.instanceOf(Map),
    orderBy: PropTypes.object,
    onOrderByClickInWizard: PropTypes.func,
  };

  componentDidMount(): void {
    const { data } = this.props;
    const { widgetType } = data;

    if (widgetType === WIDGET_TYPE.Control) {
      const { onLoad } = this.props;
      onLoad();
    }
  }

  renderWidget(): JSX.Element | null {
    const { data } = this.props;
    const { widgetType } = data;

    switch (widgetType) {
      case WIDGET_TYPE.Graph:
        return <ChartWidget {...this.props} />;
      case WIDGET_TYPE.Map:
        return <OLMap {...this.props} />;
      case WIDGET_TYPE.Card:
        return <Card {...this.props} />;
      case WIDGET_TYPE.Indicator:
        return <Indicator {...this.props} />;
      case WIDGET_TYPE.Table:
        return <Table {...this.props} />;
      case WIDGET_TYPE.Ymap:
        return <YandexMap {...this.props} />;
      case WIDGET_TYPE.Text:
        return <Text {...this.props} />;
      case WIDGET_TYPE.Metric:
        return <Metric {...this.props} />;
      case WIDGET_TYPE.Control:
        return null;
      default:
        return <Unknown {...this.props} />;
    }
  }

  renderSideHtml(): JSX.Element | null {
    const { data } = this.props;
    const { sideHtml, config } = data;
    return sideHtml ? (
      <SideHtml
        html={sideHtml}
        visible={!config.hideComments && config.showSideHtml}
        key="side"
      />
    ) : null;
  }

  renderControl(): JSX.Element | null {
    const { data, onChange } = this.props;
    const { uiScheme, params, entryId, widgetType } = data;

    if (uiScheme) {
      return (
        <Control
          scheme={uiScheme}
          params={params}
          entryId={entryId}
          onChange={onChange}
          standalone={widgetType === WIDGET_TYPE.Control}
        />
      );
    }

    return null;
  }

  render(): JSX.Element | null {
    const { data } = this.props;
    return data ? (
      <React.Fragment>
        {this.renderSideHtml()}
        {this.renderControl()}
        {this.renderWidget()}
      </React.Fragment>
    ) : null;
  }
}
