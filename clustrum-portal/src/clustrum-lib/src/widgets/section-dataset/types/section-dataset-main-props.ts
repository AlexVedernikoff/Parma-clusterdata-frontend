/* eslint-disable @typescript-eslint/no-explicit-any */
import { DndItemProps } from '@lib-shared/ui/drag-n-drop/types';

// TODO определить тип
export interface SectionDatasetMainProps {
  filteredMeasures: any[];
  filteredDimensions: any[];
  searchPhrase: string;
  dimensions: any[];
  measures: any[];

  isDatasetLoading: boolean;
  isDatasetLoaded: boolean;
  datasetError: any;
  onRequestDatasetRights(): void;
  onLoadDatasetAgain(): void;

  onChangeSearchInputField(value: string): void;
  renderDatasetItem(props: DndItemProps, component: HTMLDivElement | null): Element;
}
