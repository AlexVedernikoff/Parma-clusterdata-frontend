import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import moment from 'moment';
import { Utils } from '@kamatech-data-ui/clustrum';
import App from '../components/App/App';
import { store, history } from '../store';
import { IS_INTERNAL } from '../modules/constants/constants';

import './../css/clustrum/colors.css';
import './../css/app.css';
import './../css/vendors.css';
import './../css/commons.css';
import './../css/dash.css';
import './../css/dash-new.css';
import './../css/card.css';
import './../css/dash-redesign.css';
import './../css/clustrum/styles.css';

import { logVersion } from '../utils/version-logger';

Utils.setBodyFeatures();
moment.locale(process.env.BEM_LANG || 'ru');

if (IS_INTERNAL) {
  window.moment = moment;
}

logVersion();

export function DashBuild() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  );
}
