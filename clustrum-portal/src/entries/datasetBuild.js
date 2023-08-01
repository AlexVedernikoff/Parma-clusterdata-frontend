import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'store/configureStore';
import Toaster from '@kamatech-data-ui/common/src/components/Toaster';
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
import { ANT_TOKEN } from '@shared/config/theme';
import { replaceIframeParams } from '@shared/lib/utils/replace-iframe-params';

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

export function DatasetBuild(props) {
  replaceIframeParams(props);

  return (
    <ConfigProvider theme={{ ...ANT_TOKEN }} locale={ruRU}>
      <Provider store={store}>
        <DatasetRouter sdk={sdk} />
      </Provider>
    </ConfigProvider>
  );
}
