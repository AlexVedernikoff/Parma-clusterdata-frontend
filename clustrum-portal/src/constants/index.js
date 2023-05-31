import React from 'react';

import Icon from '@kamatech-data-ui/common/src/components/Icon/Icon';

import iconVisLines from 'icons/vis-lines.svg';
import iconOlMap from 'icons/map.svg';
import iconVisGeopolygon from 'icons/vis-geopolygon.svg';
import iconVisArea from 'icons/vis-area.svg';
import iconVisArea100p from 'icons/vis-area-100p.svg';
import iconVisScatter from 'icons/vis-scatter.svg';
import iconVisPie from 'icons/vis-pie.svg';
import iconVisTreemap from 'icons/vis-treemap.svg';
import iconVisPivot from 'icons/vis-pivot.svg';
import iconVisFlatTable from 'icons/vis-flat-table.svg';
import iconVisColumns from 'icons/vis-columns.svg';
import iconVisColumns100p from 'icons/vis-column-100p.svg';
import iconX from 'icons/x.svg';
import iconY from 'icons/y.svg';
import iconSize from 'icons/size.svg';
import iconDimensionsTreemap from 'icons/dimensions-treemap.svg';
import iconDimensionsPie from 'icons/dimensions-pie.svg';
import iconMeasures from 'icons/measures.svg';
import iconMeasuresTable from 'icons/measures-table.svg';
import iconRows from 'icons/rows.svg';
import iconColumns from 'icons/columns.svg';
import iconPoints from 'icons/points.svg';
import iconIndicator from 'icons/indicator.svg';
import { WIZARD_NODE_TYPE } from './constants';
import { WIDGET_TYPE } from '@kamatech-data-ui/chartkit/lib/components/Widget/WidgetType';

const _getSelectItemTitle = () => ({
  visits: 'Визиты',
  hits: 'Просмотры',
  hahn: 'Hahn',
  arnold: 'Arnold',
  owner_only: 'Доступно только мне',
  explicit: 'Доступно для компании',
  installs: 'Установки',
  audience: 'Аудитории',
  client_events: 'Клиентские события',
  push_events: 'Push-кампании',
  audience_socdem: 'Аудитории + соц.дем',
});

export const getStaticSelectItems = values => {
  return values.map(value => {
    return {
      key: value,
      value: value,
      title: _getSelectItemTitle()[value],
    };
  });
};
export const getAppMetricGroupName = key => _getSelectItemTitle()[key];

// TODO: to think about how to get list of available connectors for creation (yt)
export const getConnectorsMap = () => {
  const { features: { dataset: { chOverYtEnabled, appMetricaEnabled } = {} } = {} } = window.DL;

  const connectorsList = {
    clickhouse: 'ClickHouse',
    csv: 'CSV',
    postgres: 'PostgreSQL',
    //mysql: 'MySQL',
    //mssql: 'MS SQL Server',
    //oracle: 'Oracle Database',
  };

  if (chOverYtEnabled) {
    connectorsList['ch_over_yt'] = 'CH over YT';
  }

  return connectorsList;
};

const aggregationValue = {
  boolean: 'Логический',
  date: 'Дата',
  datetime: 'Дата и время',
  timestamp: 'Отметка времени',
  float: 'Дробное число',
  double: 'Дробное число (64)',
  integer: 'Целое число',
  long: 'Целое число (64)',
  string: 'Строка',
  auto: 'Авто',
  geopoint: 'Геоточка',
  geopolygon: 'Геополигон',
  none: 'Нет',
  count: 'Количество',
  countunique: 'Количество уникальных',
  uniquearray: 'Массив уникальных',
  max: 'Максимум',
  min: 'Минимум',
  avg: 'Среднее',
  sum: 'Сумма',
  dataset: 'Набор данных',
  data: 'Данные',
};

export const getAggregationLabel = aggregation => {
  return aggregationValue[aggregation];
};

export const getFieldTypeLabel = aggregation => {
  return aggregationValue[aggregation];
};

const sectionCreationType = {
  connection: 'Создание подключения',
  dataset: 'Создание набора данных',
};

export const getFakeEntry = entryType => {
  const {
    user: { login },
  } = window.DL;

  return {
    fake: true,
    key: window.DL.user.login
      ? `/Users/${login}/${sectionCreationType[entryType]}`
      : `/${sectionCreationType[entryType]}`,
    entryId: null,
  };
};

export const EXECUTE_PARTICIPANT = {
  acl_execute: [{ subject: 'system_group:all_active_users' }],
};

export const ADMIN_PARTICIPANT = {
  acl_adm: [{ subject: 'user:current_user' }],
};

export const VALUES = {
  SORT_SEQUENCE: ['none', 'asc', 'desc', 'none'],
  SORT: {
    NONE: 'none',
    DESC: 'desc',
    ASC: 'asc',
  },
  SORTS: ['desc', 'asc'],
};

