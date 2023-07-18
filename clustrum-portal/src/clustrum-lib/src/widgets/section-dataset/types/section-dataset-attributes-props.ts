import { DndItem } from '@lib-shared/ui/drag-n-drop/types';

export interface SectionDatasetAttributesProps {
  dimensions: DndItem[];
  measures: DndItem[];
  filteredMeasures: DndItem[];
  filteredDimensions: DndItem[];
  searchPhrase: string;
  onChangeSearchInputField(value: string): void;
}
