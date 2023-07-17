/* eslint-disable @typescript-eslint/no-explicit-any */
import { DndItemProps } from '@lib-shared/ui/drag-n-drop/types';

export interface SectionDatasetGroupProps {
  id: string;
  title: string;
  datasetNames: string[];
  // TODO определить тип
  indicators: any[];
  renderDatasetItem(props: DndItemProps, component: HTMLDivElement | null): Element;
}
