import React from 'react';
import { Provider } from 'react-redux';
import { useUnit } from 'effector-react';
import { ConnectedRouter } from 'connected-react-router';
import moment from 'moment';
import { Utils } from '@kamatech-data-ui/clustrum';
import { Switch, Route } from 'react-router-dom';
import { store, history } from '../store';
import { IS_INTERNAL } from '../modules/constants/constants';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { ANT_TOKEN } from '@shared/config/theme';
import { setAppSettingsEvent } from '@entities/app-settings';
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
import { useCustomNotification } from '@shared/lib/hooks';
import { NotificationContext } from '@entities/notification';

Utils.setBodyFeatures();
moment.locale(process.env.BEM_LANG || 'ru');

if (IS_INTERNAL) {
  window.moment = moment;
}

logVersion();

export default function DashBuild(props) {
  const { entryId, hideRightSideContent, onFiltersChange, onTabChange } = props;

  const [openNotification, contextHolder] = useCustomNotification();
  const [setAppSettings] = useUnit([setAppSettingsEvent]);
  setAppSettings({
    hideHeader: props.hideHeader,
    hideSubHeader: props.hideSubHeader,
    hideTabs: props.hideTabs,
    hideEdit: props.hideEdit,
    hideDashExport: props.hideDashExport,
    enableCaching: props.enableCaching,
    cacheMode: props.cacheMode,
    exportMode: props.exportMode,
    stateUuid: props.stateUuid,
  });

  return (
    <ConfigProvider theme={{ ...ANT_TOKEN }} locale={ruRU}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <NotificationContext.Provider value={openNotification}>
            {contextHolder}
            <DndProvider backend={HTML5Backend}>
              <Pointerfocus />
              <Switch>
                <Route
                  path="*"
                  render={() => (
                    <Dash
                      defaultEntryId={entryId}
                      hasRightSideContent={!hideRightSideContent}
                      onFiltersChange={onFiltersChange}
                      onTabChange={onTabChange}
                    />
                  )}
                />
              </Switch>
            </DndProvider>
          </NotificationContext.Provider>
        </ConnectedRouter>
      </Provider>
    </ConfigProvider>
  );
}
