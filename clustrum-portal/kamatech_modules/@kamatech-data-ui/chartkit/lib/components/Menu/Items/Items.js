/* eslint-disable react/no-render-return-value */

import React from 'react';
import ReactDOM from 'react-dom';
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import isMatchWith from 'lodash/isMatchWith';
import isEqualWith from 'lodash/isEqualWith';

import Icon, { extend } from '../../Icon/Icon';
import DownloadScreenshot from './DownloadScreenshot/DownloadScreenshot';
import CodeLinkModal from './CodeLinkModal/CodeLinkModal';
import ChartSourceModal from './ChartSourceModal/ChartSourceModal';
import CommentsModal from './CommentsModal/CommentsModal';

// TODO: элементы меню должны включать в себя нужные модули, чтобы они не импортились в других местах
import URI from '../../../modules/uri/uri';
import settings from '../../../modules/settings/settings';
import { normalizeSources } from '../../../modules/sources/sources';
import { WIDGET_TYPE } from '../../Widget/Widget';
import { URL_OPTIONS } from '../../../modules/constants/constants';
import { readComments } from '../../../modules/comments/comments';
import { drawComments, hideComments } from '../../../modules/comments/drawing';

/* eslint-disable max-len */
extend({
  eye: (
    <path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
  ),
  'eye-stroke': (
    <path d="M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z" />
  ),
  comment: (
    <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z" />
  ),
  clip: (
    <path d="M7.5,18A5.5,5.5 0 0,1 2,12.5A5.5,5.5 0 0,1 7.5,7H18A4,4 0 0,1 22,11A4,4 0 0,1 18,15H9.5A2.5,2.5 0 0,1 7,12.5A2.5,2.5 0 0,1 9.5,10H17V11.5H9.5A1,1 0 0,0 8.5,12.5A1,1 0 0,0 9.5,13.5H18A2.5,2.5 0 0,0 20.5,11A2.5,2.5 0 0,0 18,8.5H7.5A4,4 0 0,0 3.5,12.5A4,4 0 0,0 7.5,16.5H17V18H7.5Z" />
  ),
  download: <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />,
  'new-window': (
    <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
  ),
  table: (
    <path d="M4,3H20A2,2 0 0,1 22,5V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V5A2,2 0 0,1 4,3M4,7V10H8V7H4M10,7V10H14V7H10M20,10V7H16V10H20M4,12V15H8V12H4M4,20H8V17H4V20M10,12V15H14V12H10M10,20H14V17H10V20M20,20V17H16V20H20M20,12H16V15H20V12Z" />
  ),
  link: (
    <path d="M16,6H13V7.9H16C18.26,7.9 20.1,9.73 20.1,12A4.1,4.1 0 0,1 16,16.1H13V18H16A6,6 0 0,0 22,12C22,8.68 19.31,6 16,6M3.9,12C3.9,9.73 5.74,7.9 8,7.9H11V6H8A6,6 0 0,0 2,12A6,6 0 0,0 8,18H11V16.1H8C5.74,16.1 3.9,14.26 3.9,12M8,13H16V11H8V13Z" />
  ),
  database: (
    <path d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z" />
  ),
  pencil: (
    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
  ),
});
/* eslint-enable max-len */

function goAwayLink(
  { loadedData, propsData },
  { extraParams = {}, urlPostfix = '', idPrefix = '' },
) {
  let url = settings.chartsEndpoint + urlPostfix;

  const id = (loadedData && loadedData.entryId) || propsData.id;

  url += id ? idPrefix + id : propsData.source;

  const query = URI.makeQueryString({ ...propsData.params, ...extraParams });

  return url + query;
}

const HIDE_COMMENTS = {
  title: 'Скрыть комментарии',
  icon: <Icon size="20" name="eye-stroke" />,
  isVisible: ({
    loadedData: {
      comments,
      params: { [URL_OPTIONS.HIDE_COMMENTS]: hideComments } = {},
    } = {},
  }) => comments && comments.length && (!hideComments || hideComments[0] != '1'), // eslint-disable-line eqeqeq
  action: ({ onChange }) => onChange({ params: { [URL_OPTIONS.HIDE_COMMENTS]: 1 } }),
};

