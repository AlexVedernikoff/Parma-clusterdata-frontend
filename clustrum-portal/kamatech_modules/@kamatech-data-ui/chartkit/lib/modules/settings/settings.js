import moment from 'moment';
import axiosInstance from '../axios/axios';
import { getRandomString } from '../../helpers/helpers';

const _isDevelopment = process.env.NODE_ENV === 'development';
const _settings = {
  chartsEndpoint: '',
  statfaceEndpoint: '',
  exportEndpoint: '',
  lang: 'ru',
  theme: 'default',
  config: null,
  menuItems: null,
  requestDecorator: null,
  requestIdGenerator: null,
};

function setMomentLocale() {
  const locale = _settings.lang;
  moment.updateLocale(locale, { week: { dow: 1, doy: 7 } });
  moment.locale(locale);
}

setMomentLocale();

// TODO: вынести в ChartKit как static
async function fetchConfig() {
  if (_settings.config !== false && !Object.keys(_settings.config || {}).length) {
    _settings.config = true;
    try {
      const { data } = await axiosInstance.get(`${_settings.chartsEndpoint}/api/private/config`);
      _settings.config = data;
    } catch (error) {
      console.error('CONFIG_FETCH_ERROR', error);
      _settings.config = {};
    }
  }
}

// TODO: сделать классом
export default {
  set(newSettings) {
    Object.assign(_settings, newSettings);
    setMomentLocale();
    // initHighcharts();
    fetchConfig();
  },
  requestDecorator(request) {
    if (typeof _settings.requestDecorator === 'function') {
      const originalHeaders = Object.assign({}, request.headers);
      const { headers: decoratedHeaders } = _settings.requestDecorator({ headers: originalHeaders });
      request.headers = decoratedHeaders;
    }
    return request;
  },
  requestIdGenerator() {
    if (typeof _settings.requestIdGenerator === 'function') {
      return _settings.requestIdGenerator();
    }
    return getRandomString();
  },
  get chartsEndpoint() {
    return _settings.chartsEndpoint;
  },
  get exportEndpoint() {
    return _settings.exportEndpoint;
  },
  get statfaceEndpoint() {
    return _settings.statfaceEndpoint;
  },
  get lang() {
    return _settings.lang;
  },
  get config() {
    return _settings.config || {};
  },
  get theme() {
    return _settings.theme;
  },
  get isProd() {
    return !_isDevelopment;
  },
  get menu() {
    return _settings.menu;
  },
};
