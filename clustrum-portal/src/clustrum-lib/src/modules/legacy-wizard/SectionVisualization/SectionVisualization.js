import React, { Component } from 'react';

import Icon from '@kamatech-data-ui/common/src/components/Icon/Icon';

import { Tooltip } from 'lego-on-react';

import iconError from 'icons/error.svg';
import { VisualizationFactory } from '@lib-entities/visualization-factory';
import { VisualizationAdapter } from '@lib-widgets/section-visualization';
import { COORD_ITEMS } from '@lib-widgets/section-visualization/lib/constants';

import {
  CloseOutlined,
  HolderOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SwapOutlined,
} from '@ant-design/icons';

import { CONFLICT_TOOLTIPS, MEASURE_TYPE } from '../../../../../constants';

import { checkDndActionAvailability } from '@lib-shared/ui/drag-n-drop';

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
  setNeedAutoNumberingRows,
  setNeedSteppedLayout,
  setSteppedLayoutIndentation,
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
  selectNeedAutoNumberingRows,
  selectNeedSteppedLayout,
  selectSteppedLayoutIndentation,
  selectNeedUniqueRows,
  selectNullAlias,
  selectPaginateInfo,
  selectSort,
  selectTitleLayerSource,
  selectVisualization,
  selectVisualizationType,
  selectOrderBy,
  selectHasExportTemplateXlsx,
  selectHasExportTemplateDocx,
} from '../../../../../reducers/visualization';

import {
  selectDataset,
  selectDatasetError,
  selectDimensions,
  selectMeasures,
  selectUpdates,
} from '../../../../../reducers/dataset';

import { CastIconsFactory } from '@lib-shared/ui/cast-icons-factory';

import DialogFormatTemplate from '../components/Dialogs/DialogFormatTemplate';
import { NullAlias } from '@kamatech-data-ui/chartkit/lib/components/Widget/Table/NullAlias';
import { VisualizationType } from '@lib-entities/visualization-factory/types';
import { VisualizationsList } from '@lib-features/visualizations-list';
import { $appSettingsStore } from '@shared/app-settings';
import { DialogPivotTable } from '../components/Dialogs/DialogPivotTable';
import cloneDeep from 'lodash/cloneDeep';
import { Dialogs } from './types';

const STEPPED_LAYOUT_INDENTATION_MAX_VALUE = 40;

const PIVOT_TABLE_PLACEHOLDERS_IDS = ['pivot-table-columns', 'rows', 'measures'];

