import { DndItemData } from './dnd-item-data';

export type AllowedTypes = Set<string>;
export type CheckAllowed = (item: DndItemData) => boolean;
