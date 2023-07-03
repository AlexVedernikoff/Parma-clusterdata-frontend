import { PLACE, QUICK_ITEMS } from '../constants';
import memoize from 'lodash/memoize';
// import './NavigationBase.scss';
import block from 'bem-cn-lite';

import iconFolder from '../../../icons/sidebar-folder.svg';
import iconFavorites from '../../../icons/mono-favorite.svg';
import iconDashboard from '../../../icons/mono-dashboard.svg';
import iconDataset from '../../../icons/mono-dataset.svg';
import iconWidget from '../../../icons/mono-widget.svg';
import iconConnection from '../../../icons/mono-connection.svg';
import iconScopeFolder from '@kamatech-data-ui/common/src/assets/icons/scope-folder.svg';
import iconFilesDashboard from '../../../icons/files-dashboard.svg';
import iconFilesWidget from '../../../icons/files-widget.svg';
import iconLegacyWizard from '../../../icons/legacy-wizard.svg';
import iconScript from '../../../icons/script.svg';
import iconFilesDataset from '../../../icons/files-dataset.svg';

const b = block('dl-navigation-base');

export const getPlaceParameters = memoize(place => {
  const placesParameters = [
    {
      place: PLACE.ORIGIN_ROOT,
      icon: iconFolder,
      text: 'Все объекты',
      pagination: false,
      displayParentFolder: false,
      sort: true,
      filters: false,
    },
    {
      place: PLACE.FAVORITES,
      icon: iconFavorites,
      text: 'Избранное',
      pagination: false,
      displayParentFolder: true,
      sort: true,
      filters: false,
      iconClassName: b('sidebar-icon-favorites'),
    },
    {
      place: PLACE.CONNECTIONS,
      icon: iconConnection,
      text: 'Подключения',
      pagination: true,
      displayParentFolder: true,
      sort: false,
      filters: true,
      iconClassName: b('sidebar-icon-connections'),
    },
    {
      place: PLACE.DATASETS,
      icon: iconDataset,
      text: 'Наборы данных',
      pagination: true,
      displayParentFolder: true,
      sort: false,
      filters: true,
      iconClassName: b('sidebar-icon-datasets'),
    },
    {
      place: PLACE.WIDGETS,
      icon: iconWidget,
      text: 'Элементы аналитической панели',
      pagination: true,
      displayParentFolder: true,
      sort: false,
      filters: true,
      iconClassName: b('sidebar-icon-widgets'),
    },
    {
      place: PLACE.DASHBOARDS,
      icon: iconDashboard,
      text: 'Аналитические панели',
      pagination: true,
      displayParentFolder: true,
      sort: false,
      filters: true,
      iconClassName: b('sidebar-icon-dashboards'),
    },
  ];

  return place ? placesParameters.find(param => param.place === place) : placesParameters;
});

export const getQuickItems = memoize(() => [
  {
    icon: iconFolder,
    text: 'Личная папка',
    scope: 'folder',
    key: QUICK_ITEMS.USER_FOLDER,
  },
]);

export const getCreateMenuItemsInternal = memoize(() => [
  {
    value: 'folder',
    icon: iconScopeFolder,
    text: 'Папку',
  },
  {
    value: 'script',
    icon: iconScript,
    text: 'Editor',
  },
  {
    value: 'widget',
    icon: iconFilesWidget,
    text: 'Wizard',
  },
  {
    value: 'legacyWizard',
    icon: iconLegacyWizard,
    text: 'Wizard (old)',
  },
  {
    value: 'dashboard',
    icon: iconFilesDashboard,
    text: 'Dashboard',
  },
  {
    value: 'connection',
    icon: iconConnection,
    text: 'Connection',
  },
  {
    value: 'dataset',
    icon: iconFilesDataset,
    text: 'Dataset',
  },
]);

export const getCreateMenuItemsExternal = memoize(() => [
  {
    value: 'folder',
    icon: iconScopeFolder,
    text: 'Папку',
  },
  {
    value: 'connection',
    icon: iconConnection,
    text: 'Подключение',
  },
  {
    value: 'dataset',
    icon: iconFilesDataset,
    text: 'Набор данных',
  },
  {
    value: 'widget',
    icon: iconFilesWidget,
    text: 'Диаграмму',
  },
  {
    value: 'dashboard',
    icon: iconFilesDashboard,
    text: 'Аналитическую панель',
  },
]);