export const FIELD_TYPES = {
  NAME: 'name',
  TOKEN: 'token',
  HOST: 'host',
  CLUSTER_PRECISION: 'cluster_precision',
  PORT: 'port',
  DB_NAME: 'dbName',
  USERNAME: 'username',
  PASSWORD: 'password',
  CLUSTER: 'cluster',
  ALIAS: 'alias',
  COUNTER: 'counter',
  COUNTER_SOURCE: 'counterSource',
  MAX_POOL_SIZE: 'maxPoolSize',
};

export const TOAST_TYPES = {
  CREATE_CONNECTION: 'createConnection',
  MODIFY_CONNECTION: 'modifyConnection',
  VERIFY_CONNECTION: 'verifyConnection',
  CREATE_DATASET: 'createDataset',
  UPLOAD_CSV: 'uploadCsv',
  SAVE_CSV: 'saveCsv',
};

export const FIELD_PROPERTIES = {
  NAME: 'name',
  GUID: 'guid',
  TYPE: 'type',
  CAST: 'cast',
  AGGREGATION: 'aggregation',
  SOURCE: 'source',
  TITLE: 'title',
  DESCRIPTION: 'description',
  HIDE_FLAG: 'hidden',
  FORMULA: 'formula',
};

export const COUNTER_INPUT_METHODS = {
  LIST: 'from_list',
  MANUALLY: 'manually',
};

export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const TOAST_TIMEOUT_DEFAULT = 60000;

export const TOAST_NAME = 'dialog_footer_error';
export const CSV_TOAST_NAME = 'csv_error';
export const METRIKA_TOKEN_FAKE_VALUE = 'fake-token-value-with-equal-num-of-char';
export const REPLACE_SOURCE_MODE_ID = 'replace-source';
export const TAB_DATASET = 'dataset';
export const TAB_DATA = 'data';
export const DATASET_TABS = [TAB_DATASET, TAB_DATA];

////////////////////

export const ITEM_TYPES = {
  DIMENSIONS: new Set(['DIMENSION']),
  LATITUDE: new Set(['LATITUDE']),
  LONGITUDE: new Set(['LONGITUDE']),
  GEOPOLYGON: new Set(['GEOPOLYGON']),
  MEASURES: new Set(['MEASURE']),
  PSEUDO: new Set(['PSEUDO']),
  DIMENSIONS_AND_PSEUDO: new Set(['DIMENSION', 'PSEUDO']),
  ALL: new Set(['DIMENSION', 'MEASURE']),
};

export const CONFLICT_TOOLTIPS = {
  'not-existing': 'Поле отсутствует в датасете',
  'wrong-type': 'Поле имеет недопустимый тип',
};

export const DATASET_ERRORS = {
  403: 'У вас нет доступа к датасету',
  404: 'Набор данных не найден',
  500: 'Ошибка: не удалось загрузить датасет',
  UNKNOWN: 'Ошибка: не удалось загрузить датасет',
};

export const VISUALIZATION_TYPES = [
  {
    value: 'all',
    title: 'label_visualization-types-all',
  },
  {
    value: 'line',
    title: 'label_visualization-types-line',
  },
  {
    value: 'column',
    title: 'label_visualization-types-column',
  },
  {
    value: 'pie',
    title: 'label_visualization-types-pie',
  },
  {
    value: 'table',
    title: 'label_visualization-types-table',
  },
];

function onLineChartColorsChange({ placeholders, colors, visualization }) {
  if (colors.length) {
    if (colors.length === 1 && colors[0].type === 'PSEUDO') {
      visualization.colorsCapacity = 2;
    }

    if (colors.length === 2) {
      const pseudoIndex = colors.findIndex(color => {
        return color.type === 'PSEUDO';
      });

      colors.splice(pseudoIndex, 1);

      visualization.colorsCapacity = 1;

      const yItems = placeholders[1].items;

      yItems.splice(1, yItems.length - 1);
    }
  }
}

function onYAxisChange({ placeholder, colors, visualization }) {
  const xs = visualization.placeholders[0].items;
  const existingPseudoInColors = colors.find(item => item.type === 'PSEUDO');
  const existingPseudoInDimensions = xs.find(item => item.type === 'PSEUDO');

  if (placeholder.items.length > 1) {
    if (!existingPseudoInColors && !existingPseudoInDimensions) {
      if (colors.length > 0) {
        colors.splice(0, colors.length);
      }

      colors.push({
        title: 'Measure Names',
        type: 'PSEUDO',
        className: 'item pseudo-item dimension-item',
        cast: 'string',
      });

      onLineChartColorsChange({ placeholder, colors, visualization });
    }
  } else if (placeholder.items.length < 2) {
    if (existingPseudoInColors) {
      colors.splice(colors.indexOf(existingPseudoInColors), 1);
    } else if (existingPseudoInDimensions) {
      xs.splice(xs.indexOf(existingPseudoInDimensions), 1);
    }
  }
}

