import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import moment from 'moment';
import configureStore from 'store/configureStore';
import Toaster from '@kamatech-data-ui/common/src/components/Toaster';
import { SDK, Utils } from '@kamatech-data-ui/clustrum';

import ConnectionsRouter from '../components/ConnectionsRouter/ConnectionsRouter';

import './../css/clustrum/colors.css';
import './../css/vendors.css';
import './../css/commons.css';
import './../css/connection.css';
import './../css/clustrum/styles.css';

import { logVersion } from '../utils/version-logger';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { $appSettingsStore } from '@shared/app-settings';

const sdk = new SDK({
  endpoints: $appSettingsStore.getState().endpoints,
  currentCloudId: $appSettingsStore.getState().currentCloudId,
  currentCloudFolderId: $appSettingsStore.getState().currentCloudFolderId,
});

const toaster = new Toaster();

const store = configureStore({
  sdk,
  toaster,
});

Utils.setBodyFeatures();

logVersion();

const { ant } = $appSettingsStore.getState().theme;

function render() {
  ReactDOM.render(
    <AppContainer>
      <ConfigProvider theme={{ token: ant }} locale={ruRU}>
        <Provider store={store}>
          <ConnectionsRouter sdk={sdk} />
        </Provider>
      </ConfigProvider>
    </AppContainer>,
    document.getElementById('root'),
  );
}

moment.locale('ru');
render();

if (module.hot) {
  module.hot.accept();
  render();
}
