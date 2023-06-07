import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'store/configureStore';
import { SDK, Utils } from '@kamatech-data-ui/clustrum';

import NavigationPage from '../containers/NavigationPage/NavigationPage';

import './../css/vendors.css';
import './../css/commons.css';
import './../css/navigation.css';

import { logVersion } from '../utils/version-logger';

const sdk = new SDK({
  endpoints: window.DL.endpoints,
  currentCloudId: window.DL.currentCloudId,
  currentCloudFolderId: window.DL.currentCloudFolderId,
});
const store = configureStore();

Utils.setBodyFeatures();

logVersion();

export function NavigationBuild() {
  return (
    <Provider store={store}>
      <Router>
        <NavigationPage sdk={sdk} />
      </Router>
    </Provider>
  );
}