function onPivotTableMeasuresChange({ placeholder, visualization }) {
  const columns = visualization.placeholders[0].items;
  const rows = visualization.placeholders[1].items;

  const existingPseudoInColumns = columns.find(item => item.type === 'PSEUDO');
  const existingPseudoInRows = rows.find(item => item.type === 'PSEUDO');

  if (placeholder.items.length > 1 && !(existingPseudoInColumns || existingPseudoInRows)) {
    columns.push({
      title: 'Measure Names',
      type: 'PSEUDO',
      className: 'item pseudo-item dimension-item',
      cast: 'string',
    });
  } else if (placeholder.items.length < 2) {
    if (existingPseudoInColumns) {
      columns.splice(columns.indexOf(existingPseudoInColumns), 1);
    } else if (existingPseudoInRows) {
      rows.splice(rows.indexOf(existingPseudoInRows), 1);
    }
  }
}

function onTreemapDimensionsChange({ placeholder, visualization, colors }) {
  // При изменении содержимого измерений может произойти такое,
  // что для выбранной сортировки не существует измерения.
  // В таком случае нужно удалить такую сортировку.
  let invalidIndex;
  while (
    colors.some((sortItem, i) => {
      if (!visualization.checkAllowedColors(sortItem, visualization)) {
        invalidIndex = i;
        return true;
      }
    })
  ) {
    colors.splice(invalidIndex, 1);
  }
}

function onTreemapMeasuresChange({ placeholder, visualization }) {
  const dimensions = visualization.placeholders[0].items;

  const existingPseudo = dimensions.find(item => item.type === 'PSEUDO');

  if (placeholder.items.length > 1 && !existingPseudo) {
    dimensions.push({
      title: 'Measure Names',
      type: 'PSEUDO',
      className: 'item pseudo-item dimension-item',
      cast: 'string',
    });
  } else if (placeholder.items.length < 2) {
    if (existingPseudo) {
      dimensions.splice(dimensions.indexOf(existingPseudo), 1);
    }
  }
}

function onTableDimensionsChange({ placeholder, visualization, sort, colors }) {
  // При изменении содержимого измерений может произойти такое,
  // что для выбранной сортировки не существует измерения.
  // В таком случае нужно удалить такую сортировку.
  let invalidIndex;
  while (
    sort.some((sortItem, i) => {
      if (!visualization.checkAllowedSort(sortItem, visualization, colors)) {
        invalidIndex = i;
        return true;
      }
    })
  ) {
    sort.splice(invalidIndex, 1);
  }
}

const LINE_VISUALIZATION = {
  id: 'line',
  type: 'line',
  name: 'label_visualization-line',
  wizardNodeType: WIZARD_NODE_TYPE.GRAPH,
  icon: <Icon data={iconVisLines} width="24" />,
  allowFilters: true,
  allowColors: true,
  allowSort: true,
  colorsCapacity: 1,
  allowNullAlias: true,
  checkAllowedSort: (item, visualization) => {
    if (item.type === 'MEASURE') return false;

    const selectedItems = visualization.placeholders
      .reduce((a, b) => a.concat(b.items), [])
      .filter(selectedItem => selectedItem.type === 'DIMENSION');

    return selectedItems.some(selectedItem => selectedItem.guid === item.guid);
  },
  checkAllowedColors: (item, visualization) => {
    if (item.type !== 'DIMENSION') {
      return false;
    }

    const selectedItems = visualization.placeholders.reduce((a, b) => a.concat(b.items), []);

    return selectedItems.every(selectedItem => selectedItem.guid !== item.guid);
  },
  onColorsChange: onLineChartColorsChange,
  placeholders: [
    {
      allowedTypes: ITEM_TYPES.DIMENSIONS,
      id: 'x',
      type: 'x',
      title: 'section_x',
      icon: <Icon data={iconX} width="24" />,
      items: [],
      required: true,
      capacity: 1,
    },
    {
      allowedTypes: ITEM_TYPES.MEASURES,
      id: 'y',
      type: 'y',
      title: 'section_y',
      icon: <Icon data={iconY} width="24" />,
      items: [],
      capacity: Infinity,
      onChange: onYAxisChange,
    },
  ],
};

const MULTILINE_VISUALIZATION = {
  ...LINE_VISUALIZATION,
  id: 'multiline',
  name: 'label_visualization_multiline',
  placeholders: [
    {
      allowedTypes: ITEM_TYPES.DIMENSIONS,
      id: 'x',
      type: 'x',
      title: 'section_x',
      icon: <Icon data={iconX} width="24" />,
      items: [],
      required: true,
      capacity: Infinity,
    },
    {
      allowedTypes: ITEM_TYPES.MEASURES,
      id: 'y',
      type: 'y',
      title: 'section_y',
      icon: <Icon data={iconY} width="24" />,
      items: [],
      capacity: 1,
      onChange: onYAxisChange,
    },
  ],
};

