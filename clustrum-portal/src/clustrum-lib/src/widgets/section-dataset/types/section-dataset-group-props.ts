import { DndItemData } from '@lib-entities/visualization-factory/types';

export interface SectionDatasetGroupProps {
  id: string;
  title: string;
  datasetNames: string[];
  indicators: DndItemData[];
}
