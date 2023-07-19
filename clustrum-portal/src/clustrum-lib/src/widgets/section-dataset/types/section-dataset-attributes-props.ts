import { DndItemData } from '@lib-shared/ui/drag-n-drop/types';

export interface SectionDatasetAttributesProps {
  dimensions: DndItemData[];
  measures: DndItemData[];
  filteredMeasures: DndItemData[];
  filteredDimensions: DndItemData[];
  searchPhrase: string;
  onChangeSearchInputField(value: string): void;
}
