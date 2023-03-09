import URI from '../uri/uri';
import stringify from 'qs/lib/stringify';

function _getSourceType(url) {
    const match = url.match(/\/_((?:(?!\/).)*).*/);
    return match ? match[1] : 'stat';
}

function _getSourceUrl(url) {
    // TODO: попробовать убрать 'api', 'v3'
    const isStatSource = ['api', 'v2', 'v3'].some((prefix) => url.indexOf(`/_${prefix}`) === 0);
    // const isStatSource = url.search(/^\/_(api|v2|v3|v4)\//) === 0;
    if (!isStatSource && url.indexOf('/_') === 0) {
        return url;
    }
    return `/_stat${url.replace(/^\/?/, '/')}`;
}

function _normalizeSource(source) {
    const result = typeof source === 'string' ?
        {
            type: _getSourceType(_getSourceUrl(source)),
            url: _getSourceUrl(source),
            method: 'get'
        } :
        {
            type: source.sourceType || _getSourceType(source.url),
            url: source.url,
            method: source.method || 'get'
        };

    if (source.data) {
        switch (source.format) {
            case 'text':
                result.data = typeof source.data === 'string' ? source.data : stringify(source.data);
                break;
            case 'json':
            default:
                result.data = source.data;
        }
    }

    // добавление параметра для кэширования, если задано непустое время кэширования
    if (source.cache) {
        const url = new URI(result.url);
        url.setParam('_sp_cache_duration', source.cache);
        result.url = result.toString();
    }

    return result;
}

function normalizeSources(sources = {}) {
    return Object.keys(sources).reduce((result, key) => {
        // источник может быть null
        if (sources[key]) {
            result[key] = _normalizeSource(sources[key]);
        }
        return result;
    }, {});
}

export {normalizeSources};
