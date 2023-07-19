import { AxiosError } from 'axios';
import { DndItemData } from '@lib-shared/ui/drag-n-drop/types';
import { Wizard } from '@clustrum-lib-legacy';
import { DatasetData } from './dataset-data';

type EntryDialoguesType = typeof Wizard & {
  openDialog(): void;
};

export type SectionDatasetProps = SectionDatasetState &
  SectionDatasetActions & {
    sdk: object;
    entryDialoguesRef: React.RefObject<EntryDialoguesType>;
  };

export interface SectionDatasetState {
  isDatasetLoading: boolean;
  isDatasetLoaded: boolean;
  isNavigationVisible: boolean;
  measures: DndItemData[];
  dimensions: DndItemData[];
  filteredDimensions: DndItemData[];
  filteredMeasures: DndItemData[];
  dataset: DatasetData;
  datasetError: null | AxiosError;
  defaultPath: string;
}

export interface SectionDatasetActions {
  fetchDataset(params: { datasetId: string; sdk: object }): void;
  toggleNavigation(): void;
  applyTextFilter(params: {
    searchPhrase: string;
    measures: DndItemData[];
    dimensions: DndItemData[];
  }): void;
  setSearchPhrase(params: { searchPhrase: string }): void;
}
