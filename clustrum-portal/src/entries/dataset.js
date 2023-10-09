import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import moment from 'moment';
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
  NotificationContext,
  useCustomNotification,
} from '@clustrum-lib/shared/lib/notification';
import { $appSettingsStore } from '@shared/app-settings';

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

function DatasetEntry() {
  const [openNotification, contextHolder] = useCustomNotification();
  const { ant } = $appSettingsStore.getState().theme;

  return (
    <AppContainer>
      <ConfigProvider theme={{ ...ant }} locale={ruRU}>
        <Provider store={store}>
          <NotificationContext.Provider value={openNotification}>
            {contextHolder}
            <DatasetRouter sdk={sdk} />
          </NotificationContext.Provider>
        </Provider>
      </ConfigProvider>
    </AppContainer>
  );
}

function render() {
  ReactDOM.render(<DatasetEntry />, document.getElementById('root'));
}

moment.locale('ru');
render();

if (module.hot) {
  module.hot.accept();
  render();
}
