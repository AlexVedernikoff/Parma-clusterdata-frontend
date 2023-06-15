import React from 'react';
import PropTypes from 'prop-types';
import { DL } from '../../constants/common';
import block from 'bem-cn-lite';

import iconFolder from 'icons/sidebar-folder.svg';
import iconFavorites from 'icons/mono-favorite.svg';
import iconDashboard from 'icons/mono-dashboard.svg';
import iconDataset from 'icons/mono-dataset.svg';
import iconWidget from 'icons/mono-widget.svg';
import iconConnection from 'icons/mono-connection.svg';

const b = block('dl-header');

const mapIcons = {
  folder: {
    icon: iconFolder,
  },
  favorites: {
    icon: iconFavorites,
    iconClassName: b('icon-favorites'),
  },
  connections: {
    icon: iconConnection,
    iconClassName: b('icon-connections'),
  },
  datasets: {
    icon: iconDataset,
    iconClassName: b('icon-datasets'),
  },
  widgets: {
    icon: iconWidget,
    iconClassName: b('icon-widgets'),
  },
  dashboards: {
    icon: iconDashboard,
    iconClassName: b('icon-dashboards'),
  },
};

const getShapedMenuData = menuData => {
  return {
    ...menuData,
    groups: menuData.groups.map(group => {
      return {
        ...group,
        items: group.items.map(item => {
          const iconData = mapIcons[item.icon];
          return {
            ...item,
            icon: iconData ? iconData.icon : undefined,
            iconClassName:
              iconData && iconData.iconClassName ? iconData.iconClassName : undefined,
          };
        }),
      };
    }),
  };
};

const withPreparedMenu = Component => {
  function WithPreparedMenu(props) {
    return (
      <Component
        {...props}
        menuData={DL.IS_INTERNAL ? props.menuData : getShapedMenuData(props.menuData)}
      />
    );
  }

  WithPreparedMenu.propTypes = {
    menuData: PropTypes.object.isRequired,
  };

  return WithPreparedMenu;
};

export default withPreparedMenu;
