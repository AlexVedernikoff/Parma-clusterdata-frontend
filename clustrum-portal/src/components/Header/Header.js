import React from 'react';
import { Header as ClustrumHeader, Utils } from '@kamatech-data-ui/clustrum';
import { SDK } from '../../modules/sdk';
import { IS_INTERNAL } from '../../modules/constants/constants';

function Header() {
  const {
    DL: { installationType, endpoints, user, menu, features: { toggleTheme } } = {},
  } = window;

  return (
    <ClustrumHeader
      installationType={installationType}
      endpoints={endpoints}
      userData={{
        ...user,
        yu: Utils.getCookie('parmauid'),
      }}
      toggleTheme={toggleTheme}
      menuData={menu}
      logoText={IS_INTERNAL ? 'Dash' : 'Clustrum'}
      sdk={SDK}
    />
  );
}

export default Header;
