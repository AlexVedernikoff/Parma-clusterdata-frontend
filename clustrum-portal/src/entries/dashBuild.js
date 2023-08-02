import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import moment from 'moment';
import { Utils } from '@kamatech-data-ui/clustrum';
import { Switch, Route } from 'react-router-dom';
import { store, history } from '../store';
import { IS_INTERNAL } from '../modules/constants/constants';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { ANT_TOKEN } from '@shared/config/theme';
import { replaceIframeParams } from '@shared/lib/utils';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Dash from '../containers/Dash/Dash';
import { Pointerfocus } from 'lego-on-react';

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

export function DashBuild(props) {
  const { entryId } = props;
  replaceIframeParams(props);

  return (
    <ConfigProvider theme={{ ...ANT_TOKEN }} locale={ruRU}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <DndProvider backend={HTML5Backend}>
            <Pointerfocus />
            <Switch>
              <Route path="*" render={() => <Dash defaultEntryId={entryId} isBuild />} />
            </Switch>
          </DndProvider>
        </ConnectedRouter>
      </Provider>
    </ConfigProvider>
  );
}
