import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Utils } from '@kamatech-data-ui/clustrum';
import moment from 'moment';
import { ConfigProvider } from 'antd';
import { ANT_TOKEN } from '../constants/constants';

import reducers from '../reducers';

import App from '../containers/App';

import './../css/vendors.css';
import './../css/commons.css';
import './../css/app.css';
import './../css/app-table-settings-total.css';
import './../css/card.css';

import { logVersion } from '../utils/version-logger';

const middlewares = [thunkMiddleware];

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger({ collapsed: true });

  middlewares.push(logger);
}

const store = createStore(reducers, composeWithDevTools(applyMiddleware(...middlewares)));

moment.locale(process.env.BEM_LANG || 'ru');

Utils.setBodyFeatures();

logVersion();

function render() {
  ReactDOM.render(
    <AppContainer>
      <ConfigProvider theme={{ ...ANT_TOKEN }}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </ConfigProvider>
    </AppContainer>,
    document.getElementById('root'),
  );
}

render();

if (module.hot) {
  module.hot.accept();
  render();
}
