/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO определить типы
export type SectionDatasetProps = SectionDatasetState &
  SectionDatasetActions & {
    sdk: any;
    entryDialoguesRef: any;
  };

export interface SectionDatasetState {
  isDatasetLoading: boolean;
  isDatasetLoaded: boolean;
  isNavigationVisible: boolean;
  filteredDimensions: any[];
  filteredMeasures: any[];
  fields: any[];
  dataset: any;
  updates: any[];
  datasetError: any;
  measures: any[];
  dimensions: any[];
  defaultPath: string;
}

export interface SectionDatasetActions {
  fetchDataset(params: { datasetId: string; sdk: any }): void;
  toggleNavigation(): void;
  applyTextFilter(params: {
    searchPhrase: string;
    measures: any[];
    dimensions: any[];
  }): void;
  setSearchPhrase(params: { searchPhrase: string }): any;
  updateDatasetByValidation(params: { fields: any; updates: any; sdk: any }): void;
}
