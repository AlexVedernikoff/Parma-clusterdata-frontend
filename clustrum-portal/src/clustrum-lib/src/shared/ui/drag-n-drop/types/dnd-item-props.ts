import { DndItemInterface } from './dnd-item';

export interface DndItemProps {
  className: string;
  disabled: boolean; //не используется?
  draggingItem: DndItemInterface;
  listAllowedTypes: Set<string>;
  listNoRemove: boolean;
  listId: string;
  index: number;
  item: DndItemInterface;
  listCheckAllowed?: Function; //корни в SectionVisualization
  insert(item: DndItemInterface, index: number, onUndoInsert?: () => void): void;
  move(dragIndex: number, hoverIndex: number): void;
  remove(index: number): void;
  replace(index: number, item: DndItemInterface, onUndoReplace?: () => void, noUpdate?: boolean): void;
  wrapTo(props: DndItemProps, component: JSX.Element): Element;
  setDropPlace(place: any): void;
}
