import { AxiosError } from 'axios';
import { DndItemData } from '@lib-shared/ui/drag-n-drop/types';

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
  onChangeSearchInputField(value: string): void;
}
