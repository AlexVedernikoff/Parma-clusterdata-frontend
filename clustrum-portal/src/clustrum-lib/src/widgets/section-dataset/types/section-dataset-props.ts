import { AxiosError } from 'axios';
import { DndItem } from '@lib-shared/ui/drag-n-drop/types';
import { Wizard } from '@clustrum-lib-legacy';
import { Dataset } from './dataset';

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
  measures: DndItem[];
  dimensions: DndItem[];
  filteredDimensions: DndItem[];
  filteredMeasures: DndItem[];
  dataset: Dataset;
  datasetError: null | AxiosError;
  defaultPath: string;
}

export interface SectionDatasetActions {
  fetchDataset(params: { datasetId: string; sdk: object }): void;
  toggleNavigation(): void;
  applyTextFilter(params: {
    searchPhrase: string;
    measures: DndItem[];
    dimensions: DndItem[];
  }): void;
  setSearchPhrase(params: { searchPhrase: string }): void;
}
