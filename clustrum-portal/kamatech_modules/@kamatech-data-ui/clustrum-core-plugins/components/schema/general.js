'use strict';

const Utils = require('../../utils');
const qs = require('qs');
const axios = require('axios');
const {
  PLACE,
  MAP_PLACE_TO_SCOPE,
  TIMEOUT_10_SEC,
  TIMEOUT_60_SEC,
  TIMEOUT_120_SEC,
} = require('../../constants');

const defaultTransformResponse = axios.defaults.transformResponse[0];

const GENERAL_API_SCHEMA = {
  getEntryByKey: (headers, utils, params) => ({
    method: 'get',
    url: `${utils.config.endpoints.us}/v1/entriesByKey`,
    headers,
    query: params,
  }),
  getRevisions: (headers, utils, { entryId }) => ({
    method: 'get',
    url: `${utils.config.endpoints.us}/v1/entries/${entryId}/revisions`,
    headers,
  }),
  getEntry: (headers, utils, { entryId, ...restParams }) => ({
    method: 'get',
    url: `${utils.config.endpoints.us}/v1/entries/${entryId}`,
    headers,
    query: restParams,
  }),
  getEntryMeta: (headers, utils, { entryId }) => ({
    method: 'get',
    url: `${utils.config.endpoints.us}/v1/entries/${entryId}/meta`,
    headers,
  }),
  createEntry: (headers, utils, params) => ({
    method: 'post',
    url: `${utils.config.endpoints.us}/v1/entries`,
    headers,
    body: params,
  }),
  moveEntry: (headers, utils, { entryId, destination }) => ({
    method: 'post',
    url: `${utils.config.endpoints.us}/v1/entries/${entryId}/move`,
    headers,
    body: {
      destination: Utils.normalizeDestination(destination),
    },
  }),
  copyEntry: (headers, utils, { entryId, destination, name }) => {
    const body = {
      destination: Utils.normalizeDestination(destination),
    };

    if (name) {
      body.name = name;
    }

    return {
      method: 'post',
      url: `${utils.config.endpoints.us}/v1/entries/${entryId}/copy`,
      headers,
      body,
    };
  },
  renameEntry: (headers, utils, { entryId, newName }) => ({
    method: 'post',
    url: `${utils.config.endpoints.us}/v1/entries/${entryId}/rename`,
    headers,
    body: {
      name: newName,
    },
  }),
  describeEntry: (headers, utils, { entryId, description }) => ({
    method: 'describe',
    headers,
    body: {
      entryId,
      description,
    },
  }),
  deleteEntry: (headers, utils, { entryId }) => ({
    method: 'delete',
    url: `${utils.config.endpoints.us}/v1/entries/${entryId}`,
    headers,
  }),

  copyTemplate: (headers, utils, { templateName, connectionId, postfix }) => ({
    method: 'post',
    url: `${utils.config.endpoints.us}/v1/copyTemplate`,
    headers,
    body: {
      templateName,
      connectionId,
      postfix,
    },
    timeout: TIMEOUT_60_SEC,
  }),

  getPermissions: (headers, utils, { entryId }) => ({
    method: 'get',
    url: `${utils.config.endpoints.us}/dls/nodes/all/${entryId}/permissions`,
    headers,
  }),
  getGrantDetails: (headers, utils, { entryId, subject }) => ({
    method: 'get',
    url: `${utils.config.endpoints.us}/dls/nodes/all/${entryId}/permissions/subjects/${subject}`,
    headers,
  }),
  suggest: (headers, utils, { searchText, limit }) => {
    const query = {
      search_text: searchText,
      limit,
    };

    if (utils.config.currentCloudId) {
      query['cloud_id'] = utils.config.currentCloudId;
    }

    return {
      method: 'get',
      url: `${utils.config.endpoints.us}/dls/suggest/subjects`,
      headers,
      query,
    };
  },
  modifyPermissions: (headers, utils, { entryId, body }) => ({
    method: 'post',
    url: `${utils.config.endpoints.us}/dls/nodes/all/${entryId}/permissions`,
    headers,
    body,
  }),

  getNavigationList: (headers, utils, params) => {
    const { place, placeParameters, ...restParams } = params; // eslint-disable-line no-unused-vars

    switch (place) {
      case PLACE.ORIGIN_ROOT:
      case PLACE.ROOT:
        return GENERAL_API_SCHEMA.listDirectory(
          headers,
          utils,
          {
            ...restParams,
            includePermissionsInfo: true,
          },
          [
            data => ({
              hasNextPage: false,
              entries: data,
            }),
          ],
        );
      case PLACE.FAVORITES:
        return GENERAL_API_SCHEMA.getFavorites(
          headers,
          utils,
          {
            ...restParams,
            includePermissionsInfo: true,
          },
          [
            data => ({
              hasNextPage: false,
              entries: data,
            }),
          ],
        );
      default:
        return GENERAL_API_SCHEMA.getEntries(
          headers,
          utils,
          {
            ...restParams,
            scope: MAP_PLACE_TO_SCOPE[place],
            includePermissionsInfo: true,
          },
          [
            ({ nextPageToken, entries }) => ({
              hasNextPage: Boolean(nextPageToken),
              entries,
            }),
          ],
        );
    }
  },
  listDirectory: (headers, utils, params, additionalTransformResponse = []) => ({
    method: 'get',
    url: `${utils.config.endpoints.us}/v1/navigation`,
    headers,
    query: params,
    transformResponse: [
      defaultTransformResponse,
      data =>
        data.map(entry => ({
          ...entry,
          name: Utils.getNameByIndex({ path: entry.key, index: -1 }),
        })),
      ...additionalTransformResponse,
    ],
    timeout: TIMEOUT_60_SEC,
  }),
  getStructure: (headers, utils, params) => ({
    method: 'get',
    url: `${utils.config.endpoints.us}/v1/navigation`,
    headers,
    query: params,
    timeout: TIMEOUT_60_SEC,
  }),
  getEntries: (headers, utils, params, additionalTransformResponse = []) => ({
    method: 'get',
    url: `${utils.config.endpoints.us}/v1/entries`,
    headers,
    query: params,
    transformResponse: [
      defaultTransformResponse,
      data => ({
        ...data,
        entries: data.entries.map(entry => ({
          ...entry,
          name: Utils.getNameByIndex({ path: entry.key, index: -1 }),
        })),
      }),
      ...additionalTransformResponse,
    ],
  }),

  getFavorites: (headers, utils, params, additionalTransformResponse = []) => ({
    method: 'get',
    url: `${utils.config.endpoints.us}/v1/favorites`,
    headers,
    transformResponse: [
      defaultTransformResponse,
      data =>
        data.map(entry => ({
          ...entry,
          name: Utils.getNameByIndex({ path: entry.key, index: -1 }),
          isFavorite: true,
        })),
      ...additionalTransformResponse,
    ],
  }),
  addFavorite: (headers, utils, { entryId }) => ({
    method: 'post',
    url: `${utils.config.endpoints.us}/v1/favorites/${entryId}`,
    headers,
  }),
  deleteFavorite: (headers, utils, { entryId }) => ({
    method: 'delete',
    url: `${utils.config.endpoints.us}/v1/favorites/${entryId}`,
    headers,
  }),

  getState: (headers, utils, { entryId, hash }) => ({
    method: 'get',
    url: `${utils.config.endpoints.us}/v1/states/${entryId}/${hash}`,
    headers,
  }),
  createState: (headers, utils, { entryId, data }) => ({
    method: 'post',
    url: `${utils.config.endpoints.us}/v1/states/${entryId}`,
    headers,
    body: {
      data,
    },
  }),

  renderMarkdown: (headers, utils, { text }) => ({
    method: 'post',
    url: `${utils.config.endpoints.charts}/api/markdown/render`,
    headers,
    body: {
      text,
    },
    timeout: TIMEOUT_120_SEC,
  }),

  getMetrikaOAuthToken: (headers, utils, { confirmCode }) => {
    const {
      metrikaOAuthClientId,
      metrikaOAuthClientSecret,
      endpoints: { extPassportOAuth: oauthUrl },
    } = utils.config;

    const body = qs.stringify({
      grant_type: 'authorization_code',
      code: confirmCode,
      client_id: metrikaOAuthClientId,
      client_secret: metrikaOAuthClientSecret,
    });

    return {
      method: 'post',
      url: `${oauthUrl}/token`,
      body,
      transformResponse: [
        defaultTransformResponse,
        ({ access_token: accessToken }) => ({
          token: accessToken,
        }),
      ],
      timeout: TIMEOUT_10_SEC,
    };
  },
  getMetrikaCounters: (headers, utils, { token }) => ({
    method: 'get',
    url: `${utils.config.endpoints.metrika}/management/v1/counters`,
    headers: {
      Authorization: `OAuth ${token}`,
    },
    timeout: TIMEOUT_10_SEC,
  }),

  getAppMetricaApplications: (headers, utils, { token }) => ({
    method: 'get',
    url: `${utils.config.endpoints.appMetrica}/management/v1/applications`,
    headers: {
      Authorization: `OAuth ${token}`,
    },
    timeout: TIMEOUT_10_SEC,
  }),

  createFolder: (headers, utils, { key }) => ({
    method: 'post',
    url: `${utils.config.endpoints.us}/v1/entries`,
    headers,
    body: {
      scope: 'folder',
      type: '',
      key,
      meta: {},
      data: {},
    },
  }),

  getWidget: (headers, utils, { entryId, unreleased = true }) => {
    const query = {};

    if (unreleased) {
      query.unreleased = 1;
    }

    return {
      method: 'get',
      url: `${utils.config.endpoints.charts}/api/widgets/${entryId}`,
      headers,
      query,
      timeout: TIMEOUT_120_SEC,
    };
  },
  createWidget: (headers, utils, { key, data }) => ({
    method: 'post',
    url: `${utils.config.endpoints.charts}/api/widgets`,
    headers,
    body: {
      key,
      data: {
        type: 'clustrum',
        ...data,
      },
    },
    timeout: TIMEOUT_120_SEC,
  }),
  updateWidget: (headers, utils, { entryId, revId, data }) => ({
    method: 'post',
    url: `${utils.config.endpoints.charts}/api/widgets/${entryId}`,
    headers,
    body: {
      entryId,
      revId,
      data: {
        type: 'clustrum',
        ...data,
      },
    },
    timeout: TIMEOUT_120_SEC,
  }),
  runWidget: (headers, utils, { config, id, params, path, responseOptions }) => ({
    method: 'post',
    url: `${utils.config.endpoints.charts}/run`,
    headers,
    body: {
      config,
      id,
      params,
      path,
      responseOptions,
    },
    timeout: TIMEOUT_120_SEC,
  }),
  export: (headers, utils, { data }) => ({
    method: 'post',
    url: `${utils.config.endpoints.charts}/api/export`,
    headers,
    body: {
      data,
    },
    responseType: 'arraybuffer',
    timeout: TIMEOUT_120_SEC,
  }),

  createDash: (headers, utils, { key, data }) =>
    GENERAL_API_SCHEMA.createEntry(headers, utils, {
      scope: 'dash',
      type: '',
      key,
      meta: {},
      data,
    }),
  updateDash: (headers, utils, { entryId, data }) => ({
    method: 'post',
    url: `${utils.config.endpoints.us}/v1/entries/${entryId}`,
    headers,
    body: {
      mode: 'save',
      type: '',
      meta: {},
      data,
    },
    timeout: TIMEOUT_120_SEC,
  }),
  runDashControl: (headers, utils, { shared }) => ({
    method: 'post',
    url: `${utils.config.endpoints.charts}/run`,
    headers,
    body: {
      config: {
        data: {
          shared,
        },
        meta: {
          stype: 'control',
        },
      },
      path: '/ChartEditor?name=blank',
    },
    timeout: TIMEOUT_120_SEC,
  }),
  runDashChart: (headers, utils, { id, params }) => ({
    method: 'post',
    url: `${utils.config.endpoints.charts}/run`,
    headers,
    body: {
      id,
      params,
    },
    timeout: TIMEOUT_120_SEC,
  }),

  getEditorFunctionDoc: (headers, utils, { path }) => ({
    method: 'get',
    url: `${utils.config.endpoints.docsApi}?path=${path}`,
    transformResponse: [defaultTransformResponse, ({ html }) => ({ html })],
  }),
  getAllEditorFunctionsDoc: (headers, utils) => ({
    method: 'get',
    url: `${utils.config.endpoints.docsApi}?path=clustrum/function-ref/all`,
    transformResponse: [
      defaultTransformResponse,
      data => {
        const {
          breadcrumbs: [referencesBreadcrumb],
          toc: { items: itemsToc = [] } = {},
        } = data;
        const { name: functionReferencesBreadcrumbName } = referencesBreadcrumb;
        let allEditorFunctionsDoc = [];

        const functionsToc = itemsToc.find(
          ({ name }) => name === functionReferencesBreadcrumbName,
        );

        if (functionsToc) {
          const { items: functionsTocItems = [] } = functionsToc;

          allEditorFunctionsDoc = functionsTocItems.filter(({ items }) => items);
        }

        return allEditorFunctionsDoc;
      },
    ],
  }),

  createEditorChart: (headers, utils, { key, data, type }) =>
    GENERAL_API_SCHEMA.createEntry(headers, utils, {
      scope: 'widget',
      type,
      key,
      meta: {},
      data,
    }),
  updateEditorChart: (headers, utils, { entryId, data, mode, revId }) => ({
    method: 'post',
    url: `${utils.config.endpoints.us}/v1/entries/${entryId}`,
    headers,
    body: {
      mode,
      meta: {},
      data,
      revId,
    },
    timeout: TIMEOUT_120_SEC,
  }),
  createDashState: 'createDashState',
  getDashState: 'getDashState',
};

module.exports = GENERAL_API_SCHEMA;
