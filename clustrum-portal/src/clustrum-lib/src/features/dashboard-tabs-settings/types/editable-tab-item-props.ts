import { Tab } from './tab';

export interface EditableTabItemProps {
  id: string;
  isEditing?: boolean;
  isDeletable?: boolean;
  isRemoved?: boolean;
  title: string;
  onUpdate(id: string, newParams: Partial<Tab>): void;
  setEditingTabId(id: string | null): void;
}
