import { MenuProps } from 'antd';
import { ContextMenuActions } from '../../../../shared/lib/constants/context-menu-actions';

export const NAVIGATION_ENTRY_ACTIONS: MenuProps['items'] = [
  {
    key: ContextMenuActions.rename,
    label: 'Переименовать',
  },
  {
    key: ContextMenuActions.describe,
    label: 'Описание',
  },
  {
    key: ContextMenuActions.delete,
    label: 'Удалить',
  },
  {
    key: ContextMenuActions.move,
    label: 'Переместить',
  },
  {
    key: ContextMenuActions.copy,
    label: 'Копировать',
  },
  {
    key: ContextMenuActions.copyLink,
    label: 'Копировать идентификатор',
  },
];