const AREA_VISUALIZATION = {
  id: 'area',
  type: 'line',
  name: 'label_visualization-area',
  wizardNodeType: WIZARD_NODE_TYPE.GRAPH,
  icon: <Icon data={iconVisArea} width="24" />,
  allowFilters: true,
  allowColors: true,
  allowSort: true,
  allowNullAlias: true,
  checkAllowedSort: (item, visualization, colors) => {
    if (item.type !== 'DIMENSION') return false;

    const selectedItems = visualization.placeholders
      .reduce((a, b) => a.concat(b.items), [])
      .concat(colors)
      .filter(selectedItem => selectedItem.type === 'DIMENSION');

    return selectedItems.some(selectedItem => selectedItem.guid === item.guid);
  },
  checkAllowedColors: (item, visualization) => {
    if (item.type !== 'DIMENSION') {
      return false;
    }

    const selectedItems = visualization.placeholders.reduce((a, b) => a.concat(b.items), []);

    return selectedItems.every(selectedItem => selectedItem.guid !== item.guid);
  },
  onColorsChange: onLineChartColorsChange,
  placeholders: [
    {
      allowedTypes: ITEM_TYPES.DIMENSIONS,
      id: 'x',
      type: 'x',
      title: 'section_x',
      icon: <Icon data={iconX} width="24" />,
      items: [],
      required: true,
      capacity: 1,
    },
    {
      allowedTypes: ITEM_TYPES.MEASURES,
      id: 'y',
      type: 'y',
      title: 'section_y',
      icon: <Icon data={iconY} width="24" />,
      items: [],
      capacity: Infinity,
      onChange: onYAxisChange,
    },
  ],
};

const AREA_100P_VISUALIZATION = {
  ...AREA_VISUALIZATION,
  id: 'area100p',
  highchartsId: 'area',
  name: 'label_visualization-area-100p',
  icon: <Icon data={iconVisArea100p} width="24" />,
};

const COLUMN_VISUALIZATION = {
  id: 'column',
  type: 'column',
  name: 'label_visualization-column',
  wizardNodeType: WIZARD_NODE_TYPE.GRAPH,
  icon: <Icon data={iconVisColumns} width="24" />,
  allowFilters: true,
  allowColors: true,
  allowSort: true,
  allowNullAlias: true,
  checkAllowedSort: (item, visualization, colors) => {
    if (item.type === 'MEASURE') return true;

    const selectedItems = visualization.placeholders
      .reduce((a, b) => a.concat(b.items), [])
      .concat(colors)
      .filter(selectedItem => selectedItem.type === 'DIMENSION');

    return selectedItems.some(selectedItem => selectedItem.guid === item.guid);
  },
  checkAllowedColors: item => {
    return ITEM_TYPES.DIMENSIONS_AND_PSEUDO.has(item.type);
  },
  onColorsChange: onLineChartColorsChange,
  placeholders: [
    {
      allowedTypes: ITEM_TYPES.DIMENSIONS_AND_PSEUDO,
      id: 'x',
      type: 'x',
      title: 'section_x',
      icon: <Icon data={iconX} width="24" />,
      items: [],
      required: false,
      capacity: 2,
    },
    {
      allowedTypes: ITEM_TYPES.MEASURES,
      id: 'y',
      type: 'y',
      title: 'section_y',
      icon: <Icon data={iconY} width="24" />,
      items: [],
      capacity: Infinity,
      onChange: onYAxisChange,
    },
    {
      allowedTypes: ITEM_TYPES.ALL,
      id: 'additional_measure',
      type: 'additional_measure',
      title: 'additional_data',
      icon: <Icon data={iconRows} width="24" />,
      items: [],
      capacity: Infinity,
    },
    {
      allowedTypes: ITEM_TYPES.ALL,
      id: 'signatures',
      type: 'signatures',
      title: 'signatures',
      icon: <Icon data={iconRows} width="24" />,
      items: [],
      capacity: 1,
    },
  ],
};

const COLUMN_100P_VISUALIZATION = {
  ...COLUMN_VISUALIZATION,
  id: 'column100p',
  highchartsId: 'column',
  name: 'label_visualization-column-100p',
  icon: <Icon data={iconVisColumns100p} width="24" />,
};

const COLUMN_PLAN_FACT_VISUALIZATION = {
  ...COLUMN_VISUALIZATION,
  id: 'columnPlanFact',
  name: 'label_visualization_column_plan_fact',
  allowDiagramMagnitude: true,
  placeholders: [
    {
      allowedTypes: ITEM_TYPES.DIMENSIONS_AND_PSEUDO,
      id: 'x',
      type: 'x',
      title: 'section_x',
      icon: <Icon data={iconX} width="24" />,
      items: [],
      required: false,
      capacity: 1,
    },
    {
      allowedTypes: ITEM_TYPES.MEASURES,
      id: 'section_plan',
      type: 'y',
      title: 'section_plan',
      icon: <Icon data={iconY} width="24" />,
      items: [],
      capacity: 1,
      onChange: onYAxisChange,
    },
    {
      allowedTypes: ITEM_TYPES.MEASURES,
      id: 'section_fact',
      type: 'y',
      title: 'section_fact',
      icon: <Icon data={iconY} width="24" />,
      items: [],
      capacity: 1,
      onChange: onYAxisChange,
    },
  ],
};

