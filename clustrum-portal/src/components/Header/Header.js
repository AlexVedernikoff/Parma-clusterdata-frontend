import React from 'react';
import { Header as ClustrumHeader, Utils } from '@kamatech-data-ui/clustrum';
import { SDK } from '../../modules/sdk';
import { IS_INTERNAL } from '../../modules/constants/constants';
import { $appSettingsStore } from '@shared/app-settings';

function Header() {
  const {
    installationType,
    endpoints,
    user,
    menu,
    features: { toggleTheme },
  } = $appSettingsStore.getState();

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
