import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import moment from 'moment';
import { Utils } from '@kamatech-data-ui/clustrum';
import App from '../components/App/App';
import { store, history } from '../store';
import { IS_INTERNAL } from '../modules/constants/constants';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';

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
import { useUnit } from 'effector-react';
import { setAppSettingsEvent, $appSettingsStore } from '@shared/app-settings';
import { NotificationContext } from '@entities/notification';
import { useCustomNotification } from '@shared/lib/hooks';

Utils.setBodyFeatures();
moment.locale(process.env.BEM_LANG || 'ru');

if (IS_INTERNAL) {
  // т.к. скрипты используют moment в форматтерах
  window.moment = moment;
}

logVersion();

function Dash() {
  const [setAppSettings] = useUnit([setAppSettingsEvent]);

  const searchParams = new URL(window.location.href).searchParams;
  const [openNotification, contextHolder] = useCustomNotification();

  const { ant } = $appSettingsStore.getState().theme;

  setAppSettings({
    hideSubHeader: searchParams.get('hide-header-btns') === 'true',
    hideTabs: searchParams.get('hide-tabs') === 'true',
    hideEdit: searchParams.get('hide-edit') === 'true',
    enableCaching: searchParams.get('enable-caching') === 'true',
    cacheMode: searchParams.get('cache-mode'),
    exportMode: searchParams.get('export-mode'),
    stateUuid: searchParams.get('state-uuid'),
  });

  return (
    <ConfigProvider theme={{ token: ant }} locale={ruRU}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <NotificationContext.Provider value={openNotification}>
            {contextHolder}
            <App />
          </NotificationContext.Provider>
        </ConnectedRouter>
      </Provider>
    </ConfigProvider>
  );
}

ReactDOM.render(<Dash />, document.getElementById('root'));
