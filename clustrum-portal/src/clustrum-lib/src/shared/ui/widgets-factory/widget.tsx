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

import { WidgetType } from './types';

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
  shouldHideComments: boolean;
  shouldShowSideHtml: boolean;
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
  widgetType: WidgetType;
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

// TODO: Переименовать в `WidgetFactory` (и файл в `widget-factory.tsx`)
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

    if (widgetType === WidgetType.Control) {
      const { onLoad } = this.props;
      onLoad();
    }
  }

  renderWidget(): JSX.Element | null {
    const { data } = this.props;
    const { widgetType } = data;

    switch (widgetType) {
      case WidgetType.Graph:
        return <ChartWidget {...this.props} />;
      case WidgetType.Map:
        return <OLMap {...this.props} />;
      case WidgetType.Card:
        return <Card {...this.props} />;
      case WidgetType.Indicator:
        return <Indicator {...this.props} />;
      case WidgetType.Table:
        return <Table {...this.props} />;
      case WidgetType.Ymap:
        return <YandexMap {...this.props} />;
      case WidgetType.Text:
        return <Text {...this.props} />;
      case WidgetType.Metric:
        return <Metric {...this.props} />;
      case WidgetType.Control:
        return null;
      default:
        return <Unknown {...this.props} />;
    }
  }

  renderSideHtml(): JSX.Element | null {
    const { data } = this.props;
    const { sideHtml, config } = data;

    if (!sideHtml) {
      return null;
    }

    return (
      <SideHtml
        html={sideHtml}
        visible={!config.shouldHideComments && config.shouldShowSideHtml}
        key="side"
      />
    );
  }

  renderControl(): JSX.Element | null {
    const { data, onChange } = this.props;
    const { uiScheme, params, entryId, widgetType } = data;

    if (!uiScheme) {
      return null;
    }

    return (
      <Control
        scheme={uiScheme}
        params={params}
        entryId={entryId}
        onChange={onChange}
        standalone={widgetType === WidgetType.Control}
      />
    );
  }

  render(): JSX.Element | null {
    const { data } = this.props;

    if (!data) {
      return null;
    }
    return (
      <React.Fragment>
        {this.renderSideHtml()}
        {this.renderControl()}
        {this.renderWidget()}
      </React.Fragment>
    );
  }
}