const SHOW_COMMENTS = {
  title: 'Показать комментарии',
  icon: <Icon size="20" name="eye" />,
  isVisible: ({
    loadedData: {
      comments,
      params: { [URL_OPTIONS.HIDE_COMMENTS]: hideComments } = {},
    } = {},
  }) => comments && comments.length && hideComments && hideComments[0] == '1', // eslint-disable-line eqeqeq
  action: ({ onChange }) => onChange({ params: { [URL_OPTIONS.HIDE_COMMENTS]: 0 } }),
};

function checkMatchCommentsConfig(config, params, feed, checkFeed, checkParams) {
  const { ...rest } = params;
  const { matchedParams = [], matchType, feeds: configFeeds = [] } =
    config.comments || {};

  const feeds = [{ feed, matchedParams }]
    .concat(configFeeds)
    .map(({ feed, matchedParams = [] }) =>
      matchedParams.reduce(
        (result, name) => {
          const value = rest[name];
          result.params[name] = Array.isArray(value) ? value : [value];
          return result;
        },
        { feed, params: {} },
      ),
    );

  return feeds.some(
    ({ feed, params = {} }) =>
      checkFeed === feed &&
      // если функция сравнения возвращает undefined, то отрабатывает метод по умолчанию
      (matchType === 'contains'
        ? isMatchWith(
            params,
            checkParams || {},
            (a, b) => a === '*' || b === '*' || undefined,
          )
        : isEqualWith(
            params,
            checkParams || {},
            (a, b) => a === '*' || b === '*' || undefined,
          )),
  );
}

function loadComments(widget, config, params, feed, excludeParams) {
  const { ...rest } = params;
  const { path, matchedParams = [], matchType, feeds: configFeeds = [] } =
    config.comments || {};

  const seriesIds = widget.series.map(({ userOptions: { id } }) => id);

  const { dataMin, dataMax } = widget.xAxis[0].getExtremes();

  const feeds = excludeParams
    ? [{ feed }].concat(configFeeds).map(({ feed }) => ({ feed }))
    : [{ feed, matchedParams }].concat(configFeeds).map(({ feed, matchedParams = [] }) =>
        matchedParams.reduce(
          (result, name) => {
            const value = rest[name];
            result.params[name] = Array.isArray(value) ? value : [value];
            return result;
          },
          { feed, params: {} },
        ),
      );

  return readComments(
    {
      feeds,
      statFeed: path ? { path, field_name: ['none'].concat(seriesIds).join(',') } : null,
      meta: {
        matchType,
        dateFrom: moment(dataMin).format(),
        dateTo: moment(dataMax).format(),
      },
    },
    seriesIds,
  );
}

const COMMENTS = {
  title: 'Комментарии',
  icon: <Icon size="20" name="comment" />,
  isVisible: ({ loadedData: { data, widgetType, isNewWizard } = {}, widget }) =>
    widget &&
    widgetType === WIDGET_TYPE.GRAPH &&
    !isNewWizard &&
    widget.xAxis[0].isDatetimeAxis &&
    widget.xAxis[0].closestPointRange <= 86400000,
  action: ({ loadedData, propsData, widget, widgetData, anchorNode }) => {
    // const graphs = loadedData.data.graphs.filter(({id}) => id)
    //     .map(({id, name, title}) => { return {value: id, text: title}; });

    const graphs = widget.series.map(({ name, userOptions: { id } }) => ({
      value: id || name,
      text: name,
    }));

    const { dataMax: dateMaxMs, dataMin: dateMinMs } = widget.xAxis[0].getExtremes();

    const scale =
      widget.userOptions._config.highchartsScale || widget.userOptions._config.scale;

    // const dateMinMs = loadedData.data.categories_ms[0];
    // const dateMaxMs = loadedData.data.categories_ms[loadedData.data.categories_ms.length - 1];

    const currentFeed = loadedData.key;
    const params = loadedData.params;
    const { comments: { matchedParams = [], feeds: configFeeds = [] } = {} } =
      loadedData.config || {};
    const currentParams = matchedParams.reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {});

    const feeds = [{ feed: currentFeed, matchedParams }]
      .concat(configFeeds)
      .map(({ feed, matchedParams = [] }) =>
        matchedParams.reduce(
          (result, name) => {
            const value = params[name];
            result.params[name] = Array.isArray(value) ? value : [value];
            return result;
          },
          { feed, params: {} },
        ),
      );

    // return {
    // currentFeed,
    // currentParams: Object.keys(currentParams).length ? currentParams : null,
    // feeds,
    // isStatChart: false,
    // isBrowserChart,
    // loadComments: Charts._loadComments.bind(null, vault.data, vault.config, vault.params),
    // checkMatchCommentsConfig: Charts._checkMatchCommentsConfig.bind(null, vault.config, vault.params)
    // };

    ReactDOM.render(
      <CommentsModal
        currentFeed={currentFeed}
        feeds={feeds}
        currentParams={Object.keys(currentParams).length ? currentParams : null}
        element={anchorNode}
        graphs={graphs}
        comments={cloneDeep(widget.userOptions._comments)}
        dateMinMs={dateMinMs}
        dateMaxMs={dateMaxMs}
        scale={scale}
        loadComments={loadComments.bind(
          null,
          widget,
          loadedData.config,
          loadedData.params,
          loadedData.key,
        )}
        checkMatchCommentsConfig={checkMatchCommentsConfig.bind(
          null,
          loadedData.config,
          loadedData.params,
          loadedData.key,
        )}
        onClose={comments => {
          hideComments(widget, widget.userOptions._comments, loadedData.config);
          widget.userOptions._comments = comments;
          drawComments(widget, widget.userOptions._comments, loadedData.config);
        }}
      />,
      anchorNode,
    );
  },
};

