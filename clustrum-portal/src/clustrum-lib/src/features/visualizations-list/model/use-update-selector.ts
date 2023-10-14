import { useSelector } from 'react-redux';
import {
  selectDataset,
  selectDatasetError,
  selectDimensions,
  selectMeasures,
  selectUpdates,
} from '../../../../../reducers/dataset';
import {
  selectClusterPrecision,
  selectColors,
  selectCoordType,
  selectDiagramMagnitude,
  selectExportLimit,
  selectFilters,
  selectMapLayerOpacity,
  selectNeedAutoNumberingRows,
  selectNeedSteppedLayout,
  selectNeedTotal,
  selectNeedUniqueRows,
  selectNullAlias,
  selectPaginateInfo,
  selectSort,
  selectSteppedLayoutIndentation,
  selectTitleLayerSource,
  selectVisualization,
} from '../../../../../reducers/visualization';
import { UpdateArgs } from '../types';

export const useUpdateViewSelector = (): UpdateArgs =>
  useSelector(state => ({
    exportLimit: selectExportLimit(state),
    clusterPrecision: selectClusterPrecision(state),
    diagramMagnitude: selectDiagramMagnitude(state),
    dataset: selectDataset(state),
    dimensions: selectDimensions(state),
    needTotal: selectNeedTotal(state),
    needUniqueRows: selectNeedUniqueRows(state),
    measures: selectMeasures(state),
    nullAlias: selectNullAlias(state),
    visualization: selectVisualization(state),
    filters: selectFilters(state),
    colors: selectColors(state),
    sort: selectSort(state),
    paginateInfo: selectPaginateInfo(state),
    titleLayerSource: selectTitleLayerSource(state),
    updates: selectUpdates(state),
    coordType: selectCoordType(state),
    datasetError: selectDatasetError(state),
    needSteppedLayout: selectNeedSteppedLayout(state),
    needAutoNumberingRows: selectNeedAutoNumberingRows(state),
    steppedLayoutIndentation: selectSteppedLayoutIndentation(state),
    mapLayerOpacity: selectMapLayerOpacity(state),
  }));
