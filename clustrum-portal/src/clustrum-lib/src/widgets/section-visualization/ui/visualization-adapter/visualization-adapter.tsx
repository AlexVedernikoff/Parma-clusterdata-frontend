import React from 'react';
import { FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import {
  DndItemType,
  VisualizationFactoryProps,
  VisualizationType,
} from '@lib-entities/visualization-factory/types';
import { useUpdateViewSelector } from '@lib-features/visualizations-list';
import { useDispatch } from 'react-redux';
import { DndItemData } from '@lib-entities/visualization-factory/types';
import { VisualizationFactory } from '@lib-entities/visualization-factory';
import { VisualizationAdapterProps } from '../../types';
import { updatePreviewShort } from '../../model/update-preview-short';
import { WIZARD_ITEM_TYPES } from '@lib-shared/config/wizard-item-types';
import {
  setClusterPrecision,
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
  setSort,
  setTitleLayerSource,
} from '../../../../../../actions';
import {
  COORD_ITEMS,
  DIAGRAM_MAGNITUDE_ITEMS,
  NULL_ALIAS_ITEMS,
  STEPPED_LAYOUT_INDENTATION_MAX_VALUE,
} from '../../lib/constants';

export function VisualizationAdapter(props: VisualizationAdapterProps): JSX.Element {
  const { visualization, renderItem, setFilterDialog } = props;
  const dispatch = useDispatch();
  const params = useUpdateViewSelector();

  const visualizationConfig: VisualizationFactoryProps[] = [];
  if (visualization.allowFilters) {
    visualizationConfig.push({
      title: 'Фильтры',
      icon: <FilterOutlined width="16" height="16" />,
      type: VisualizationType.DndContainer,
      containerProps: {
        id: 'filter-container',
        isNeedRemove: true,
        highlightDropPlace: true,
        items: [...params.filters],
        allowedTypes: WIZARD_ITEM_TYPES.ALL,
        itemsClassName: 'placeholder-item',
        wrapTo: renderItem,
        disabled: params.datasetError,
        onItemClick: (e: Event, item: DndItemData) => setFilterDialog(item),
        onUpdate: (items: DndItemData[], item: DndItemData, action: string) => {
          if (action === 'remove') {
            dispatch(setFilters({ filters: items }));
            updatePreviewShort(params, dispatch, 'filters', items);
          } else if (action === 'insert' && item) {
            setFilterDialog(item, items);
          } else {
            if (item?.filter) {
              dispatch(setFilters({ filters: items }));
              updatePreviewShort(params, dispatch, 'filters', items);
            } else if (item) {
              setFilterDialog(item, items);
            }
          }
        },
      },
    });
  }
  // Скрыто по просьбе аналитика Кластрум
  // if (visualization.allowColors) {
  //     visualizationConfig.push({
  //         title: "Цвета",
  //         icon: <BgColorsOutlined width="16" height="16" />,
  //         type: VisualizationType.DndContainer,
  //         containerProps: {
  //             id: "colors-container",
  //             isNeedRemove: true,
  //             isNeedSwap: true,
  //             highlightDropPlace: true,
  //             items: params.colors,
  //             capacity: visualization.colorsCapacity || 1,
  //             checkAllowed: item => {
  //                 return visualization.checkAllowedColors(item, visualization);
  //             },
  //             itemsClassName="placeholder-item",
  //             wrapTo: renderItem,
  //             disabled: params.datasetError
  //         }
  //     })
  // }
  if (visualization.allowSort) {
    visualizationConfig.push({
      title: 'Сортировка',
      icon: <SortAscendingOutlined width="16" height="16" />,
      type: VisualizationType.DndContainer,
      containerProps: {
        id: 'sort-container',
        isNeedRemove: true,
        isNeedSwap: true,
        highlightDropPlace: true,
        items: params.sort as DndItemData[],
        capacity: 10,
        checkAllowed: (item: DndItemType) => {
          return visualization.checkAllowedSort(item, visualization, params.colors);
        },
        itemsClassName: 'placeholder-item sort-item',
        wrapTo: renderItem,
        disabled: params.datasetError,
        onItemClick: (e: Event, item: DndItemData) => {
          item.direction = item.direction === 'ASC' ? 'DESC' : 'ASC';
          dispatch(setSort({ sort: params.sort }));
          updatePreviewShort(params, dispatch);
        },
        onUpdate: items => {
          dispatch(setSort({ sort: items }));
          updatePreviewShort(params, dispatch, 'sort', items);
        },
      },
    });
  }
  if (visualization.allowCoordType) {
    visualizationConfig.push({
      title: 'Система координат',
      type: VisualizationType.Select,
      className: 'subitem',
      containerProps: {
        options: COORD_ITEMS,
        value: params.coordType,
        onChange: (newValue: string) => {
          dispatch(setCoordType({ coordType: newValue }));
          updatePreviewShort(params, dispatch, 'coordType', newValue);
        },
      },
    });
  }
  if (visualization.allowTitleLayerSource) {
    visualizationConfig.push({
      title: 'Адрес топосновы',
      type: VisualizationType.TextInput,
      className: 'subitem',
      containerProps: {
        value: params.titleLayerSource,
        type: 'text',
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch(
            setTitleLayerSource({
              titleLayerSource: e.target.value,
            }),
          );
        },
        onBlur: (e: React.ChangeEvent<HTMLInputElement>) => {
          updatePreviewShort(params, dispatch, 'titleLayerSource', e.target.value);
        },
      },
    });
  }
  if (visualization.allowClusterPrecision) {
    visualizationConfig.push({
      title: 'Точность кластера',
      type: VisualizationType.TextInput,
      className: 'subitem',
      containerProps: {
        value: params.clusterPrecision,
        type: 'text',
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch(
            setClusterPrecision({
              clusterPrecision: e.target.value,
            }),
          );
        },
        onBlur: (e: React.ChangeEvent<HTMLInputElement>) => {
          updatePreviewShort(params, dispatch, 'clusterPrecision', e.target.value);
        },
      },
    });
  }
  if (visualization.allowNullAlias) {
    visualizationConfig.push({
      title: 'Подпись для пустых данных',
      type: VisualizationType.Select,
      className: 'subitem',
      containerProps: {
        options: NULL_ALIAS_ITEMS,
        value: params.nullAlias,
        onChange: (newValue: string) => {
          dispatch(setNullAlias({ nullAlias: newValue }));
          updatePreviewShort(params, dispatch, 'nullAlias', newValue);
        },
      },
    });
  }
  if (visualization.allowUniqueRows) {
    visualizationConfig.push({
      title: 'Строки',
      type: VisualizationType.CheckBox,
      className: 'subitem',
      containerContent: <span>Показывать только уникальные строки</span>,
      containerProps: {
        checked: params.needUniqueRows,
        onChange: () => {
          dispatch(setNeedUniqueRows({ needUniqueRows: !params.needUniqueRows }));
          updatePreviewShort(params, dispatch, 'needUniqueRows', !params.needUniqueRows);
        },
      },
    });
  }
  if (visualization.allowTotal) {
    visualizationConfig.push({
      title: 'Строка итоговых значений',
      type: VisualizationType.CheckBox,
      className: 'subitem',
      containerContent: <span>Показывать строку итоговых значений</span>,
      containerProps: {
        checked: params.needTotal,
        onChange: () => {
          dispatch(setNeedTotal({ needTotal: !params.needTotal }));
          updatePreviewShort(params, dispatch, 'needTotal', !params.needTotal);
        },
      },
    });
  }
  if (visualization.allowSteppedLayout) {
    visualizationConfig.push({
      title: 'Ступенчатый макет',
      type: VisualizationType.CheckBox,
      className: 'subitem',
      containerContent: <span>Ступенчатый макет таблицы</span>,
      containerProps: {
        checked: params.needSteppedLayout,
        onChange: () => {
          dispatch(
            setNeedSteppedLayout({ needSteppedLayout: !params.needSteppedLayout }),
          );
          updatePreviewShort(
            params,
            dispatch,
            'needSteppedLayout',
            !params.needSteppedLayout,
          );
        },
      },
    });
  }
  if (visualization.allowSteppedLayout && params.needSteppedLayout) {
    visualizationConfig.push({
      title: 'Макет с пошаговым отступом',
      type: VisualizationType.Slider,
      className: 'subitem',
      containerProps: {
        max: STEPPED_LAYOUT_INDENTATION_MAX_VALUE,
        value: params.steppedLayoutIndentation,
        onChange: (steppedLayoutIndentation: number) => {
          dispatch(setSteppedLayoutIndentation({ steppedLayoutIndentation }));
          updatePreviewShort(params, dispatch);
        },
      },
    });
  }
  if (visualization.allowAutoNumberingRows) {
    visualizationConfig.push({
      title: 'Автонумерация',
      type: VisualizationType.CheckBox,
      className: 'subitem',
      containerContent: <span>Автонумерация строк</span>,
      containerProps: {
        checked: params.needAutoNumberingRows,
        onChange: () => {
          dispatch(
            setNeedAutoNumberingRows({
              needAutoNumberingRows: !params.needAutoNumberingRows,
            }),
          );
          updatePreviewShort(
            params,
            dispatch,
            'needAutoNumberingRows',
            !params.needAutoNumberingRows,
          );
        },
      },
    });
  }
  if (visualization.allowDiagramMagnitude) {
    visualizationConfig.push({
      title: 'Единицы измерения диаграммы',
      type: VisualizationType.Select,
      className: 'subitem',
      containerProps: {
        options: DIAGRAM_MAGNITUDE_ITEMS,
        value: params.diagramMagnitude,
        onChange: (newValue: string) => {
          dispatch(setDiagramMagnitude({ diagramMagnitude: newValue }));
          updatePreviewShort(params, dispatch, 'diagramMagnitude', newValue);
        },
      },
    });
  }
  if (visualization.allowMapLayerOpacity) {
    visualizationConfig.push({
      title: 'Прозрачность карты',
      type: VisualizationType.Slider,
      className: 'subitem',
      containerProps: {
        value: params.mapLayerOpacity,
        min: 0,
        max: 100,
        onChange: (value: number) => {
          dispatch(setMapLayerOpacity({ mapLayerOpacity: value }));
          updatePreviewShort(params, dispatch, 'mapLayerOpacity', value);
        },
      },
    });
  }

  visualizationConfig.push({
    title: 'Лимит экспортируемых записей',
    type: VisualizationType.NumberInput,
    className: 'subitem',
    containerProps: {
      value: params.exportLimit,
      controls: true,
      onChange: (newValue: number) => {
        dispatch(setExportLimit({ exportLimit: newValue }));
        updatePreviewShort(params, dispatch, 'exportLimit', newValue);
      },
      onBlur: (e: React.ChangeEvent<HTMLInputElement>) => {
        updatePreviewShort(params, dispatch, 'exportLimit', e.target.value);
      },
    },
  });

  return (
    <React.Fragment>
      {visualizationConfig.map((item, index) => {
        return <VisualizationFactory key={index} {...item} />;
      })}
    </React.Fragment>
  );
}