const SCATTER_VISUALIZATION = {
  id: 'scatter',
  type: 'line',
  name: 'label_visualization-scatter',
  wizardNodeType: WIZARD_NODE_TYPE.GRAPH,
  icon: <Icon data={iconVisScatter} width="24" />,
  allowFilters: true,
  allowColors: true,
  allowSort: true,
  allowNullAlias: true,
  checkAllowedSort: (item, visualization) => {
    if (item.type === 'MEASURE') return false;

    // slice потому что допустимы только выбранные из X и Y, но не из Points
    const selectedItems = visualization.placeholders
      .slice(0, 2)
      .reduce((a, b) => a.concat(b.items), [])
      .filter(selectedItem => selectedItem.type === 'DIMENSION');

    return selectedItems.some(selectedItem => selectedItem.guid === item.guid);
  },
  checkAllowedColors: () => {
    return true;
  },
  placeholders: [
    {
      allowedTypes: ITEM_TYPES.ALL,
      id: 'x',
      type: 'x',
      title: 'section_x',
      icon: <Icon data={iconX} width="24" />,
      items: [],
      required: true,
      capacity: 1,
    },
    {
      allowedTypes: ITEM_TYPES.ALL,
      id: 'y',
      type: 'y',
      title: 'section_y',
      icon: <Icon data={iconY} width="24" />,
      items: [],
      required: true,
      capacity: 1,
      onChange: onYAxisChange,
    },
    {
      allowedTypes: ITEM_TYPES.DIMENSIONS,
      id: 'points',
      type: 'points',
      title: 'section_points',
      icon: <Icon data={iconPoints} width="24" />,
      items: [],
      capacity: 1,
    },
  ],
};

const PIE_VISUALIZATION = {
  id: 'pie',
  type: 'pie',
  name: 'label_visualization-pie',
  wizardNodeType: WIZARD_NODE_TYPE.GRAPH,
  allowFilters: true,
  icon: <Icon data={iconVisPie} width="24" />,
  allowSort: true,
  allowNullAlias: true,
  allowDiagramMagnitude: true,
  checkAllowedSort: (item, visualization) => {
    if (item.type === 'MEASURE') {
      return true;
    }

    const selectedItems = visualization.placeholders.reduce((a, b) => a.concat(b.items), []);

    return selectedItems.some(selectedItem => selectedItem.guid === item.guid);
  },
  placeholders: [
    {
      allowedTypes: ITEM_TYPES.DIMENSIONS,
      id: 'dimensions',
      type: 'dimensions',
      title: 'section_dimensions',
      icon: <Icon data={iconDimensionsPie} width="24" />,
      items: [],
      required: false,
      capacity: 1,
    },
    {
      allowedTypes: ITEM_TYPES.All,
      id: 'measures',
      type: 'measures',
      title: 'section_measures',
      icon: <Icon data={iconMeasures} width="24" />,
      items: [],
      required: true,
      capacity: Infinity,
    },
  ],
};

const TREEMAP_VISUALIZATION = {
  id: 'treemap',
  type: 'treemap',
  name: 'label_visualization-treemap',
  wizardNodeType: WIZARD_NODE_TYPE.GRAPH,
  allowFilters: true,
  icon: <Icon data={iconVisTreemap} width="24" />,
  allowColors: true,
  allowNullAlias: true,
  checkAllowedColors: (item, visualization) => {
    if (item.type === 'MEASURE') {
      return true;
    }

    const selectedItems = visualization.placeholders.reduce((a, b) => a.concat(b.items), []);

    return selectedItems.some(selectedItem => selectedItem.guid === item.guid);
  },
  placeholders: [
    {
      allowedTypes: ITEM_TYPES.DIMENSIONS,
      id: 'dimensions',
      type: 'dimensions',
      title: 'section_dimensions',
      icon: <Icon data={iconDimensionsTreemap} width="24" />,
      items: [],
      onChange: onTreemapDimensionsChange,
      required: true,
      capacity: Infinity,
    },
    {
      allowedTypes: ITEM_TYPES.MEASURES,
      id: 'measures',
      type: 'measures',
      title: 'section_size',
      icon: <Icon data={iconSize} width="24" />,
      items: [],
      onChange: onTreemapMeasuresChange,
      required: true,
      capacity: 1,
    },
  ],
};

