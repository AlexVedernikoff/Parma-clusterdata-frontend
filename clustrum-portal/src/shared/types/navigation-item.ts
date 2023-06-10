import { NavigationScope } from '../lib/constants/navigation-scope';

export interface NavigationItem {
  createdAt: string;
  createdBy: string;
  data: string | null;
  description: string | null;
  entryId: string;
  hidden: boolean;
  isFavorite: boolean;
  isLocked: boolean;
  key: string;
  meta: any;
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

interface Permissions {
  admin: boolean;
  edit: boolean;
  execute: boolean;
  permissionId: string;
  read: boolean;
}
