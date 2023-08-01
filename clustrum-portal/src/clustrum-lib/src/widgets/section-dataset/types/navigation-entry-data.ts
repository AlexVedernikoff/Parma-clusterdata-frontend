export enum NavigationScope {
  Folder = 'folder',
  Dataset = 'dataset',
  Dash = 'dash',
  Connection = 'connection',
  Widget = 'widget',
}

interface Permissions {
  admin: boolean;
  edit: boolean;
  execute: boolean;
  permissionId: string;
  read: boolean;
}

export interface NavigationEntryData {
  createdAt: string;
  createdBy: string;
  data: string | null;
  description: string | null;
  entryId: string;
  hidden: boolean;
  isFavorite: boolean;
  isLocked: boolean;
  key: string;
  meta: unknown;
  mirrored: boolean;
  name: string;
  permissions: Permissions;
  admin: boolean;
  edit: boolean;
  execute: boolean;
  permissionId: string;
  read: boolean;
  publishedId: string | null;
  savedId: string;
  scope: NavigationScope;
  templateEntryId: string | null;
  type: string;
  updatedAt: string;
  updatedBy: string;
}