const FLAT_TABLE_VISUALIZATION = {
  id: 'flatTable',
  type: 'table',
  name: 'label_visualization-flat-table',
  wizardNodeType: WIZARD_NODE_TYPE.TABLE,
  icon: <Icon data={iconVisFlatTable} width="24" />,
  allowFilters: true,
  allowColors: true,
  allowSort: true,
  allowNullAlias: true,
  allowUniqueRows: true,
  allowTotal: true,
  checkAllowedSort: (item, visualization) => {
    const selectedItems = visualization.placeholders.reduce((a, b) => a.concat(b.items), []);

    return selectedItems.some(selectedItem => selectedItem.guid === item.guid);
  },
  checkAllowedColors: item => {
    return item.type === 'MEASURE';
  },
  placeholders: [
    {
      allowedTypes: ITEM_TYPES.ALL,
      id: 'flat-table-columns',
      type: 'flat-table-columns',
      title: 'section_columns',
      icon: <Icon data={iconColumns} width="24" />,
      items: [],
      onChange: onTableDimensionsChange,
      required: true,
      capacity: Infinity,
    },
    {
      allowedTypes: ITEM_TYPES.ALL,
      id: 'drill_down_measure',
      type: 'drill_down_measure',
      title: 'drill_down_measure',
      items: [],
      capacity: 1,
    },
  ],
};

const PIVOT_TABLE_VISUALIZATION = {
  id: 'pivotTable',
  type: 'table',
  name: 'label_visualization-pivot-table',
  wizardNodeType: WIZARD_NODE_TYPE.TABLE,
  icon: <Icon data={iconVisPivot} width="24" />,
  allowFilters: true,
  allowColors: true,
  allowSort: true,
  allowNullAlias: true,
  allowUniqueRows: true,
  allowTotal: true,
  checkAllowedSort: (item, visualization) => {
    if (item.type === 'MEASURE') return false;

    const selectedItems = visualization.placeholders.reduce((a, b) => a.concat(b.items), []);

    return selectedItems.some(selectedItem => selectedItem.guid === item.guid);
  },
  checkAllowedColors: item => {
    return item.type === 'MEASURE';
  },
  allowedColorsTypes: ITEM_TYPES.MEASURES,
  placeholders: [
    {
      allowedTypes: ITEM_TYPES.DIMENSIONS_AND_PSEUDO,
      id: 'pivot-table-columns',
      type: 'pivot-table-columns',
      title: 'section_columns',
      icon: <Icon data={iconColumns} width="24" />,
      items: [],
      onChange: onTableDimensionsChange,
      capacity: Infinity,
    },
    {
      allowedTypes: ITEM_TYPES.DIMENSIONS_AND_PSEUDO,
      id: 'rows',
      type: 'rows',
      title: 'section_rows',
      icon: <Icon data={iconRows} width="24" />,
      items: [],
      onChange: onTableDimensionsChange,
      capacity: Infinity,
    },
    {
      allowedTypes: ITEM_TYPES.MEASURES,
      id: 'measures',
      type: 'measures',
      title: 'section_measures',
      icon: <Icon data={iconMeasuresTable} width="24" />,
      items: [],
      capacity: Infinity,
      onChange: onPivotTableMeasuresChange,
    },
  ],
};

const MAP_VISUALIZATION = {
  id: 'map',
  type: 'map',
  name: 'map',
  wizardNodeType: WIZARD_NODE_TYPE.MAP,
  allowFilters: true,
  allowCoordType: true,
  allowTitleLayerSource: true,
  allowClusterPrecision: true,
  icon: <Icon data={iconOlMap} width="24" />,
  placeholders: [
    {
      allowedTypes: ITEM_TYPES.DIMENSIONS,
      id: 'latitudes',
      type: 'latitudes',
      title: 'section_latitudes',
      items: [],
      required: true,
      capacity: 1,
    },
    {
      allowedTypes: ITEM_TYPES.DIMENSIONS,
      id: 'longitudes',
      type: 'longitudes',
      title: 'section_longitudes',
      items: [],
      required: true,
      capacity: 1,
    },
    {
      allowedTypes: ITEM_TYPES.ALL,
      id: 'geopolygon',
      type: 'geopolygon',
      title: 'section_geopolygon',
      items: [],
      required: false,
      capacity: 1,
    },
    {
      allowedTypes: ITEM_TYPES.MEASURES,
      id: 'measures',
      type: 'measures',
      title: 'section_measures',
      icon: <Icon data={iconMeasuresTable} width="24" />,
      items: [],
      required: false,
      capacity: 1,
    },
    {
      allowedTypes: ITEM_TYPES.ALL,
      id: 'additional_measure',
      type: 'additional_measure',
      title: 'additional_measure',
      icon: <Icon data={iconRows} width="24" />,
      items: [],
      capacity: Infinity,
    },
    {
      allowedTypes: ITEM_TYPES.MEASURES,
      id: 'map_color',
      type: 'map_color',
      title: 'map_color',
      items: [],
      capacity: 1,
    },
    {
      allowedTypes: ITEM_TYPES.MEASURES,
      id: 'map_size',
      type: 'map_size',
      title: 'map_size',
      items: [],
      capacity: 1,
    },
    {
      allowedTypes: ITEM_TYPES.ALL,
      id: 'tooltip_measure',
      type: 'tooltip_measure',
      title: 'tooltip_measure',
      items: [],
      capacity: Infinity,
    },
  ],
};

