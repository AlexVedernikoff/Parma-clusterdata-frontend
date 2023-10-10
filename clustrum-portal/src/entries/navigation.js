import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import moment from 'moment';
import { AppContainer } from 'react-hot-loader';
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
import { $appSettingsStore } from '@shared/app-settings';
import { NotificationContext, useCustomNotification } from '@clustrum-lib';

const sdk = new SDK({
  endpoints: $appSettingsStore.getState().endpoints,
  currentCloudId: $appSettingsStore.getState().currentCloudId,
  currentCloudFolderId: $appSettingsStore.getState().currentCloudFolderId,
});
const store = configureStore();

Utils.setBodyFeatures();

logVersion();

function NavigationEntity() {
  const [openNotification, contextHolder] = useCustomNotification();
  const { ant } = $appSettingsStore.getState().theme;

  return (
    <AppContainer>
      <ConfigProvider theme={{ ...ant }} locale={ruRU}>
        <Provider store={store}>
          <NotificationContext.Provider value={openNotification}>
            {contextHolder}
            <Router>
              <NavigationPage sdk={sdk} />
            </Router>
          </NotificationContext.Provider>
        </Provider>
      </ConfigProvider>
    </AppContainer>
  );
}

function render() {
  ReactDOM.render(<NavigationEntity />, document.getElementById('root'));
}

moment.locale('ru');
render();

if (module.hot) {
  module.hot.accept();
  render();
}
