import { MenuProps } from 'antd';
import { ContextMenuActions } from '@shared/lib/constants/context-menu-actions';

export const NAVIGATION_ENTRY_ACTIONS: MenuProps['items'] = [
  {
    key: ContextMenuActions.Rename,
    label: 'Переименовать',
  },
  {
    key: ContextMenuActions.Describe,
    label: 'Описание',
  },
  {
    key: ContextMenuActions.Delete,
    label: 'Удалить',
  },
  {
    key: ContextMenuActions.Move,
    label: 'Переместить',
  },
  {
    key: ContextMenuActions.Copy,
    label: 'Копировать',
  },
  {
    key: ContextMenuActions.CopyLink,
    label: 'Копировать идентификатор',
  },
];
