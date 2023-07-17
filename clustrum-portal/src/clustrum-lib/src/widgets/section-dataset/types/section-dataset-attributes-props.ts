/* eslint-disable @typescript-eslint/no-explicit-any */
import { DndItemProps } from '@lib-shared/ui/drag-n-drop/types';

// TODO определить типы
export interface SectionDatasetAttributesProps {
  filteredMeasures: any[];
  filteredDimensions: any[];
  searchPhrase: string;
  dimensions: any[];
  measures: any[];
  onChangeSearchInputField(value: string): void;
  renderDatasetItem(props: DndItemProps, component: HTMLDivElement | null): Element;
}
