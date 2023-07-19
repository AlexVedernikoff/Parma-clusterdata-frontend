export interface NavigationEntryData {
  entryId: string;
  key: string;
  scope: string;
  type: string;
  // TODO определить тип
  data: null;
  // TODO определить тип
  meta: object;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  savedId: string;
  publishedId: null | string;
  hidden: boolean;
  mirrored: boolean;
  isFavorite: boolean;
  isLocked: boolean;
  permissions: {
    permissionId: string;
    execute: boolean;
    read: boolean;
    edit: boolean;
    admin: boolean;
  };
  name: string;
  templateEntryId: null | string;
  description: null | string;
}
