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
import iconScopeFolder from '@parma-data-ui/common/src/assets/icons/scope-folder.svg';
import iconFilesDashboard from '../../../icons/files-dashboard.svg';
import iconFilesWidget from '../../../icons/files-widget.svg';
import iconLegacyWizard from '../../../icons/legacy-wizard.svg';
import iconScript from '../../../icons/script.svg';
import iconFilesDataset from '../../../icons/files-dataset.svg';

import { I18n } from '../../../utils/i18n';
const i18n = I18n.keyset('component.navigation.view');
const b = block('dl-navigation-base');

export const getPlaceParameters = memoize(place => {
  const placesParameters = [
    {
      place: PLACE.ORIGIN_ROOT,
      icon: iconFolder,
      text: i18n('switch_root'),
      pagination: false,
      displayParentFolder: false,
      sort: true,
      filters: false,
    },
    {
      place: PLACE.FAVORITES,
      icon: iconFavorites,
      text: i18n('switch_favorites'),
      pagination: false,
      displayParentFolder: true,
      sort: true,
      filters: false,
      iconClassName: b('sidebar-icon-favorites'),
    },
    {
      place: PLACE.CONNECTIONS,
      icon: iconConnection,
      text: i18n('switch_connections'),
      pagination: true,
      displayParentFolder: true,
      sort: false,
      filters: true,
      iconClassName: b('sidebar-icon-connections'),
    },
    {
      place: PLACE.DATASETS,
      icon: iconDataset,
      text: i18n('switch_datasets'),
      pagination: true,
      displayParentFolder: true,
      sort: false,
      filters: true,
      iconClassName: b('sidebar-icon-datasets'),
    },
    {
      place: PLACE.WIDGETS,
      icon: iconWidget,
      text: i18n('switch_widgets'),
      pagination: true,
      displayParentFolder: true,
      sort: false,
      filters: true,
      iconClassName: b('sidebar-icon-widgets'),
    },
    {
      place: PLACE.DASHBOARDS,
      icon: iconDashboard,
      text: i18n('switch_dashboards'),
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
    text: i18n('switch_personal-folder'),
    scope: 'folder',
    key: QUICK_ITEMS.USER_FOLDER,
  },
]);

export const getCreateMenuItemsInternal = memoize(() => [
  {
    value: 'folder',
    icon: iconScopeFolder,
    text: i18n('value_create-folder'),
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
    text: i18n('value_create-folder'),
  },
  {
    value: 'connection',
    icon: iconConnection,
    text: i18n('value_create-connection'),
  },
  {
    value: 'dataset',
    icon: iconFilesDataset,
    text: i18n('value_create-dataset'),
  },
  {
    value: 'widget',
    icon: iconFilesWidget,
    text: i18n('value_create-widget'),
  },
  {
    value: 'dashboard',
    icon: iconFilesDashboard,
    text: i18n('value_create-dashboard'),
  },
]);
