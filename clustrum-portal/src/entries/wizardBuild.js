import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import moment from 'moment';
import { ConfigProvider } from 'antd';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import { Pointerfocus } from 'lego-on-react';
import { Wizard } from '@clustrum-lib-legacy';
import { Utils } from '@kamatech-data-ui/clustrum';
import { SDK } from '@kamatech-data-ui/clustrum';
import { ANT_TOKEN } from '@shared/config/theme';
import { replaceIframeParams } from '@shared/lib/utils';
import ruRU from 'antd/locale/ru_RU';
import reducers from '../reducers';
import { exportWidget } from '../services/dashboard/export/export-widget';

import './../css/clustrum/colors.css';
import './../css/vendors.css';
import './../css/commons.css';
import './../css/app.css';
import './../css/app-table-settings-total.css';
import './../css/card.css';
import './../css/clustrum/styles.css';

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

const sdk = new SDK({
  endpoints: window.DL.endpoints,
  currentCloudFolderId: window.DL.currentCloudFolderId,
  currentCloudId: window.DL.currentCloudId,
});

export function WizardBuild(props) {
  const { entryId } = props;
  replaceIframeParams(props);

  const handleExport = (id, name, options) => {
    exportWidget({ id, name }, undefined, options);
  };

  return (
    <ConfigProvider theme={{ ...ANT_TOKEN }} locale={ruRU}>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <BrowserRouter>
            <Pointerfocus />
            <Switch>
              <Route
                path="*"
                component={props => (
                  <Wizard
                    {...props}
                    isBuild
                    onExport={handleExport}
                    sdk={sdk}
                    entryId={entryId}
                  />
                )}
              />
            </Switch>
          </BrowserRouter>
        </DndProvider>
      </Provider>
    </ConfigProvider>
  );
}
