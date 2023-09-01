import { ChartType } from './chart-type';

// TODO: Этот тип нигде не используется, вместо него -- ChartWidgetData
// Но здесь значительно больше свойств, поэтому на всякий случай оставлен
// как источник знаний
export interface ChartData {
  config: {
    withoutLineLimit: boolean;
    removeShowHideAll: boolean;
    hideComments: boolean;
    hideHolidays: boolean;
    normalizeDiv: boolean;
    normalizeSub: boolean;
  };
  libraryConfig: {
    chart: {
      type: ChartType;
    };
    legend: object;
    xAxis: {
      endOnTick: boolean;
    };
    yAxis: {
      endOnTick: boolean;
    };
    tooltip: object;
    plotOptions: object;
  };
  widgetType: 'graph';
  isNewWizard: boolean;
  key: string;
  entryId: string;
  uiScheme: null;
  data: {
    categories: string[];
    categoriesDataTypeName: string;
    graphs: {
      name: string;
      title: string;
      data: {
        y: number;
        label: string;
        originalCategory: string;
      }[];
      legendTitle: string;
      colorValue: null;
      color: string;
      stack: null;
    }[];
    rows: null;
    head: null;
    total: null;
    rowsCount: null;
    geoJson: null;
    groupField: string;
    additionalData: {
      [key: string]: string | number;
    }[];
    query: string;
  };
  datasetId: string;
  datasetFields: object;
  params: object;
  usedParams: object;
  sources: {
    result: {
      sourceId: string;
      sourceType: string;
      url: string;
      responseHeaders: {
        server: null;
        date: null;
        connection: null;
        'content-type': null;
        'content-length': null;
        request_id: null;
        'x-qloud-router': null;
      };
      statusCode: number;
      latency: null;
      size: null;
    };
    datasetFields: {
      sourceId: string;
      sourceType: string;
      url: string;
      responseHeaders: {
        server: null;
        date: null;
        connection: null;
        'content-type': null;
        'content-length': null;
        request_id: null;
        'x-qloud-router': null;
      };
      statusCode: number;
      latency: null;
      size: null;
    };
  };
  logsV2: null;
  comments: null;
}
