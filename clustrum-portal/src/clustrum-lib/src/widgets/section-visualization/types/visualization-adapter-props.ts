import { DndItemType } from '@lib-entities/visualization-factory/types';
import { DndItemProps } from '@lib-shared/ui/drag-n-drop/types';
import { VisualizationItem } from '@lib-features/visualizations-list/types';

export interface VisualizationAdapterProps {
  visualization: VisualizationItem;
  renderItem(
    props: DndItemProps<DndItemType>,
    component: HTMLDivElement | null,
  ): JSX.Element;
  setFilterDialog(item: DndItemType, items?: DndItemType[]): void;
}
