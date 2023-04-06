import React from 'react';
import { Header as ClusterDataHeader, Utils } from '@kamatech-data-ui/clusterdata';
import { SDK } from '../../modules/sdk';
import { IS_INTERNAL } from '../../modules/constants/constants';

function Header() {
  const { DL: { installationType, endpoints, user, menu, features: { toggleTheme } } = {} } = window;

  return (
    <ClusterDataHeader
      installationType={installationType}
      endpoints={endpoints}
      userData={{
        ...user,
        yu: Utils.getCookie('parmauid'),
      }}
      toggleTheme={toggleTheme}
      menuData={menu}
      logoText={IS_INTERNAL ? 'Dash' : 'ClusterData'}
      sdk={SDK}
    />
  );
}

export default Header;
