import React, { Component } from 'react';

import Icon from '@kamatech-data-ui/common/src/components/Icon/Icon';

import { CheckBox, Tooltip } from 'lego-on-react';

import iconVisualization from 'icons/visualization.svg';
import iconError from 'icons/error.svg';

import {
  BgColorsOutlined,
  CloseOutlined,
  HolderOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SwapOutlined,
} from '@ant-design/icons';

import {
  CONFLICT_TOOLTIPS,
  ITEM_TYPES,
  MEASURE_TYPE,
  VISUALIZATIONS,
} from '../../../../../constants';

import { DndContainer } from '@lib-shared/ui/drag-n-drop';
import Dropdown from '../../../../../components/Dropdown/Dropdown';

import DialogFilter from '../components/Dialogs/DialogFilter';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  setClusterPrecision,
  setColors,
  setCoordType,
  setDiagramMagnitude,
  setExportLimit,
  setFilters,
  setMapLayerOpacity,
  setNeedTotal,
  setNeedUniqueRows,
  setNullAlias,
  setPaginateInfo,
  setSort,
  setTitleLayerSource,
  setVisualization,
  setVisualizationPlaceholderItems,
  setVisualizationType,
  updatePreview,
} from '../../../../../actions';

import {
  selectClusterPrecision,
  selectColors,
  selectCoordType,
  selectDiagramMagnitude,
  selectExportLimit,
  selectFilters,
  selectMapLayerOpacity,
  selectNeedTotal,
  selectNeedUniqueRows,
  selectNullAlias,
  selectPaginateInfo,
  selectSort,
  selectTitleLayerSource,
  selectVisualization,
  selectVisualizationType,
  selectOrderBy,
} from '../../../../../reducers/visualization';

import {
  selectDataset,
  selectDatasetError,
  selectDimensions,
  selectMeasures,
  selectUpdates,
} from '../../../../../reducers/dataset';

import { CastIconsFactory } from '@lib-shared/ui/cast-icons-factory';

import Select from '../../../../../../kamatech_modules/lego-on-react/es-modules-src/components/select/select.react';
import TextInput from '../../../../../../kamatech_modules/lego-on-react/es-modules-src/components/textinput/textinput.react';
import DialogFormatTemplate from '../components/Dialogs/DialogFormatTemplate';
import { KamatechRangePicker } from '@kamatech-ui';
import { NullAlias } from '@kamatech-data-ui/chartkit/lib/components/Widget/Table/NullAlias';

const VISUALIZATION_LABELS = {
  'label_visualization-area': 'Диаграмма с областями',
  'label_visualization-area-100p': '100% диаграмма с областями',
  'label_visualization-column': 'Столбчатая диаграмма',
  'label_visualization-column-100p': '100% cтолбчатая диаграмма',
  'label_visualization-flat-table': 'Таблица',
  'label_visualization-line': 'Линейная диаграмма',
  'label_visualization-pie': 'Круговая диаграмма',
  'label_visualization-pivot-table': 'Сводная таблица',
  map: 'Карта',
  heatmap: 'Фоновая карта',
  map_cluster_focus_point: 'Карта очагов по кластеризации',
  label_visualization_card: 'Карточка объекта',
  'label_visualization-scatter': 'Точечная  диаграмма',
  'label_visualization-treemap': 'Древовидная диаграмма',
  label_visualization_indicator: 'Индикатор',
  label_visualization_multiline: 'График',
  label_visualization_column_plan_fact: 'Индикатор сопоставления план-факт',
};

