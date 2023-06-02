import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import moment from 'moment';
import configureStore from 'store/configureStore';
import Toaster from '@kamatech-data-ui/common/src/components/Toaster';
import { SDK, Utils } from '@kamatech-data-ui/clustrum';

import ConnectionsRouter from '../components/ConnectionsRouter/ConnectionsRouter';

import './../css/vendors.css';
import './../css/commons.css';
import './../css/connection.css';

import { logVersion } from '../utils/version-logger';
import { ConfigProvider } from 'antd';
import { ANT_TOKEN } from '../constants/constants';

const sdk = new SDK({
  endpoints: window.DL.endpoints,
  currentCloudId: window.DL.currentCloudId,
  currentCloudFolderId: window.DL.currentCloudFolderId,
});

const toaster = new Toaster();

const store = configureStore({
  sdk,
  toaster,
});

Utils.setBodyFeatures();

logVersion();

function render() {
  ReactDOM.render(
    <AppContainer>
      <ConfigProvider theme={{ ...ANT_TOKEN }}>
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
