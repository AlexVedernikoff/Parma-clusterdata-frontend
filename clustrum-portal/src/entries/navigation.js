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
import { ANT_TOKEN } from '@shared/config/theme';
import { $appSettingsStore } from '@entities/app-settings';
import { NotificationContext } from '@entities/notification';
import { useCustomNotification } from '@shared/lib/hooks';

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

  return (
    <AppContainer>
      <ConfigProvider theme={{ ...ANT_TOKEN }} locale={ruRU}>
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