// todo разбить на компоненты
class SectionVisualization extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  setFilterModalRef = c => {
    if (c) {
      this.filterModalRef = c;
    }
  };

  setDropdownRef = c => {
    if (c) {
      this.dropdownRef = c;
    }
  };

  onDropdownClick = () => {
    this.dropdownRef.toggle();
  };

  renderPlaceholder = placeholder => {
    const {
      setVisualizationPlaceholderItems,
      updatePreview,
      dataset,
      datasetError,
      dimensions,
      measures,
      visualization,
      filters,
      colors,
      sort,
      coordType,
      titleLayerSource,
      clusterPrecision,
      updates,
      nullAlias,
      needUniqueRows,
      needTotal,
      paginateInfo,
      diagramMagnitude,
      exportLimit,
    } = this.props;

    const { items } = placeholder;

    const placeholderTitleLabels = {
      // section_colors: 'Цвета', Скрыто по просьбе аналитика Кластрум
      section_columns: 'Столбцы',
      section_dimensions: 'Измерения',
      section_filters: 'Фильтры',
      section_measures: 'Показатели',
      section_measure: 'Показатель',
      additional_measure: 'Дополнительные показатели',
      signatures: 'Подписи',
      // additional_data: 'Сопроводительные данные', Скрыто по просьбе аналитика Кластрум
      map_color: 'Цвет',
      focus_count: 'Количественные показатели',
      array_join: 'Связываение по полю-массив',
      array_last_item_join: 'Связываение по последнему полю массива',
      map_size: 'Размер',
      tooltip_measure: 'Подписи',
      // drill_down_measure: 'Поле DrillDown', Скрыто по просьбе аналитика Кластрум
      drill_down_filter: 'Фильтр для детализации',
      section_measures_map_cluster: 'Измерение',
      administrative_divisions: 'Административные деления',
      section_measures_heatmap_district: 'Указатель районов',
      section_measures_heatmap_county: 'Указатель округов',
      section_measures_heatmap: 'Показатель значения',
      section_geopolygon: 'Геополигон',
      section_latitudes: 'Широта',
      section_longitudes: 'Долгота',
      focus_distance: 'Расстояние расчета фокуса',
      focus_point_from: 'Указатели начальных точек',
      focus_point_to: 'Указатели конечных точек',
      section_points: 'Точки',
      section_rows: 'Строки',
      section_size: 'Размер',
      section_sort: 'Сортировка',
      section_coord: 'Система координат',
      section_title_layer: 'Адрес топосновы',
      section_cluster_precision: 'Точность кластера',
      nullAlias: 'Подпись для пустых данных',
      summary: 'Строка итоговых значений',
      summaryControl: 'Показывать строку итоговых значений',
      uniqueRowsControl: 'Показывать только уникальные строки',
      section_x: 'X',
      section_y: 'Y',
      label_visualization_indicator: 'Индикатор',
      label_visualization_multiline: 'График',
      label_visualization_column_plan_fact: 'Индикатор сопоставления план-факт',
      section_plan: 'План',
      section_fact: 'Факт',
    };

    return (
      <div key={`placeholder-${placeholder.id}`} className={'subcontainer'}>
        <div className="subheader">
          <div className="placeholder-icon">{placeholder.icon}</div>
          <span>{placeholderTitleLabels[placeholder.title]}</span>
        </div>
        <DndContainer
          id={`placeholder-container-${placeholder.id}`}
          capacity={placeholder.capacity}
          allowedTypes={placeholder.allowedTypes}
          isNeedRemove
          isNeedSwap
          highlightDropPlace
          items={items}
          itemsClassName="placeholder-item"
          wrapTo={this.renderDatasetItem}
          disabled={datasetError}
          onItemClick={(e, item) => {
            if (
              ['flat-table-columns', 'measures', 'dimensions'].includes(placeholder.id)
            ) {
              this.setState({
                dialogItem: item,
                dialogType: 'column',
                dialogCallBack: result => {
                  if (result) {
                    updatePreview({
                      dataset,
                      dimensions,
                      measures,
                      visualization,
                      filters,
                      colors,
                      sort,
                      coordType,
                      titleLayerSource,
                      clusterPrecision,
                      updates,
                      nullAlias,
                      needUniqueRows,
                      needTotal,
                      paginateInfo,
                      diagramMagnitude,
                      exportLimit,
                    });
                  }
                },
              });
            }
          }}
          onUpdate={items => {
            setVisualizationPlaceholderItems({
              visualization,
              placeholder,
              items,
            });

            updatePreview({
              dataset,
              dimensions,
              measures,
              visualization,
              filters,
              colors,
              sort,
              coordType,
              titleLayerSource,
              clusterPrecision,
              updates,
              nullAlias,
              needUniqueRows,
              needTotal,
              paginateInfo,
              diagramMagnitude,
              exportLimit,
            });
          }}
        />
      </div>
    );
  };

  fillDatasetName(widgetItems, dimensions) {
    widgetItems.forEach(item => {
      let dimension = dimensions.find(d => d.datasetId === item.datasetId);
      if (dimension) {
        item.datasetName = dimension.datasetName;
      }
    });
  }

  renderVisualizationPlaceholders() {
    const {
      visualization,
      dataset,
      datasetError,
      dimensions,
      measures,
      filters,
      colors,
      sort,
      coordType,
      titleLayerSource,
      clusterPrecision,
      nullAlias,
      needUniqueRows,
      needTotal,
      updates,
      exportLimit,
      setFilters,
      setColors,
      setSort,
      setCoordType,
      setTitleLayerSource,
      setClusterPrecision,
      updatePreview,
      setNullAlias,
      setNeedUniqueRows,
      setNeedTotal,
      paginateInfo,
      setPaginateInfo,
      diagramMagnitude,
      setDiagramMagnitude,
      mapLayerOpacity,
      setMapLayerOpacity,
      setExportLimit,
    } = this.props;

    visualization.placeholders.forEach(p => this.fillDatasetName(p.items, dimensions));
    this.fillDatasetName(filters, dimensions);

    let coordsItems = ['EPSG:4326', 'EPSG:3857'];

    const nullAliasItems = [
      NullAlias.NULL,
      NullAlias.EMPTY,
      NullAlias.DASH,
      NullAlias.NO_DATA,
      NullAlias.UNDEFINED,
      NullAlias.ZERO,
    ];

    const diagramMagnitudeItems = [
      {
        label: 'Абсолютные значения',
        value: MEASURE_TYPE.ABSOLUTE,
      },
      {
        label: 'Проценты',
        value: MEASURE_TYPE.RELATIVE,
      },
      {
        label: 'Не отображать',
        value: MEASURE_TYPE.EMPTY,
      },
    ];

    let clusterPrecisionItem = 0;

    let paginateInfoItem = { page: 0, pageSize: 150 };

    if (!visualization) {
      return null;
    }

    let extraClass = '';
    if (datasetError) {
      extraClass = ' disabled';
    }

    if (!coordType && visualization.allowCoordType) {
      setCoordType({
        coordType: coordsItems[0],
      });
    }
    if (!titleLayerSource && visualization.allowTitleLayerSource) {
      setTitleLayerSource({
        titleLayerSource: window.DL.dotenv.MAP_LAYER_SOURCE,
      });
    }
    if (!clusterPrecision && visualization.allowClusterPrecision) {
      setClusterPrecision({
        clusterPrecision: clusterPrecisionItem,
      });
    }

    if (!paginateInfo) {
      setPaginateInfo({
        paginateInfo: paginateInfoItem,
      });
    }

    return (
      <div className={`placeholders${extraClass}`}>
        {visualization.placeholders.map((placeholder, index) => {
          return this.renderPlaceholder(placeholder, index);
        })}
        {visualization.allowFilters && (
          <div className="subcontainer">
            <div className="subheader">
              <div className="placeholder-icon">
                <FilterOutlined width="16" height="16" />
              </div>
              <span>Фильтры</span>
            </div>
            <DndContainer
              id="filter-container"
              isNeedRemove
              highlightDropPlace
              items={[...filters]}
              allowedTypes={ITEM_TYPES.ALL}
              itemsClassName="placeholder-item"
              wrapTo={this.renderDatasetItem}
              disabled={datasetError}
              onItemClick={(e, item) => {
                this.setState({
                  dialogItem: item,
                  dialogType: 'filter',
                  dialogCallBack: result => {
                    if (result) {
                      updatePreview({
                        dataset,
                        dimensions,
                        measures,
                        visualization,
                        filters,
                        colors,
                        sort,
                        coordType,
                        titleLayerSource,
                        clusterPrecision,
                        updates,
                        nullAlias,
                        needUniqueRows,
                        needTotal,
                        paginateInfo,
                        diagramMagnitude,
                        exportLimit,
                      });
                    }
                  },
                });
              }}
              onUpdate={(items, item, action) => {
                if (action === 'remove') {
                  // Обрабатываем удаление фильтра
                  setFilters({
                    filters: items,
                  });

                  updatePreview({
                    dataset,
                    dimensions,
                    measures,
                    visualization,
                    filters: items,
                    colors,
                    sort,
                    coordType,
                    titleLayerSource,
                    clusterPrecision,
                    updates,
                    nullAlias,
                    needUniqueRows,
                    needTotal,
                    paginateInfo,
                    diagramMagnitude,
                    exportLimit,
                  });
                } else if (action === 'insert') {
                  this.setState({
                    dialogItem: item,
                    dialogType: 'filter',
                    dialogCallBack: result => {
                      if (result) {
                        // Модалку с фильтром засабмитили
                        setFilters({
                          filters: items,
                        });

                        updatePreview({
                          dataset,
                          dimensions,
                          measures,
                          visualization,
                          filters: items,
                          colors,
                          sort,
                          coordType,
                          titleLayerSource,
                          clusterPrecision,
                          updates,
                          nullAlias,
                          needUniqueRows,
                          needTotal,
                          paginateInfo,
                          diagramMagnitude,
                          exportLimit,
                        });
                      }
                    },
                  });
                } else {
                  // Обрабатываем замену фильтра

                  // Обрабатываем добавление фильтра
                  if (item.filter) {
                    setFilters({
                      filters: items,
                    });

                    updatePreview({
                      dataset,
                      dimensions,
                      measures,
                      visualization,
                      filters: items,
                      colors,
                      sort,
                      coordType,
                      titleLayerSource,
                      clusterPrecision,
                      updates,
                      nullAlias,
                      needUniqueRows,
                      needTotal,
                      paginateInfo,
                      diagramMagnitude,
                      exportLimit,
                    });
                  } else {
                    this.setState({
                      dialogItem: item,
                      dialogType: 'filter',
                      dialogCallBack: result => {
                        if (result) {
                          // Модалку с фильтром засабмитили
                          setFilters({
                            filters: items,
                          });

                          updatePreview({
                            dataset,
                            dimensions,
                            measures,
                            visualization,
                            filters: items,
                            colors,
                            sort,
                            coordType,
                            titleLayerSource,
                            clusterPrecision,
                            updates,
                            nullAlias,
                            needUniqueRows,
                            needTotal,
                            paginateInfo,
                            diagramMagnitude,
                            exportLimit,
                          });
                        }
                      },
                    });
                  }
                }
              }}
            />
          </div>
        )}
        {/* Скрыто по просьбе аналитика Кластрум
        {visualization.allowColors && (
          <div className="subcontainer">
            <div className="subheader">
              <div className="placeholder-icon">
                <BgColorsOutlined width="16" height="16" />
              </div>
              <span>Цвета</span>
            </div>
            <DndContainer
              id="colors-container"
              isNeedRemove
              isNeedSwap
              highlightDropPlace
              items={colors}
              capacity={visualization.colorsCapacity || 1}
              checkAllowed={item => {
                return visualization.checkAllowedColors(item, visualization);
              }}
              itemsClassName="placeholder-item"
              wrapTo={this.renderDatasetItem}
              disabled={datasetError}
              onUpdate={items => {
                setColors({
                  colors: items,
                });

                updatePreview({
                  dataset,
                  dimensions,
                  measures,
                  visualization,
                  filters,
                  colors: items,
                  sort,
                  coordType,
                  titleLayerSource,
                  clusterPrecision,
                  updates,
                  nullAlias,
                  needUniqueRows,
                  needTotal,
                  paginateInfo,
                  diagramMagnitude,
                  exportLimit,
                });
              }}
            />
          </div>
        )} */}
        {visualization.allowSort && (
          <div className="subcontainer">
            <div className="subheader">
              <div className="placeholder-icon">
                <SortAscendingOutlined width="16" height="16" />
              </div>
              <span>Сортировка</span>
            </div>
            <DndContainer
              id="sort-container"
              isNeedRemove
              isNeedSwap
              highlightDropPlace
              items={sort}
              capacity={10}
              checkAllowed={item => {
                return visualization.checkAllowedSort(item, visualization, colors);
              }}
              itemsClassName="placeholder-item sort-item"
              wrapTo={this.renderDatasetItem}
              disabled={datasetError}
              onItemClick={(e, item) => {
                item.direction = item.direction === 'ASC' ? 'DESC' : 'ASC';

                setSort({
                  sort,
                });

                updatePreview({
                  dataset,
                  dimensions,
                  measures,
                  visualization,
                  filters,
                  colors,
                  sort,
                  coordType,
                  titleLayerSource,
                  clusterPrecision,
                  updates,
                  nullAlias,
                  needUniqueRows,
                  needTotal,
                  paginateInfo,
                  diagramMagnitude,
                  exportLimit,
                });
              }}
              onUpdate={items => {
                setSort({
                  sort: items,
                });

                updatePreview({
                  dataset,
                  dimensions,
                  measures,
                  visualization,
                  filters,
                  colors,
                  sort: items,
                  coordType,
                  titleLayerSource,
                  clusterPrecision,
                  updates,
                  nullAlias,
                  needUniqueRows,
                  needTotal,
                  paginateInfo,
                  diagramMagnitude,
                  exportLimit,
                });
              }}
            />
          </div>
        )}
        {visualization.allowCoordType && (
          <div className="subcontainer">
            <div className="subheader">
              <span>Система координат</span>
            </div>
            <div className="subitem">
              <Select
                theme="normal"
                size="m"
                view="default"
                tone="default"
                type="radio"
                placeholder="size m"
                width="max"
                options={coordsItems}
                val={coordType}
                onChange={newValue => {
                  setCoordType({
                    coordType: newValue[0],
                  });

                  updatePreview({
                    dataset,
                    dimensions,
                    measures,
                    visualization,
                    filters,
                    colors,
                    sort,
                    coordType: newValue[0],
                    titleLayerSource,
                    clusterPrecision,
                    updates,
                    nullAlias,
                    needUniqueRows,
                    needTotal,
                    paginateInfo,
                    diagramMagnitude,
                    exportLimit,
                  });
                }}
              >
                {coordsItems.map((coordType, i) => {
                  return (
                    <Select.Item key={`coordType-${i}`} val={coordType}>
                      {coordType}
                    </Select.Item>
                  );
                })}
              </Select>
            </div>
          </div>
        )}
        {visualization.allowTitleLayerSource && (
          <div className="subcontainer">
            <div className="subheader">
              <span>Адрес топосновы</span>
            </div>
            <div className="subitem">
              <TextInput
                text={titleLayerSource}
                widthSize={'m'}
                theme="normal"
                size="m"
                view="default"
                tone="default"
                onChange={text => {
                  setTitleLayerSource({
                    titleLayerSource: text,
                  });
                }}
                onBlur={e => {
                  updatePreview({
                    dataset,
                    dimensions,
                    measures,
                    visualization,
                    filters,
                    colors,
                    sort,
                    coordType,
                    titleLayerSource: e.target.value,
                    clusterPrecision,
                    updates,
                    nullAlias,
                    needUniqueRows,
                    needTotal,
                    paginateInfo,
                    diagramMagnitude,
                    exportLimit,
                  });
                }}
              />
            </div>
          </div>
        )}
        {visualization.allowClusterPrecision && (
          <div className="subcontainer">
            <div className="subheader">
              <span>Точность кластера</span>
            </div>
            <div className="subitem">
              <TextInput
                text={clusterPrecision}
                widthSize={'m'}
                theme="normal"
                size="m"
                view="default"
                tone="default"
                onChange={text => {
                  setClusterPrecision({
                    clusterPrecision: text,
                  });
                }}
                onBlur={e => {
                  updatePreview({
                    dataset,
                    dimensions,
                    measures,
                    visualization,
                    filters,
                    colors,
                    sort,
                    coordType,
                    titleLayerSource,
                    clusterPrecision: e.target.value,
                    updates,
                    nullAlias,
                    needUniqueRows,
                    needTotal,
                    paginateInfo,
                    diagramMagnitude,
                    exportLimit,
                  });
                }}
              />
            </div>
          </div>
        )}
        {visualization.allowNullAlias && (
          <div className="subcontainer">
            <div className="subheader">
              <span>Подпись для пустых данных</span>
            </div>
            <div className="subitem">
              <Select
                theme="normal"
                size="n"
                view="default"
                tone="default"
                type="radio"
                width="max"
                options={nullAliasItems}
                val={nullAlias}
                onChange={newValue => {
                  setNullAlias({
                    nullAlias: newValue[0],
                  });

                  updatePreview({
                    dataset,
                    dimensions,
                    measures,
                    visualization,
                    filters,
                    colors,
                    sort,
                    coordType,
                    titleLayerSource,
                    clusterPrecision,
                    updates,
                    nullAlias: newValue[0],
                    needUniqueRows,
                    needTotal,
                    paginateInfo,
                    diagramMagnitude,
                    exportLimit,
                  });
                }}
              >
                {nullAliasItems.map((nullAlias, i) => {
                  const nullAliasLabels = {
                    null: 'Без подписи',
                    empty: 'Пустая строка " "',
                    dash: '"—"',
                    'no-data': '"Нет данных"',
                    undefined: '"Не указано"',
                    zero: 'Значение "0"',
                  };
                  return (
                    <Select.Item key={`null-alias-${i}`} val={nullAlias}>
                      {nullAliasLabels[nullAlias]}
                    </Select.Item>
                  );
                })}
              </Select>
            </div>
          </div>
        )}
        {visualization.allowUniqueRows && (
          <div className="subcontainer">
            <div className="subheader">
              <span>Строки</span>
            </div>
            <div className="subitem">
              <CheckBox
                theme="normal"
                size="n"
                view="default"
                tone="default"
                checked={needUniqueRows}
                text="Показывать только уникальные строки"
                onChange={() => {
                  setNeedUniqueRows({ needUniqueRows: !needUniqueRows });

                  updatePreview({
                    dataset,
                    dimensions,
                    measures,
                    visualization,
                    filters,
                    colors,
                    sort,
                    coordType,
                    titleLayerSource,
                    clusterPrecision,
                    updates,
                    nullAlias,
                    needUniqueRows: !needUniqueRows,
                    needTotal,
                    paginateInfo,
                    diagramMagnitude,
                    exportLimit,
                  });
                }}
              />
            </div>
          </div>
        )}
        {visualization.allowTotal && (
          <div className="subcontainer">
            <div className="subheader">
              <span>Строка итоговых значений</span>
            </div>
            <div className="subitem">
              <CheckBox
                theme="normal"
                size="n"
                view="default"
                tone="default"
                checked={needTotal}
                text="Показывать строку итоговых значений"
                onChange={() => {
                  setNeedTotal({ needTotal: !needTotal });

                  updatePreview({
                    dataset,
                    dimensions,
                    measures,
                    visualization,
                    filters,
                    colors,
                    sort,
                    coordType,
                    titleLayerSource,
                    clusterPrecision,
                    updates,
                    nullAlias,
                    needUniqueRows,
                    needTotal: !needTotal,
                    paginateInfo,
                    diagramMagnitude,
                    exportLimit,
                  });
                }}
              />
            </div>
          </div>
        )}
        {visualization.allowDiagramMagnitude && (
          <div className="subcontainer">
            <div className="subheader">
              <span>Единицы измерения диаграммы</span>
            </div>
            <div className="subitem">
              <Select
                theme="normal"
                size="n"
                view="default"
                tone="default"
                type="radio"
                width="max"
                options={diagramMagnitudeItems}
                val={diagramMagnitude}
                onChange={newValue => {
                  setDiagramMagnitude({ diagramMagnitude: newValue[0] });

                  updatePreview({
                    dataset,
                    dimensions,
                    measures,
                    visualization,
                    filters,
                    colors,
                    sort,
                    coordType,
                    titleLayerSource,
                    clusterPrecision,
                    updates,
                    nullAlias,
                    needUniqueRows,
                    needTotal,
                    paginateInfo,
                    diagramMagnitude: newValue[0],
                    exportLimit,
                  });
                }}
              >
                {diagramMagnitudeItems.map((magnitudeItem, i) => {
                  return (
                    <Select.Item key={`measureItem-${i}`} val={magnitudeItem.value}>
                      {magnitudeItem.label}
                    </Select.Item>
                  );
                })}
              </Select>
            </div>
          </div>
        )}
        {visualization.allowMapLayerOpacity && (
          <div className="subcontainer">
            <div className="subheader">
              <span>Прозрачность карты</span>
            </div>
            <div className="subitem">
              <KamatechRangePicker
                initialValue={mapLayerOpacity}
                onChange={value => {
                  setMapLayerOpacity({ mapLayerOpacity: value });

                  updatePreview({
                    dataset,
                    dimensions,
                    measures,
                    visualization,
                    filters,
                    colors,
                    sort,
                    coordType,
                    titleLayerSource,
                    clusterPrecision,
                    updates,
                    nullAlias,
                    needUniqueRows,
                    needTotal,
                    paginateInfo,
                    diagramMagnitude,
                    mapLayerOpacity: value,
                    exportLimit,
                  });
                }}
              />
            </div>
          </div>
        )}
        {
          <div className="subcontainer">
            <div className="subheader">
              <span>Лимит экспортируемых записей</span>
            </div>
            <div className="subitem">
              <TextInput
                text={exportLimit}
                widthSize={'m'}
                theme="normal"
                size="m"
                view="default"
                tone="default"
                type="number"
                onChange={text => {
                  setExportLimit({
                    exportLimit: text,
                  });

                  updatePreview({
                    dataset,
                    dimensions,
                    measures,
                    visualization,
                    filters,
                    colors,
                    sort,
                    coordType,
                    titleLayerSource,
                    clusterPrecision,
                    updates,
                    nullAlias,
                    needUniqueRows,
                    needTotal,
                    paginateInfo,
                    diagramMagnitude,
                    exportLimit: text,
                  });
                }}
                onBlur={e => {
                  updatePreview({
                    dataset,
                    dimensions,
                    measures,
                    visualization,
                    filters,
                    colors,
                    sort,
                    coordType,
                    titleLayerSource,
                    clusterPrecision,
                    updates,
                    nullAlias,
                    needUniqueRows,
                    needTotal,
                    paginateInfo,
                    diagramMagnitude,
                    exportLimit: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        }
      </div>
    );
  }

  renderDatasetItem(props, itemComponent) {
    const { itemData, draggedItem, className, isDragging } = props;

    let resultClassName = '';

    resultClassName += className || '';
    resultClassName += itemData.className ? ` ${itemData.className}` : '';
    resultClassName += itemData.local ? ' local-item' : '';
    resultClassName += itemData.conflict ? ' conflict' : '';

    if (!itemData.undragable) {
      resultClassName += isDragging ? ' is-dragging' : '';
    }

    const swapIsAllowed =
      draggedItem &&
      !(draggedItem.containerIsNeedRemove === false) &&
      ((draggedItem.containerAllowedTypes &&
        draggedItem.containerAllowedTypes.has(itemData.type)) ||
        (draggedItem.containerAllowedTypes &&
          draggedItem.containerCheckAllowed(itemData))) &&
      ((props.containerAllowedTypes &&
        props.containerAllowedTypes.has(draggedItem.data.type)) ||
        (props.containerAllowedTypes && props.containerCheckAllowed(draggedItem.data)));

    const dragHoveredClassName = `drag-hovered ${
      swapIsAllowed ? 'drag-hovered-swap' : 'drag-hovered-remove'
    }`;

    return (
      <div
        key={itemData.id}
        className={resultClassName}
        title={itemData.title}
        onDragOver={e => {
          const element = e.currentTarget;

          if (itemData.type === 'PSEUDO') return;

          const { top, bottom } = e.currentTarget.getBoundingClientRect();
          const y = e.clientY - top;

          // Представьте систему координат в евклидовом пространстве, где ось y направлена вниз:
          // 0 находится там, где верхний край элемента, на который мы попали курсором, пока что-то тащили;
          // elementSize находится там, где нижний край этого же элемента.
          // Зона, которую мы считаем триггером для реплейса -
          // это зона размером с половину элемента от 1/4 его высоты до 3/4 его высоты.
          // Если попали в эту зону - то и добавляем этот класс
          const elementSize = bottom - top;
          const replaceZoneSize = elementSize / 2;

          const inReplaceZone =
            replaceZoneSize / 2 < y && y < elementSize - replaceZoneSize / 2;

          if (inReplaceZone) {
            let drawReplace;

            if (props?.containerAllowedTypes) {
              drawReplace = props?.containerAllowedTypes.has(draggedItem.data.type);
            } else if (props?.checkAllowed) {
              drawReplace = props?.checkAllowed(draggedItem.data);
            } else {
              drawReplace = false;
            }

            if (drawReplace && element.className.indexOf(dragHoveredClassName) === -1) {
              element.className += ` ${dragHoveredClassName}`;
            }
          } else {
            element.className = element.className.replace(` ${dragHoveredClassName}`, '');
          }
        }}
        onDragLeave={e => {
          const element = e.currentTarget;
          const related = e.relatedTarget;

          // Игнорируем ondragleave на крестик
          if (
            related &&
            (typeof related.className !== 'string' ||
              related.className.indexOf('cross-icon') > -1)
          ) {
            return false;
          }

          element.className = element.className.replace(` ${dragHoveredClassName}`, '');

          return true;
        }}
        onDrop={e => {
          const element = e.currentTarget;

          // Если есть нужный класс - триггерим реплейс
          if (element.className.indexOf(dragHoveredClassName) > -1) {
            element.className = element.className.replace(` ${dragHoveredClassName}`, '');
            props.setIsNeedReplace(true);
          }
        }}
        onMouseOver={() => {
          props.setTooltipVisibility(true);
        }}
        onMouseOut={() => {
          props.setTooltipVisibility(false);
        }}
        onClick={e => {
          if (props?.onItemClick) {
            props?.onItemClick(e, itemData);
          }
        }}
      >
        <HolderOutlined className="item-holder" />

        <CastIconsFactory iconType={itemData.cast} />

        <div className="item-title" title={itemData.datasetName + '.' + itemData.title}>
          {itemData.title}
        </div>
        {itemData.type === 'PSEUDO' ? null : (
          <div className="item-right-icons-container">
            <div className="item-right-icon swap-icon">
              <SwapOutlined width="16" />
            </div>
            <div
              className="item-right-icon cross-icon"
              onClick={e => {
                props.remove(props.index);
                e.stopPropagation();
                return false;
              }}
            >
              <CloseOutlined width="16" />
            </div>
            <div className="item-right-icon error-icon">
              <Icon data={iconError} width="16" />
            </div>
            {itemData.conflict ? (
              <Tooltip
                anchor={itemComponent}
                visible={props.tooltipVisibility}
                theme="error"
                view="classic"
                tone="default"
                to="top"
                size="xs"
                tail={false}
              >
                {CONFLICT_TOOLTIPS[itemData.conflict]}
              </Tooltip>
            ) : null}
          </div>
        )}
        {props?.containerId === 'sort-container' ? (
          <div className="item-sort">
            {itemData.direction === 'ASC' ? (
              <SortAscendingOutlined width="16" height="16" />
            ) : (
              <SortDescendingOutlined width="16" height="16" />
            )}
          </div>
        ) : null}
      </div>
    );
  }

  renderVisualizationSelection() {
    const {
      setVisualization,
      updatePreview,
      visualizationType,
      visualization,
      dataset,
      dimensions,
      measures,
      filters,
      coordType,
      titleLayerSource,
      clusterPrecision,
      updates,
      nullAlias,
      needUniqueRows,
      needTotal,
      paginateInfo,
      diagramMagnitude,
      exportLimit,
    } = this.props;

    const { value: visualizationTypeValue } = visualizationType;

    return (
      <div>
        <div className="dropdown-header">
          <h1>Элемент аналитической панели</h1>
        </div>
        <div className="visualizations-content">
          <div className="items-grid">
            {VISUALIZATIONS.filter(item => {
              return (
                visualizationTypeValue === 'all' || visualizationTypeValue === item.type
              );
            }).map(item => {
              return (
                <div
                  key={`visualization-item-${item.id}`}
                  className={`visualization-item${
                    visualization && visualization.id === item.id ? ' active' : ''
                  }`}
                  onClick={() => {
                    if (visualization.id === item.id) return;

                    this.dropdownRef.toggle();

                    const setResult = setVisualization({
                      visualization: item,
                    });

                    updatePreview({
                      dataset,
                      dimensions,
                      measures,
                      visualization: item,
                      filters,
                      colors: setResult.colors,
                      sort: setResult.sort,
                      coordType,
                      titleLayerSource,
                      clusterPrecision,
                      updates,
                      nullAlias,
                      needUniqueRows,
                      needTotal,
                      paginateInfo,
                      diagramMagnitude,
                      exportLimit,
                    });
                  }}
                >
                  {item.icon}
                  {VISUALIZATION_LABELS[item.name]
                    ? VISUALIZATION_LABELS[item.name]
                    : item.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  renderVisualizationPlaceholdersOrBlank() {
    const { visualization } = this.props;

    return visualization ? this.renderVisualizationPlaceholders() : null;
  }

  render() {
    const { visualization, sdk, dataset, updates } = this.props;
    const buttonText = visualization
      ? VISUALIZATION_LABELS[visualization.name]
      : 'Выберите тип чарта';
    const iconChooseVisualization = <Icon data={iconVisualization} width="24" />;

    return (
      <div className="container visualization-container">
        {this.state && this.state.dialogType === 'column' ? (
          <DialogFormatTemplate
            item={this.state.dialogItem}
            callback={this.state.dialogCallBack}
            visible={true}
          />
        ) : (
          <DialogFilter
            item={this.state.dialogItem}
            callback={this.state.dialogCallBack}
            dataset={dataset}
            updates={updates}
            sdk={sdk}
          />
        )}
        <div className="actions-container visualization-actions-container">
          <Dropdown
            ref={this.setDropdownRef}
            buttonText={
              <div>
                <div className="icon">
                  {visualization ? visualization.icon : iconChooseVisualization}
                </div>
                {buttonText}
              </div>
            }
            content={this.renderVisualizationSelection()}
          />
        </div>
        <div className="placeholders-wrapper">
          {this.renderVisualizationPlaceholdersOrBlank()}
        </div>
      </div>
    );
  }

  filterTemplate(
    dataset,
    updates,
    sdk,
    buttonText,
    visualization,
    iconChooseVisualization,
  ) {}

  columnTemplate(
    dataset,
    updates,
    sdk,
    buttonText,
    visualization,
    iconChooseVisualization,
  ) {
    return (
      <div className="container visualization-container">
        <div className="actions-container visualization-actions-container">
          <Dropdown
            ref={this.setDropdownRef}
            buttonText={
              <div>
                <div className="icon">
                  {visualization ? visualization.icon : iconChooseVisualization}
                </div>
                {buttonText}
              </div>
            }
            content={this.renderVisualizationSelection()}
          />
        </div>
        <div className="placeholders-wrapper">
          {this.renderVisualizationPlaceholdersOrBlank()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  visualizationType: selectVisualizationType,
  visualization: selectVisualization,
  filters: selectFilters,
  colors: selectColors,
  sort: selectSort,
  coordType: selectCoordType,
  titleLayerSource: selectTitleLayerSource,
  clusterPrecision: selectClusterPrecision,
  nullAlias: selectNullAlias,
  needUniqueRows: selectNeedUniqueRows,
  needTotal: selectNeedTotal,
  paginateInfo: selectPaginateInfo,
  selectOrderBy: selectOrderBy,

  dataset: selectDataset,
  datasetError: selectDatasetError,
  dimensions: selectDimensions,
  measures: selectMeasures,
  updates: selectUpdates,
  diagramMagnitude: selectDiagramMagnitude,
  mapLayerOpacity: selectMapLayerOpacity,
  exportLimit: selectExportLimit,
});

const mapDispatchToProps = {
  setVisualizationType,
  setVisualization,
  setVisualizationPlaceholderItems,
  updatePreview,
  setFilters,
  setColors,
  setSort,
  setCoordType,
  setTitleLayerSource,
  setClusterPrecision,
  setNullAlias,
  setNeedUniqueRows,
  setNeedTotal,
  setPaginateInfo,
  setDiagramMagnitude,
  setMapLayerOpacity,
  setExportLimit,
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionVisualization);
