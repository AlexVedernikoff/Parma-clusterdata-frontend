import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import moment from 'moment';
import { I18n, Utils } from '@kamatech-data-ui/clustrum';
import App from '../components/App/App';
import { store, history } from '../store';
import { IS_INTERNAL } from '../modules/constants/constants';

import './../css/app.css';
import './../css/vendors.css';
import './../css/commons.css';
import './../css/dash.css';
import './../css/dash-new.css';
import './../css/card.css';

I18n.registerKeysets(window.DL_I18N);
Utils.setBodyFeatures();
moment.locale(process.env.BEM_LANG || 'ru');

if (IS_INTERNAL) {
  // т.к. скрипты используют moment в форматтерах
  window.moment = moment;
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);
