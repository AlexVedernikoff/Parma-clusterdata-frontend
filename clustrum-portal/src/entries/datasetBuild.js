import React from 'react';
import { Provider } from 'react-redux';
import { useUnit } from 'effector-react';
import configureStore from 'store/configureStore';
import { SDK, Utils } from '@kamatech-data-ui/clustrum';

import DatasetRouter from '../components/DatasetRouter/DatasetRouter';

import './../css/clustrum/colors.css';
import './../css/vendors.css';
import './../css/commons.css';
import './../css/dataset.css';
import './../css/clustrum/styles.css';

import { logVersion } from '../utils/version-logger';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import {
  $appSettingsStore,
  combineDefaultThemeAndPropsTheme,
  setAppSettingsEvent,
} from '@shared/app-settings';
import { NotificationContext, useCustomNotification } from '@clustrum-lib';
import { setCssVariables } from '@shared/theme';

const sdk = new SDK({
  endpoints: $appSettingsStore.getState().endpoints,
  currentCloudId: $appSettingsStore.getState().currentCloudId,
  currentCloudFolderId: $appSettingsStore.getState().currentCloudFolderId,
});

const store = configureStore({
  sdk,
});

Utils.setBodyFeatures();

logVersion();

export default function DatasetBuild(props) {
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
    <ConfigProvider theme={{ ...ant }} locale={ruRU}>
      <Provider store={store}>
        <div className="clustrum">
          <NotificationContext.Provider value={openNotification}>
            {contextHolder}
            <DatasetRouter sdk={sdk} {...props} />
          </NotificationContext.Provider>
        </div>
      </Provider>
    </ConfigProvider>
  );
}
