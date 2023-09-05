import { useSelector } from 'react-redux';
import {
  selectDataset,
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
  selectNeedTotal,
  selectNeedUniqueRows,
  selectNullAlias,
  selectPaginateInfo,
  selectSort,
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
  }));
