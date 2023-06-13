import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import moment from 'moment';
import { AppContainer } from 'react-hot-loader';
import configureStore from 'store/configureStore';
import { SDK, Utils } from '@kamatech-data-ui/clustrum';

import NavigationPage from '../containers/NavigationPage/NavigationPage';

import './../css/vendors.css';
import './../css/commons.css';
import './../css/navigation.css';

import { logVersion } from '../utils/version-logger';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { ANT_TOKEN } from '../constants/constants';

const sdk = new SDK({
  endpoints: window.DL.endpoints,
  currentCloudId: window.DL.currentCloudId,
  currentCloudFolderId: window.DL.currentCloudFolderId,
});
const store = configureStore();

Utils.setBodyFeatures();

logVersion();

function render() {
  ReactDOM.render(
    <AppContainer>
      <ConfigProvider theme={{ ...ANT_TOKEN }} locale={ruRU}>
        <Provider store={store}>
          <Router>
            <NavigationPage sdk={sdk} />
          </Router>
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
