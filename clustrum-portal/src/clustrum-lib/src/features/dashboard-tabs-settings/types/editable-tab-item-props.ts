import { Tab } from './tab';

export interface EditableTabItemProps {
  id: string;
  isEditing?: boolean;
  isDeletable?: boolean;
  title: string;
  onUpdate(id: string, newParams: Partial<Tab>): void;
  onRemove(id: string): void;
  setEditingTabId(id: string | null): void;
}
