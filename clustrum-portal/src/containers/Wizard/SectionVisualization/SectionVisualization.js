import React, { Component } from 'react';

import Icon from '@kamatech-data-ui/common/src/components/Icon/Icon';

import { CheckBox, Tooltip } from 'lego-on-react';

import iconVisualization from 'icons/visualization.svg';
import iconFilter from 'icons/filter.svg';
import iconColor from 'icons/color.svg';
import iconSwap from 'icons/swap.svg';
import iconCross from 'icons/cross.svg';
import iconError from 'icons/error.svg';
import iconSort from 'icons/sort.svg';
import iconSortDesc from 'icons/sort-desc.svg';
import iconSortAsc from 'icons/sort-asc.svg';

import { CONFLICT_TOOLTIPS, ITEM_TYPES, MEASURE_TYPE, VISUALIZATIONS } from '../../../constants';

import DNDContainer from '../../../components/DND/DNDContainer';
import Dropdown from '../../../components/Dropdown/Dropdown';

import DialogFilter from '../../../components/Dialogs/DialogFilter';

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
} from '../../../actions';

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
} from '../../../reducers/visualization';

import {
  selectDataset,
  selectDatasetError,
  selectDimensions,
  selectMeasures,
  selectUpdates,
} from '../../../reducers/dataset';

import { getIconForCast } from '../../../clustrum-lib/src/utils/helpers';

import { i18n } from '@kamatech-data-ui/clustrum';
import Select from '../../../../kamatech_modules/lego-on-react/es-modules-src/components/select/select.react';
import TextInput from '../../../../kamatech_modules/lego-on-react/es-modules-src/components/textinput/textinput.react';
import DialogFormatTemplate from '../../../components/Dialogs/DialogFormatTemplate';
import { ParmaRangePicker } from '@kamatech-ui';
import { NullAlias } from '@kamatech-data-ui/chartkit/lib/components/Widget/Table/NullAlias';

