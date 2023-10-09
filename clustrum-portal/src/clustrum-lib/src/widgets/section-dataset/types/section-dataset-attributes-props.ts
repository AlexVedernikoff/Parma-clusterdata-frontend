import { DndItemData } from '@lib-entities/visualization-factory/types';

export interface SectionDatasetAttributesProps {
  dimensions: DndItemData[];
  measures: DndItemData[];
  filteredMeasures: DndItemData[];
  filteredDimensions: DndItemData[];
  searchPhrase: string;
  onChangeSearchInput(value: string): void;
}