// todo разбить на компоненты
class SectionVisualization extends Component {
  constructor(props) {
    super(props);

    this.state = { isDialogVisible: false };
    this.handleDialogActions = this.handleDialogActions.bind(this);
    this.setFilterDialog = this.setFilterDialog.bind(this);
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

  getPlaceholderDialogType(id) {
    return PIVOT_TABLE_PLACEHOLDERS_IDS.includes(id)
      ? Dialogs.PivotTableDialog
      : Dialogs.Column;
  }

  getPlaceholderDialogCallBack(id) {
    return PIVOT_TABLE_PLACEHOLDERS_IDS.includes(id)
      ? this.handleDialogPivotTableActions
      : this.handleDialogActions;
  }

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
      needAutoNumberingRows,
      needSteppedLayout,
      steppedLayoutIndentation,
      paginateInfo,
      diagramMagnitude,
      exportLimit,
      hasExportTemplateXlsx,
      hasExportTemplateDocx,
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
      <VisualizationFactory
        key={`placeholder-${placeholder.id}`}
        title={placeholderTitleLabels[placeholder.title]}
        type={VisualizationType.DndContainer}
        icon={placeholder.icon}
        containerProps={{
          id: `placeholder-container-${placeholder.id}`,
          capacity: placeholder.capacity,
          allowedTypes: placeholder.allowedTypes,
          isNeedRemove: true,
          isNeedSwap: true,
          highlightDropPlace: true,
          items: items,
          itemsClassName: 'placeholder-item',
          wrapTo: this.renderDatasetItem,
          disabled: datasetError,
          onItemClick: (e, item) => {
            if (
              [
                'flat-table-columns',
                'measures',
                'dimensions',
                ...PIVOT_TABLE_PLACEHOLDERS_IDS,
              ].includes(placeholder.id)
            ) {
              this.setState({
                dialogItem: item,
                dialogType: this.getPlaceholderDialogType(placeholder.id),
                isDialogVisible: true,
                dialogCallBack: this.getPlaceholderDialogCallBack(placeholder.id),
                dialogPlaceholder: placeholder,
              });
            }
          },
          onUpdate: items => {
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
              needAutoNumberingRows,
              needSteppedLayout,
              steppedLayoutIndentation,
              paginateInfo,
              diagramMagnitude,
              exportLimit,
              hasExportTemplateXlsx,
              hasExportTemplateDocx,
            });
          },
        }}
      />
    );
  };

  hideDialogWindow() {
    this.setState({
      dialogType: null,
      dialogItem: null,
      isDialogVisible: false,
      dialogPlaceholder: null,
    });
  }

  handleDialogActions(result, items = null) {
    this.hideDialogWindow();

    const { filters, setFilters, updatePreview } = this.props;

    if (!result) {
      return;
    }

    if (items) {
      setFilters({
        filters: items,
      });
    }

    updatePreview({
      ...this.props,
      filters: items || filters,
    });
  }

  handleDialogPivotTableActions(item) {
    this.hideDialogWindow();

    const { updatePreview, setVisualizationPlaceholderItems, visualization } = this.props;
    const { dialogPlaceholder } = this.state;
    const newItems = cloneDeep(dialogPlaceholder.items);
    newItems[dialogPlaceholder.items.findIndex(el => el.id === item.id)] = item;

    setVisualizationPlaceholderItems({
      visualization,
      placeholder: dialogPlaceholder,
      items: newItems,
    });

    updatePreview({
      ...this.props,
    });
  }

  fillDatasetName(widgetItems, dimensions) {
    widgetItems.forEach(item => {
      let dimension = dimensions.find(d => d.datasetId === item.datasetId);
      if (dimension) {
        item.datasetName = dimension.datasetName;
      }
    });
  }

  setFilterDialog(item, items) {
    this.setState({
      dialogItem: item,
      dialogType: 'filter',
      isDialogVisible: true,
      dialogCallBack: result => this.handleDialogActions(result, items),
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
      needAutoNumberingRows,
      needSteppedLayout,
      steppedLayoutIndentation,
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
      setNeedAutoNumberingRows,
      setNeedSteppedLayout,
      setSteppedLayoutIndentation,
      paginateInfo,
      setPaginateInfo,
      diagramMagnitude,
      setDiagramMagnitude,
      mapLayerOpacity,
      setMapLayerOpacity,
      setExportLimit,
      hasExportTemplateXlsx,
      hasExportTemplateDocx,
    } = this.props;

    visualization.placeholders.forEach(p => this.fillDatasetName(p.items, dimensions));
    this.fillDatasetName(filters, dimensions);

    let clusterPrecisionItem = 0;

    let paginateInfoItem = { page: 0, pageSize: 10 };

    if (!visualization) {
      return null;
    }

    let extraClass = '';
    if (datasetError) {
      extraClass = ' disabled';
    }

    if (!coordType && visualization.allowCoordType) {
      setCoordType({
        coordType: COORD_ITEMS[0],
      });
    }
    if (!titleLayerSource && visualization.allowTitleLayerSource) {
      setTitleLayerSource({
        titleLayerSource: $appSettingsStore.getState().mapLayerSource,
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
        <VisualizationAdapter
          visualization={visualization}
          renderItem={this.renderDatasetItem}
          setFilterDialog={this.setFilterDialog}
        />
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
      draggedItem.containerIsNeedRemove &&
      checkDndActionAvailability({ draggedItem }) &&
      checkDndActionAvailability(props);

    const dragHoveredClassName = `drag-hovered ${
      swapIsAllowed ? 'drag-hovered-swap' : 'drag-hovered-remove'
    }`;
    const castIconClassName = itemData.className?.includes('measure')
      ? 'item-icon'
      : undefined;

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

        <CastIconsFactory iconType={itemData.cast} className={castIconClassName} />

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

  renderVisualizationPlaceholdersOrBlank() {
    const { visualization } = this.props;

    return visualization ? this.renderVisualizationPlaceholders() : null;
  }

  renderDialogWindow() {
    const { sdk, dataset, updates, dimensions } = this.props;
    const {
      dialogType,
      isDialogVisible,
      dialogItem,
      dialogCallBack,
      dialogPlaceholder,
    } = this.state;
    if (!isDialogVisible) {
      return null;
    }
    switch (dialogType) {
      case Dialogs.Column:
        return (
          <DialogFormatTemplate
            item={dialogItem}
            callback={dialogCallBack}
            visible={true}
          />
        );
      case Dialogs.PivotTableDialog:
        return (
          <DialogPivotTable
            item={dialogItem}
            callback={dialogCallBack.bind(this)}
            sdk={sdk}
            fields={dimensions}
            aceModeUrl={dataset.ace_url}
            placeholderType={dialogPlaceholder.type}
          />
        );
      case Dialogs.Filter:
      default:
        return (
          <DialogFilter
            item={dialogItem}
            callback={dialogCallBack}
            dataset={dataset}
            updates={updates}
            sdk={sdk}
            visible={true}
          />
        );
    }
  }

  render() {
    const { visualization } = this.props;

    return (
      <div className="container visualization-container">
        {this.renderDialogWindow()}
        <div className="actions-container visualization-actions-container">
          <VisualizationsList selectedId={visualization?.id} />
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
          <VisualizationsList selectedId={visualization?.id} />
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
  needAutoNumberingRows: selectNeedAutoNumberingRows,
  needSteppedLayout: selectNeedSteppedLayout,
  steppedLayoutIndentation: selectSteppedLayoutIndentation,
  paginateInfo: selectPaginateInfo,
  selectOrderBy: selectOrderBy,
  hasExportTemplateXlsx: selectHasExportTemplateXlsx,
  hasExportTemplateDocx: selectHasExportTemplateDocx,

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
  setNeedSteppedLayout,
  setSteppedLayoutIndentation,
  setNeedAutoNumberingRows,
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionVisualization);
