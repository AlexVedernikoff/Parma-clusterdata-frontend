import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
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
import { replaceIframeParams } from '@shared/lib/utils/replace-iframe-params';

const sdk = new SDK({
  endpoints: window.DL.endpoints,
  currentCloudId: window.DL.currentCloudId,
  currentCloudFolderId: window.DL.currentCloudFolderId,
});
const store = configureStore();

Utils.setBodyFeatures();

logVersion();

export function NavigationBuild(props) {
  const { iframeParams } = props;
  replaceIframeParams(iframeParams);

  return (
    <ConfigProvider theme={{ ...ANT_TOKEN }} locale={ruRU}>
      <Provider store={store}>
        <Router>
          <NavigationPage sdk={sdk} />
        </Router>
      </Provider>
    </ConfigProvider>
  );
}
