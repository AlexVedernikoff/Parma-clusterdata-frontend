export interface EditableTabItemProps {
  id: string;
  isEditing?: boolean;
  isDeletable?: boolean;
  title: string;
  onUpdate(id: string, newParams: Record<string, unknown>): void;
  onRemove(id: string): void;
  setEditingTabId(id: string | null): void;
}
