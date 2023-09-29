import Utils from '../../utils';

import { WidgetContainer } from '@clustrum-lib';

import extendHighcharts from '@kamatech-data-ui/chartkit/lib/extensions/highcharts-extended';
import boostHighcharts from '@kamatech-data-ui/chartkit/lib/extensions/highcharts-boost';
import useHolidays from '@kamatech-data-ui/chartkit/lib/extensions/holidays';

import {
  HIDE_COMMENTS,
  SHOW_COMMENTS,
  COMMENTS,
  SCREENSHOT,
  EXPORT,
  NEW_WINDOW,
  OPEN_AS_TABLE,
  GET_LINK,
  SOURCES,
  EDIT,
} from '@kamatech-data-ui/chartkit/lib/extensions/menu-items';
import { $appSettingsStore } from '@shared/app-settings';

// import './ChartKit.scss';

extendHighcharts(WidgetContainer);
if ($appSettingsStore.getState().features.highchartsBoost) {
  boostHighcharts(WidgetContainer);
}
useHolidays(WidgetContainer);

WidgetContainer.setSettings({
  chartsEndpoint: $appSettingsStore.getState().endpoints.charts,
  lang: $appSettingsStore.getState().user.lang,
  config: Utils.isInternalInstallation(),
  theme: 'clustrum',
  requestDecorator: request => {
    const CSRFToken = Utils.getCSRFToken();
    if (CSRFToken) {
      request.headers['X-CSRF-Token'] = CSRFToken;
    }
    if ($appSettingsStore.getState().currentCloudFolderId) {
      request.headers[
        'X-YaCloud-FolderId'
      ] = $appSettingsStore.getState().currentCloudFolderId;
    }
    return request;
  },
  menu: Utils.isInternalInstallation()
    ? [
        HIDE_COMMENTS,
        SHOW_COMMENTS,
        COMMENTS,
        SCREENSHOT,
        EXPORT,
        NEW_WINDOW,
        OPEN_AS_TABLE,
        GET_LINK,
        SOURCES,
        EDIT,
      ]
    : [EXPORT],
});

export default WidgetContainer;
