import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import moment from 'moment';
import configureStore from 'store/configureStore';
import Toaster from '@kamatech-data-ui/common/src/components/Toaster';
import { SDK, I18n, Utils } from '@kamatech-data-ui/clustrum';
I18n.registerKeysets(window.DL_I18N);

import DatasetRouter from '../components/DatasetRouter/DatasetRouter';

// import '@kamatech-data-ui/common/styles/styles.scss';
// import '@kamatech-data-ui/clustrum/src/styles/variables.scss';
// import '../styles/variables.scss';

import './../css/vendors.css';
import './../css/commons.css';
import './../css/dataset.css';

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

function render() {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <DatasetRouter sdk={sdk} />
      </Provider>
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
