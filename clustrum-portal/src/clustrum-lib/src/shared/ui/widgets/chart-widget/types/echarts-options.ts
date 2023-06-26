import { ChartType } from './chart-type';

export interface EchartsOptions {
  _comments: [];
  chart: {
    type: ChartType;
    zoomType: boolean;
    backgroundColor: string;
    className: string;
    spacingLeft: number;
    spacingRight: number;
    spacingBottom: number;
    style: {
      fontFamily: string;
      fontFeatureSettings: string;
    };
    events: object;
    spacingTop: number;
  };
  title: {
    text: string;
    style: {
      color: string;
    };
  };
  tooltip: {
    split: boolean;
    shared: boolean;
    dateTimeLabelFormats: {
      millisecond: string;
      second: string;
      minute: string;
      hour: string;
      day: string;
      week: string;
      quarter: string;
    };
    outside: boolean;
    followPointer: boolean;
    formatter: () => void;
  };
  legend: {
    itemStyle: {
      color: string;
    };
    itemHoverStyle: {
      color: string;
    };
    itemHiddenStyle: {
      color: string;
    };
    margin: number;
    itemDistance: number;
    alignColumns: boolean;
    enabled: boolean;
  };
  xAxis: {
    gridLineColor: string;
    lineColor: string;
    labels: {
      style: {
        color: string;
      };
      autoRotationLimit: number;
      y: number;
    };
    tickColor: string;
    tickmarkPlacement: string;
    dateTimeLabelFormats: {
      day: string;
      week: string;
      quarter: string;
    };
    startOnTick: boolean;
    endOnTick: boolean;
    categories: string[];
  };
  yAxis: {
    gridLineColor: string;
    lineColor: string;
    labels: {
      style: {
        color: string;
      };
      x: number;
    };
    tickColor: string;
    tickPixelInterval: number;
    plotLines: {
      value: number;
      width: number;
    }[];
    endOnTick: boolean;
  };
  plotOptions: {
    series: {
      label: {
        enabled: boolean;
      };
      tooltip: {
        headerFormat: string;
        pointFormat: string;
      };
      dataLabels: {
        style: {
          textOutline: string;
          color: string;
        };
      };
      events: object;
      point: {
        events: object;
      };
    };
    area: {
      boostThreshold: number;
      states: {
        hover: {
          lineWidth: number;
        };
      };
      turboThreshold: number;
      dataGrouping: {
        approximation: string;
      };
      marker: {
        enabled: boolean;
        radius: number;
        states: {
          hover: {
            radiusPlus: number;
          };
        };
      };
    };
    areaspline: {
      states: {
        hover: {
          lineWidth: number;
        };
      };
      turboThreshold: number;
      dataGrouping: {
        approximation: string;
      };
      marker: {
        enabled: boolean;
        radius: number;
        states: {
          hover: {
            radiusPlus: number;
          };
        };
      };
    };
    bar: {
      borderWidth: number;
      pointWidth: number;
      states: {
        hover: {
          lineWidth: number;
        };
      };
      turboThreshold: number;
      dataGrouping: {
        approximation: string;
      };
      marker: {
        enabled: boolean;
        radius: number;
        states: {
          hover: {
            radiusPlus: number;
          };
        };
      };
    };
    column: {
      states: {
        hover: {
          lineWidth: number;
        };
      };
      turboThreshold: number;
      dataGrouping: {
        approximation: string;
      };
      marker: {
        enabled: boolean;
        radius: number;
        states: {
          hover: {
            radiusPlus: number;
          };
        };
      };
    };
    line: {
      states: {
        hover: {
          lineWidth: number;
        };
      };
      turboThreshold: number;
      dataGrouping: {
        approximation: string;
      };
      marker: {
        enabled: boolean;
        radius: number;
        states: {
          hover: {
            radiusPlus: number;
          };
        };
      };
    };
    spline: {
      states: {
        hover: {
          lineWidth: number;
        };
      };
      turboThreshold: number;
      dataGrouping: {
        approximation: string;
      };
      marker: {
        enabled: boolean;
        radius: number;
        states: {
          hover: {
            radiusPlus: number;
          };
        };
      };
    };
    arearange: {
      tooltip: {
        pointFormat: string;
      };
      states: {
        hover: {
          lineWidth: number;
        };
      };
      turboThreshold: number;
      dataGrouping: {
        approximation: string;
      };
      marker: {
        enabled: boolean;
        radius: number;
        states: {
          hover: {
            radiusPlus: number;
          };
        };
      };
    };
    scatter: {
      tooltip: {
        headerFormat: string;
        pointFormat: string;
      };
    };
    bubble: {
      tooltip: {
        headerFormat: string;
        pointFormat: string;
      };
    };
    sankey: {
      tooltip: {
        headerFormat: string;
        pointFormat: string;
      };
    };
    heatmap: {
      tooltip: {
        headerFormat: string;
        pointFormat: string;
      };
    };
    treemap: {
      tooltip: {
        headerFormat: null;
        pointFormat: string;
      };
    };
    variwide: object;
    waterfall: object;
    pie: {
      borderWidth: number;
      innerSize: string;
      colors: string[];
      tooltip: {
        headerFormat: null;
        pointFormat: string;
      };
      states: {
        hover: {
          halo: {
            size: number;
          };
        };
        inactive: {
          opacity: number;
        };
      };
      allowPointSelect: boolean;
      slicedOffset: number;
      cursor: string;
      showInLegend: boolean;
    };
    histogram: {
      tooltip: {
        headerFormat: null;
        pointFormat: string;
      };
    };
    bellcurve: object;
    streamgraph: object;
    ohlc: {
      tooltip: {
        pointFormat: string;
      };
    };
    ema: object;
    sma: object;
    solidgauge: {
      allowPointSelect: boolean;
      slicedOffset: number;
      cursor: string;
      showInLegend: boolean;
    };
    funnel: {
      allowPointSelect: boolean;
      slicedOffset: number;
      cursor: string;
      showInLegend: boolean;
    };
  };
  exporting: {
    buttons: {
      contextButton: {
        enabled: boolean;
      };
    };
  };
  _config: {
    echart: {
      chart: {
        type: 'line';
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
    withoutLineLimit: boolean;
    removeShowHideAll: boolean;
    hideComments: boolean;
    hideHolidays: boolean;
    normalizeDiv: boolean;
    normalizeSub: boolean;
    period: number;
    xmax: string;
    xmin: string;
    max: boolean;
    min: boolean;
  };
  subtitle: {
    text: string;
  };
  series: {
    title: string;
    data: {
      y: string | number;
      label?: string | number;
      originalCategory: string;
      name?: string;
      valueWithFormat?: number;
    }[];
    legendTitle: string;
    colorValue: null;
    color: string;
    stack: null;
    name: string;
  }[];
}
