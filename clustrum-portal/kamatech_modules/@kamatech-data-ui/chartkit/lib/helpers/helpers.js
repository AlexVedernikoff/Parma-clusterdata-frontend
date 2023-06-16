import settings from '../modules/settings/settings';
import URI from '../modules/uri/uri';
import isEmpty from 'lodash/isEmpty';

function randomString(length, chars) {
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function getRandomString() {
  return `ck.${randomString(10, '0123456789abcdefghijklmnopqrstuvwxyz')}`;
}

function fetchScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.onload = resolve;
    script.onerror = reject;
    script.src = url;
    script.async = 'async';

    document.head.appendChild(script);
  });
}

function numberFormat(value) {
  return Number(value)
    ? Intl.NumberFormat('ru-RU', {
        // minimumFractionDigits: precision,
        maximumFractionDigits: 16,
      }).format(value)
    : value;
}

function goAwayLink(
  { loadedData, propsData },
  { extraParams = {}, urlPostfix = '', idPrefix = '' },
) {
  let url = settings.chartsEndpoint + urlPostfix;

  const id = (loadedData && loadedData.entryId) || propsData.id;

  url += id ? idPrefix + id : propsData.source;

  const query = URI.makeQueryString({ ...propsData.usedParams, ...extraParams });

  return url + query;
}

// обернуть в массив одиночные значения
export function wrapToArray(value = '') {
  return Array.isArray(value) ? value : [value];
}

// достать значения из массивов в 1 элемент, иначе выполнить distinct/uniq + убрать пустые значения
export function unwrapFromArray(array) {
  if (Array.isArray(array)) {
    return array.length === 1 ? array[0] : [...new Set(array.filter(Boolean))];
  }
  return array;
}

export function removeEmptyProperties(obj) {
  return Object.entries(obj).reduce((result, [key, value]) => {
    if (value !== null && value !== undefined) {
      result[key] = value;
    }
    return result;
  }, {});
}

export { getRandomString, fetchScript, numberFormat, goAwayLink };
