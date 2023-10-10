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
import ruRU from 'antd/locale/ru_RU';

import reducers from '../reducers';

import App from '../containers/App';

import './../css/clustrum/colors.css';
import './../css/vendors.css';
import './../css/commons.css';
import './../css/app.css';
import './../css/app-table-settings-total.css';
import './../css/card.css';
import './../css/clustrum/styles.css';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import { logVersion } from '../utils/version-logger';
import { NotificationContext, useCustomNotification } from '@clustrum-lib';
import { $appSettingsStore } from '@shared/app-settings';

const middlewares = [thunkMiddleware];

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger({ collapsed: true });

  middlewares.push(logger);
}

const store = createStore(reducers, composeWithDevTools(applyMiddleware(...middlewares)));

moment.locale(process.env.BEM_LANG || 'ru');

Utils.setBodyFeatures();

logVersion();

function AppEntry() {
  const [openNotification, contextHolder] = useCustomNotification();
  const { ant } = $appSettingsStore.getState().theme;

  return (
    <AppContainer>
      <ConfigProvider theme={{ ...ant }} locale={ruRU}>
        <Provider store={store}>
          <NotificationContext.Provider value={openNotification}>
            {contextHolder}
            <DndProvider backend={HTML5Backend}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </DndProvider>
          </NotificationContext.Provider>
        </Provider>
      </ConfigProvider>
    </AppContainer>
  );
}

function render() {
  ReactDOM.render(<AppEntry />, document.getElementById('root'));
}

render();

if (module.hot) {
  module.hot.accept();
  render();
}
