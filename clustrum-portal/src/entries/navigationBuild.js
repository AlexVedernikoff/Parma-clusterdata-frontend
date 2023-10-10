import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useUnit } from 'effector-react';
import configureStore from 'store/configureStore';
import { SDK, Utils } from '@kamatech-data-ui/clustrum';

import NavigationPage from '../containers/NavigationPage/NavigationPage';

import './../css/clustrum/colors.css';
import './../css/vendors.css';
import './../css/commons.css';
import './../css/navigation.css';
import './../css/clustrum/styles.css';

import { logVersion } from '../utils/version-logger';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import {
  $appSettingsStore,
  combineDefaultThemeAndPropsTheme,
  setAppSettingsEvent,
} from '@shared/app-settings';
import { setCssVariables } from '@shared/theme';
import { NotificationContext, useCustomNotification } from '@clustrum-lib';

const sdk = new SDK({
  endpoints: $appSettingsStore.getState().endpoints,
  currentCloudId: $appSettingsStore.getState().currentCloudId,
  currentCloudFolderId: $appSettingsStore.getState().currentCloudFolderId,
});
const store = configureStore();

Utils.setBodyFeatures();

logVersion();

export default function NavigationBuild(props) {
  const [setAppSettings] = useUnit([setAppSettingsEvent]);
  const [openNotification, contextHolder] = useCustomNotification();

  const theme = combineDefaultThemeAndPropsTheme(
    props.theme,
    $appSettingsStore.getState().theme,
  );

  setAppSettings({
    hideHeader: props.hideHeader,
    hideSubHeader: props.hideSubHeader,
    enableCaching: props.enableCaching,
    cacheMode: props.cacheMode,
    exportMode: props.exportMode,
    stateUuid: props.stateUuid,
    theme,
  });

  setCssVariables(theme);

  return (
    <ConfigProvider theme={{ ...theme.ant }} locale={ruRU}>
      <Provider store={store}>
        <Router>
          <div className="clustrum">
            <NotificationContext.Provider value={openNotification}>
              {contextHolder}
              <NavigationPage sdk={sdk} />
            </NotificationContext.Provider>
          </div>
        </Router>
      </Provider>
    </ConfigProvider>
  );
}
