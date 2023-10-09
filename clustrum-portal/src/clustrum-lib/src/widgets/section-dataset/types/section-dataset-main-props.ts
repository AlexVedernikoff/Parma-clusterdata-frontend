import { AxiosError } from 'axios';
import { DndItemData } from '@lib-entities/visualization-factory/types';

export interface SectionDatasetMainProps {
  filteredMeasures: DndItemData[];
  filteredDimensions: DndItemData[];
  searchPhrase: string;
  dimensions: DndItemData[];
  measures: DndItemData[];
  isDatasetLoading: boolean;
  isDatasetLoaded: boolean;
  datasetError: AxiosError | null;
  onRequestDatasetRights(): void;
  onLoadDatasetAgain(): void;
  onChangeSearchInput(value: string): void;
}
