import Utils from '../../utils';

import ChartKit from '@parma-data-ui/chartkit/lib';

import extendHighcharts from '@parma-data-ui/chartkit/lib/extensions/highcharts-extended';
import boostHighcharts from '@parma-data-ui/chartkit/lib/extensions/highcharts-boost';
import renderTable from '@parma-data-ui/chartkit/lib/extensions/table';
import renderMap from '@parma-data-ui/chartkit/lib/extensions/map';
import renderYandexMap from '@parma-data-ui/chartkit/lib/extensions/yandex-map';
import renderMetric from '@parma-data-ui/chartkit/lib/extensions/metric';
import renderText from '@parma-data-ui/chartkit/lib/extensions/text';
import renderControl from '@parma-data-ui/chartkit/lib/extensions/control';
import useHolidays from '@parma-data-ui/chartkit/lib/extensions/holidays';

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
} from '@parma-data-ui/chartkit/lib/extensions/menu-items';

// import './ChartKit.scss';

extendHighcharts(ChartKit);
if (window.DL.features.highchartsBoost) {
  boostHighcharts(ChartKit);
}
renderTable(ChartKit);
renderMap(ChartKit);
renderYandexMap(ChartKit);
renderMetric(ChartKit);
renderText(ChartKit);
renderControl(ChartKit);
useHolidays(ChartKit);

ChartKit.setSettings({
  chartsEndpoint: window.DL.endpoints.charts,
  lang: window.DL.user.lang,
  config: Utils.isInternalInstallation(),
  theme: 'clusterdata',
  requestDecorator: request => {
    const CSRFToken = Utils.getCSRFToken();
    if (CSRFToken) {
      request.headers['X-CSRF-Token'] = CSRFToken;
    }
    if (window.DL.currentCloudFolderId) {
      request.headers['X-YaCloud-FolderId'] = window.DL.currentCloudFolderId;
    }
    return request;
  },
  menu: Utils.isInternalInstallation()
    ? [HIDE_COMMENTS, SHOW_COMMENTS, COMMENTS, SCREENSHOT, EXPORT, NEW_WINDOW, OPEN_AS_TABLE, GET_LINK, SOURCES, EDIT]
    : [EXPORT],
});

export default ChartKit;
