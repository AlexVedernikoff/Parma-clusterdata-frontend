import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import moment from 'moment';
import { AppContainer } from 'react-hot-loader';
import configureStore from 'store/configureStore';
import { SDK, I18n, Utils } from '@parma-data-ui/clusterdata';
I18n.registerKeysets(window.DL_I18N);

import NavigationPage from '../containers/NavigationPage/NavigationPage';

/*
import '@parma-data-ui/common/src/styles/styles.scss';
import '@parma-data-ui/clusterdata/src/styles/variables.scss';
import '../styles/variables.scss';
*/

import './../css/vendors.css';
import './../css/commons.css';
import './../css/navigation.css';

const sdk = new SDK({
  endpoints: window.DL.endpoints,
  currentCloudId: window.DL.currentCloudId,
  currentCloudFolderId: window.DL.currentCloudFolderId,
});
const store = configureStore();

Utils.setBodyFeatures();

function render() {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Router>
          <NavigationPage sdk={sdk} />
        </Router>
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
