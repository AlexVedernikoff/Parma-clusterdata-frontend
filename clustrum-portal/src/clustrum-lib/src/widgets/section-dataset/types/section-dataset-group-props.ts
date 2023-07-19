import { DndItemData } from '@lib-shared/ui/drag-n-drop/types';

export interface SectionDatasetGroupProps {
  id: string;
  title: string;
  datasetNames: string[];
  indicators: DndItemData[];
}
