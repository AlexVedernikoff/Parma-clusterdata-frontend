import { MenuItemType } from 'antd/es/menu/hooks/useItems';
import { CreateMenuActionType } from './create-menu-action-type';

export const CREATE_MENU_ITEMS: MenuItemType[] = [
  {
    key: CreateMenuActionType.folder,
    label: 'Папку',
  },
  { key: CreateMenuActionType.connection, label: 'Соединение' },
  { key: CreateMenuActionType.dataset, label: 'Набор данных' },
  { key: CreateMenuActionType.widget, label: 'Диаграмму' },
  { key: CreateMenuActionType.dashboard, label: 'Аналитическую панель' },
];
