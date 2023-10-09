import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import moment from 'moment';
import { ConfigProvider } from 'antd';
import { useUnit } from 'effector-react';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import { Pointerfocus } from 'lego-on-react';
import { Wizard } from '@clustrum-lib-legacy';
import { Utils } from '@kamatech-data-ui/clustrum';
import { SDK } from '@kamatech-data-ui/clustrum';
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
import { $appSettingsStore, setAppSettingsEvent } from '@shared/app-settings';
import { setCssVariables } from '@shared/theme';

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
  endpoints: $appSettingsStore.getState().endpoints,
  currentCloudFolderId: $appSettingsStore.getState().currentCloudFolderId,
  currentCloudId: $appSettingsStore.getState().currentCloudId,
});

export default function WizardBuild(props) {
  const { entryId } = props;

  const theme = props.theme ? props.theme : $appSettingsStore.getState().theme;

  const [setAppSettings] = useUnit([setAppSettingsEvent]);
  setAppSettings({
    hideHeader: !props.featureToggles?.header ?? false,
    hideSubHeader: !props.featureToggles?.subHeader ?? false,
    enableCaching: props.enableCaching,
    cacheMode: props.cacheMode,
    exportMode: props.exportMode,
    stateUuid: props.stateUuid,
    theme,
  });

  const handleExport = (id, name, options) => {
    exportWidget({ id, name }, undefined, options);
  };

  setCssVariables(theme);

  return (
    <ConfigProvider theme={{ token: theme.ant }} locale={ruRU}>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <BrowserRouter>
            <div className="clustrum">
              <Pointerfocus />
              <Switch>
                <Route
                  path="*"
                  component={props => (
                    <Wizard
                      {...props}
                      onExport={handleExport}
                      sdk={sdk}
                      entryId={entryId}
                    />
                  )}
                />
              </Switch>
            </div>
          </BrowserRouter>
        </DndProvider>
      </Provider>
    </ConfigProvider>
  );
}