const HEATMAP_VISUALIZATION = {
  id: 'heatmap',
  type: 'map',
  name: 'heatmap',
  wizardNodeType: WIZARD_NODE_TYPE.MAP,
  allowFilters: true,
  allowCoordType: true,
  allowTitleLayerSource: true,
  allowMapLayerOpacity: true,
  icon: <Icon data={iconVisGeopolygon} width="24" />,
  placeholders: [
    {
      allowedTypes: ITEM_TYPES.ALL,
      id: 'geopolygon',
      type: 'geopolygon',
      title: 'section_geopolygon',
      items: [],
      required: true,
      capacity: 1,
    },
    {
      allowedTypes: ITEM_TYPES.ALL,
      id: 'map_color',
      type: 'map_color',
      title: 'map_color',
      items: [],
      required: true,
      capacity: 1,
    },
    {
      allowedTypes: ITEM_TYPES.ALL,
      id: 'tooltip_measure',
      type: 'tooltip_measure',
      title: 'tooltip_measure',
      items: [],
      capacity: Infinity,
    },
    {
      allowedTypes: ITEM_TYPES.DIMENSIONS,
      id: 'drill_down_filter',
      type: 'drill_down_filter',
      title: 'drill_down_filter',
      items: [],
      required: false,
      capacity: 1,
    },
  ],
};

const MAP_CLUSTER_FOCUS_POINT_VISUALIZATION = {
  id: 'map_cluster_focus_point',
  type: 'map',
  name: 'map_cluster_focus_point',
  wizardNodeType: WIZARD_NODE_TYPE.MAP,
  allowFilters: true,
  allowCoordType: true,
  allowTitleLayerSource: true,
  allowClusterPrecision: true,
  icon: <Icon data={iconOlMap} width="24" />,
  placeholders: [
    {
      allowedTypes: ITEM_TYPES.DIMENSIONS,
      id: 'latitudes',
      type: 'latitudes',
      title: 'section_latitudes',
      items: [],
      required: true,
      capacity: 1,
    },
    {
      allowedTypes: ITEM_TYPES.DIMENSIONS,
      id: 'longitudes',
      type: 'longitudes',
      title: 'section_longitudes',
      items: [],
      required: true,
      capacity: 1,
    },
    {
      allowedTypes: ITEM_TYPES.MEASURES,
      id: 'measures',
      type: 'measures',
      title: 'section_measures',
      icon: <Icon data={iconMeasuresTable} width="24" />,
      items: [],
      required: false,
      capacity: Infinity,
    },
    {
      allowedTypes: ITEM_TYPES.ALL,
      id: 'focus_count',
      type: 'focus_count',
      title: 'focus_count',
      items: [],
      capacity: Infinity,
    },
    {
      allowedTypes: ITEM_TYPES.ALL,
      id: 'administrative_divisions',
      type: 'administrative_divisions',
      title: 'administrative_divisions',
      items: [],
      required: false,
      capacity: 1,
    },
    {
      allowedTypes: ITEM_TYPES.ALL,
      id: 'additional_measure',
      type: 'additional_measure',
      title: 'additional_measure',
      icon: <Icon data={iconRows} width="24" />,
      items: [],
      capacity: Infinity,
    },
  ],
};

const CARD_VISUALIZATION = {
  id: 'card',
  type: 'card',
  name: 'label_visualization_card',
  wizardNodeType: WIZARD_NODE_TYPE.CARD,
  icon: <Icon data={iconVisFlatTable} width="24" />,
  allowFilters: true,
  allowColors: true,
  allowSort: true,
  allowNullAlias: true,
  allowTotal: true,
  checkAllowedSort: (item, visualization) => {
    const selectedItems = visualization.placeholders.reduce((a, b) => a.concat(b.items), []);

    return item.type === 'MEASURE' || selectedItems.some(selectedItem => selectedItem.guid === item.guid);
  },
  checkAllowedColors: item => {
    return item.type === 'MEASURE';
  },
  placeholders: [
    {
      allowedTypes: ITEM_TYPES.ALL,
      id: 'flat-table-columns',
      type: 'flat-table-columns',
      title: 'section_columns',
      icon: <Icon data={iconColumns} width="24" />,
      items: [],
      onChange: onTableDimensionsChange,
      required: true,
      capacity: Infinity,
    },
  ],
};

const INDICATOR_VISUALIZATION = {
  id: WIDGET_TYPE.INDICATOR,
  type: WIDGET_TYPE.INDICATOR,
  name: 'label_visualization_indicator',
  wizardNodeType: WIZARD_NODE_TYPE.INDICATOR,
  icon: <Icon data={iconIndicator} width="24" />,
  allowFilters: true,
  allowColors: false,
  allowSort: false,
  allowNullAlias: true,
  allowTotal: false,
  placeholders: [
    {
      allowedTypes: ITEM_TYPES.MEASURES,
      id: 'flat-table-columns',
      type: 'flat-table-columns',
      title: 'section_measure',
      icon: <Icon data={iconColumns} width="24" />,
      items: [],
      onChange: onTableDimensionsChange,
      required: true,
      capacity: 1,
    },
  ],
};