const SCREENSHOT = {
  title: 'Сохранить картинку',
  icon: <Icon size="20" name="clip" />,
  isVisible: ({ loadedData: { data } = {} }) => Boolean(data),
  action: ({ event, loadedData, propsData, anchorNode }) =>
    ReactDOM.render(
      <DownloadScreenshot
        element={anchorNode}
        path={goAwayLink(
          { loadedData, propsData },
          { urlPostfix: '/preview', idPrefix: '/editor/' },
        ).replace(settings.chartsEndpoint, '')}
        filename={'charts'}
        initDownload={event.ctrlKey || event.metaKey}
      />,
      anchorNode,
    ),
};

const NEW_WINDOW = {
  title: 'Открыть в новой вкладке',
  icon: <Icon size="20" name="new-window" />,
  isVisible: () => true,
  action: ({ loadedData = {}, propsData }) =>
    window.open(
      goAwayLink(
        { loadedData, propsData },
        { urlPostfix: '/preview', idPrefix: '/editor/' },
      ),
    ),
};

const OPEN_AS_TABLE = {
  title: 'Открыть как таблицу',
  icon: <Icon size="20" name="table" />,
  isVisible: ({ loadedData: { data, widgetType } = {} }) =>
    data && widgetType === WIDGET_TYPE.GRAPH,
  action: ({ loadedData, propsData }) =>
    window.open(
      goAwayLink(
        { loadedData, propsData },
        {
          extraParams: { _editor_type: 'table' },
          urlPostfix: '/preview',
          idPrefix: '/editor/',
        },
      ),
    ),
};

const GET_LINK = {
  title: 'Получить ссылку и код',
  icon: <Icon size="20" name="link" />,
  isVisible: ({ loadedData: { widgetType } = {} }) => Boolean(widgetType),
  action: ({ loadedData, propsData, anchorNode }) =>
    ReactDOM.render(
      <CodeLinkModal
        element={anchorNode}
        url={goAwayLink(
          { loadedData, propsData },
          { urlPostfix: '/preview', idPrefix: '/editor/' },
        )}
        configType={loadedData.widgetType}
      />,
      anchorNode,
    ),
};

const SOURCES = {
  title: 'Посмотреть источники',
  icon: <Icon size="20" name="database" />,
  isVisible: ({ loadedData: { sources } = {} }) => sources && Object.keys(sources).length,
  action: ({ loadedData, anchorNode }) =>
    ReactDOM.render(
      <ChartSourceModal
        element={anchorNode}
        sources={normalizeSources(loadedData.sources)}
      />,
      anchorNode,
    ),
};

const EDIT = {
  title: 'Редактировать',
  icon: <Icon size="20" name="pencil" />,
  isVisible: () => true,
  action: ({ loadedData = {}, propsData }) =>
    window.open(goAwayLink({ loadedData, propsData }, { idPrefix: '/navigation/' })),
};

export { default as EXPORT } from './Export/Export';

export {
  HIDE_COMMENTS,
  SHOW_COMMENTS,
  COMMENTS,
  SCREENSHOT,
  NEW_WINDOW,
  OPEN_AS_TABLE,
  GET_LINK,
  SOURCES,
  EDIT,
};
