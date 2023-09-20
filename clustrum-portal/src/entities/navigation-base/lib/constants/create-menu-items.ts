import { MenuItemType } from 'antd/es/menu/hooks/useItems';
import { CreateMenuActionType } from '../../../../entities/navigation-base/types/create-menu-action-type';

export const CREATE_MENU_ITEMS: MenuItemType[] = [
  {
    key: CreateMenuActionType.Folder,
    label: 'Папку',
  },
  { key: CreateMenuActionType.Connection, label: 'Соединение' },
  { key: CreateMenuActionType.Dataset, label: 'Набор данных' },
  { key: CreateMenuActionType.Widget, label: 'Диаграмму' },
  { key: CreateMenuActionType.Dashboard, label: 'Аналитическую панель' },
];