// import './SectionVisualization.scss';

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

    return (
      <div key={`placeholder-${placeholder.id}`} className={'subcontainer'}>
        <div className="subheader">
          <div className="placeholder-icon">{placeholder.icon}</div>
          <span>{i18n('wizard', placeholder.title)}</span>
        </div>
        <DNDContainer
          id={`placeholder-container-${placeholder.id}`}
          capacity={placeholder.capacity}
          allowedTypes={placeholder.allowedTypes}
          items={items}
          itemsClassName="placeholder-item"
          wrapTo={this.renderDatasetItem}
          disabled={datasetError}
          onItemClick={(e, item) => {
            if (['flat-table-columns', 'measures', 'dimensions'].includes(placeholder.id)) {
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
                <Icon data={iconFilter} width="24" />
              </div>
              <span>{i18n('wizard', 'section_filters')}</span>
            </div>
            <DNDContainer
              id="filter-container"
              noSwap={true}
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
              onUpdate={(items, item, action, onUndoInsert) => {
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
                      } else {
                        // Модалку с фильтром закенселили
                        items.splice(items.indexOf(item), 1);

                        if (onUndoInsert) {
                          onUndoInsert();
                        }
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
                        } else {
                          // Модалку с фильтром закенселили
                          if (onUndoInsert) {
                            onUndoInsert();
                          }
                        }
                      },
                    });
                  }
                }
              }}
            />
          </div>
        )}
        {visualization.allowColors && (
          <div className="subcontainer">
            <div className="subheader">
              <div className="placeholder-icon">
                <Icon data={iconColor} width="24" />
              </div>
              <span>{i18n('wizard', 'section_colors')}</span>
            </div>
            <DNDContainer
              id="colors-container"
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
        )}
        {visualization.allowSort && (
          <div className="subcontainer">
            <div className="subheader">
              <div className="placeholder-icon">
                <Icon data={iconSort} width="24" />
              </div>
              <span>{i18n('wizard', 'section_sort')}</span>
            </div>
            <DNDContainer
              id="sort-container"
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
              <span>{i18n('wizard', 'section_coord')}</span>
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
                      {i18n('wizard', coordType)}
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
              <span>{i18n('wizard', 'section_title_layer')}</span>
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
              <span>{i18n('wizard', 'section_cluster_precision')}</span>
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
              <span>{i18n('wizard', 'nullAlias')}</span>
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
                  return (
                    <Select.Item key={`null-alias-${i}`} val={nullAlias}>
                      {i18n('wizard.null-alias', nullAlias)}
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
              <span>{i18n('wizard', 'section_rows')}</span>
            </div>
            <div className="subitem">
              <CheckBox
                theme="normal"
                size="n"
                view="default"
                tone="default"
                checked={needUniqueRows}
                text={i18n('wizard', 'uniqueRowsControl')}
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
              <span>{i18n('wizard', 'summary')}</span>
            </div>
            <div className="subitem">
              <CheckBox
                theme="normal"
                size="n"
                view="default"
                tone="default"
                checked={needTotal}
                text={i18n('wizard', 'summaryControl')}
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
              <span>{i18n('wizard', 'diagram_magnitude')}</span>
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
              <span>{i18n('wizard', 'map_opacity')}</span>
            </div>
            <div className="subitem">
              <ParmaRangePicker
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
              <span>{i18n('wizard', 'export_limit')}</span>
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
    const { item, draggingItem, className, isDragging } = props;

    let resultClassName = '';

    resultClassName += className || '';
    resultClassName += item.className ? ` ${item.className}` : '';
    resultClassName += item.local ? ' local-item' : '';
    resultClassName += item.conflict ? ' conflict' : '';

    if (!item.undragable) {
      resultClassName += isDragging ? ' is-dragging' : '';
    }

    const swapIsAllowed =
      draggingItem &&
      !draggingItem.listNoRemove &&
      ((draggingItem.listAllowedTypes && draggingItem.listAllowedTypes.has(item.type)) ||
        (draggingItem.listCheckAllowed && draggingItem.listCheckAllowed(item))) &&
      ((props.listAllowedTypes && props.listAllowedTypes.has(draggingItem.item.type)) ||
        (props.listCheckAllowed && props.listCheckAllowed(draggingItem.item)));

    const dragHoveredClassName = `drag-hovered ${swapIsAllowed ? 'drag-hovered-swap' : 'drag-hovered-remove'}`;

    const castIconData = getIconForCast(item.cast);

    return (
      <div
        key={item.id}
        className={resultClassName}
        title={item.title}
        onDragOver={e => {
          const element = e.currentTarget;

          if (item.type === 'PSEUDO') return;

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

          const inReplaceZone = replaceZoneSize / 2 < y && y < elementSize - replaceZoneSize / 2;

          if (inReplaceZone) {
            let drawReplace;

            if (this.props.allowedTypes) {
              drawReplace = this.props.allowedTypes.has(draggingItem.item.type);
            } else if (this.props.checkAllowed) {
              drawReplace = this.props.checkAllowed(draggingItem.item);
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
          if (related && (typeof related.className !== 'string' || related.className.indexOf('cross-icon') > -1)) {
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
            this.doingReplace = true;
          }
        }}
        onMouseOver={() => {
          itemComponent.setState({
            tooltipVisible: true,
          });
        }}
        onMouseOut={() => {
          itemComponent.setState({
            tooltipVisible: false,
          });
        }}
        onClick={e => {
          if (this.props.onItemClick) {
            this.props.onItemClick(e, item);
          }
        }}
      >
        <div className="item-icon">
          <Icon data={castIconData} width="16" />
        </div>
        <div className="item-title" title={item.datasetName + '.' + item.title}>
          {item.title}
        </div>
        {item.type === 'PSEUDO' ? null : (
          <div className="item-right-icons-container">
            <div className="item-right-icon swap-icon">
              <Icon data={iconSwap} width="16" />
            </div>
            <div
              className="item-right-icon cross-icon"
              onClick={e => {
                props.remove(props.index);
                e.stopPropagation();
                return false;
              }}
            >
              <Icon data={iconCross} width="16" />
            </div>
            <div className="item-right-icon error-icon">
              <Icon data={iconError} width="16" />
            </div>
            {item.conflict ? (
              <Tooltip
                anchor={itemComponent}
                visible={itemComponent.state.tooltipVisible}
                theme="error"
                view="classic"
                tone="default"
                to="top"
                size="xs"
                tail={false}
              >
                {i18n('wizard', CONFLICT_TOOLTIPS[item.conflict])}
              </Tooltip>
            ) : null}
            {this.props.id === 'sort-container' ? (
              <div className="item-right-icon sort-icon">
                <Icon data={item.direction === 'ASC' ? iconSortAsc : iconSortDesc} width="16" />
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  renderVisualizationType = item => {
    const { visualizationType, setVisualizationType } = this.props;

    const { value, title } = item;

    const isActive = visualizationType === item;

    return (
      <div
        key={`visualization-item-type-${value}`}
        className={`visualization-item-type${isActive ? ' active' : ''}`}
        onClick={() => {
          setVisualizationType({
            visualizationType: item,
          });
        }}
      >
        {i18n('wizard', title)}
      </div>
    );
  };

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
          <h1>{i18n('wizard', 'label_choose-visualization-type')}</h1>
        </div>
        <div className="visualizations-content">
          <div className="items-grid">
            {VISUALIZATIONS.filter(item => {
              return visualizationTypeValue === 'all' || visualizationTypeValue === item.type;
            }).map(item => {
              return (
                <div
                  key={`visualization-item-${item.id}`}
                  className={`visualization-item${visualization && visualization.id === item.id ? ' active' : ''}`}
                  onClick={() => {
                    console.log('click');
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
                  {i18n('wizard', item.name)}
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
      ? i18n('wizard', visualization.name)
      : i18n('wizard', 'button_choose-visualization');
    const iconChooseVisualization = <Icon data={iconVisualization} width="24" />;
    return (
      <div className="container visualization-container">
        {this.state && this.state.dialogType === 'column' ? (
          <DialogFormatTemplate item={this.state.dialogItem} callback={this.state.dialogCallBack} visible={true} />
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
                <div className="icon">{visualization ? visualization.icon : iconChooseVisualization}</div>
                {buttonText}
              </div>
            }
            content={this.renderVisualizationSelection()}
          />
        </div>
        <div className="placeholders-wrapper">{this.renderVisualizationPlaceholdersOrBlank()}</div>
      </div>
    );
  }

  filterTemplate(dataset, updates, sdk, buttonText, visualization, iconChooseVisualization) {}

  columnTemplate(dataset, updates, sdk, buttonText, visualization, iconChooseVisualization) {
    return (
      <div className="container visualization-container">
        <div className="actions-container visualization-actions-container">
          <Dropdown
            ref={this.setDropdownRef}
            buttonText={
              <div>
                <div className="icon">{visualization ? visualization.icon : iconChooseVisualization}</div>
                {buttonText}
              </div>
            }
            content={this.renderVisualizationSelection()}
          />
        </div>
        <div className="placeholders-wrapper">{this.renderVisualizationPlaceholdersOrBlank()}</div>
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