export const VISUALIZATIONS = [
  LINE_VISUALIZATION,
  AREA_VISUALIZATION,
  AREA_100P_VISUALIZATION,
  COLUMN_VISUALIZATION,
  COLUMN_100P_VISUALIZATION,
  SCATTER_VISUALIZATION,
  PIE_VISUALIZATION,
  TREEMAP_VISUALIZATION,
  FLAT_TABLE_VISUALIZATION,
  PIVOT_TABLE_VISUALIZATION,
  MAP_VISUALIZATION,
  HEATMAP_VISUALIZATION,
  MAP_CLUSTER_FOCUS_POINT_VISUALIZATION,
  CARD_VISUALIZATION,
  INDICATOR_VISUALIZATION,
  MULTILINE_VISUALIZATION,
  COLUMN_PLAN_FACT_VISUALIZATION,
];

export const DIMENSION_NUMBER_OPERATIONS = [
  {
    title: 'label_operation-in',
    selectable: true,
    code: 'IN',
  },
  {
    title: 'label_operation-nin',
    selectable: true,
    code: 'NIN',
  },
  {
    title: 'label_operation-equals',
    code: 'EQ',
  },
  {
    title: 'label_operation-nequals',
    code: 'NE',
  },
  {
    title: 'label_operation-gt',
    code: 'GT',
  },
  {
    title: 'label_operation-lt',
    code: 'LT',
  },
  {
    title: 'label_operation-gte',
    code: 'GTE',
  },
  {
    title: 'label_operation-lte',
    code: 'LTE',
  },
  {
    title: 'label_operation-is-null',
    noOperands: true,
    code: 'ISNULL',
  },
  {
    title: 'label_operation-is-not-null',
    noOperands: true,
    code: 'ISNOTNULL',
  },
];

export const MEASURE_NUMBER_OPERATIONS = [
  {
    title: 'label_operation-equals',
    code: 'EQ',
  },
  {
    title: 'label_operation-nequals',
    code: 'NE',
  },
  {
    title: 'label_operation-gt',
    code: 'GT',
  },
  {
    title: 'label_operation-lt',
    code: 'LT',
  },
  {
    title: 'label_operation-gte',
    code: 'GTE',
  },
  {
    title: 'label_operation-lte',
    code: 'LTE',
  },
  {
    title: 'label_operation-is-null',
    noOperands: true,
    code: 'ISNULL',
  },
  {
    title: 'label_operation-is-not-null',
    noOperands: true,
    code: 'ISNOTNULL',
  },
];

export const STRING_OPERATIONS = [
  {
    title: 'label_operation-in',
    selectable: true,
    code: 'IN',
  },
  {
    title: 'label_operation-nin',
    selectable: true,
    code: 'NIN',
  },
  {
    title: 'label_operation-equals',
    code: 'EQ',
  },
  {
    title: 'label_operation-nequals',
    code: 'NE',
  },
  {
    title: 'label_operation-startswith',
    code: 'STARTSWITH',
  },
  {
    title: 'label_operation-endswith',
    code: 'ENDSWITH',
  },
  {
    title: 'label_operation-contains',
    code: 'CONTAINS',
  },
  {
    title: 'label_operation-is-null',
    noOperands: true,
    code: 'ISNULL',
  },
  {
    title: 'label_operation-is-not-null',
    noOperands: true,
    code: 'ISNOTNULL',
  },
];

export const BOOLEAN_OPERATIONS = [
  {
    title: 'label_operation-equals',
    code: 'EQ',
  },
  {
    title: 'label_operation-nequals',
    code: 'NE',
  },
  {
    title: 'label_operation-is-null',
    noOperands: true,
    code: 'ISNULL',
  },
  {
    title: 'label_operation-is-not-null',
    noOperands: true,
    code: 'ISNOTNULL',
  },
];

export const DATE_OPERATIONS = [
  {
    title: 'label_operation-date-in',
    code: 'BETWEEN',
  },
  {
    title: 'label_operation-equals',
    oneDay: true,
    code: 'EQ',
  },
  {
    title: 'label_operation-nequals',
    oneDay: true,
    code: 'NE',
  },
  {
    title: 'label_operation-gt',
    oneDay: true,
    code: 'GT',
  },
  {
    title: 'label_operation-lt',
    oneDay: true,
    code: 'LT',
  },
  {
    title: 'label_operation-gte',
    oneDay: true,
    code: 'GTE',
  },
  {
    title: 'label_operation-lte',
    oneDay: true,
    code: 'LTE',
  },
  {
    title: 'label_operation-is-null',
    noOperands: true,
    code: 'ISNULL',
  },
  {
    title: 'label_operation-is-not-null',
    noOperands: true,
    code: 'ISNOTNULL',
  },
];

export const PREFIX = '/wizard';

export const MEASURE_TYPE = {
  ABSOLUTE: 'absolute',
  RELATIVE: 'relative',
};
