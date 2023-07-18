import { AxiosError } from 'axios';
import { DndItem } from '@lib-shared/ui/drag-n-drop/types';

export interface SectionDatasetMainProps {
  filteredMeasures: DndItem[];
  filteredDimensions: DndItem[];
  searchPhrase: string;
  dimensions: DndItem[];
  measures: DndItem[];
  isDatasetLoading: boolean;
  isDatasetLoaded: boolean;
  datasetError: null | AxiosError;
  onRequestDatasetRights(): void;
  onLoadDatasetAgain(): void;
  onChangeSearchInputField(value: string): void;
}
