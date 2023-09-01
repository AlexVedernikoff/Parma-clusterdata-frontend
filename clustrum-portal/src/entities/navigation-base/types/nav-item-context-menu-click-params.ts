import { NavigationEntryData } from '@clustrum-lib/shared/types';
import { ContextMenuActions } from './context-menu-actions';

export interface NavItemContextMenuClickParams {
  entry: NavigationEntryData;
  action: ContextMenuActions;
}
