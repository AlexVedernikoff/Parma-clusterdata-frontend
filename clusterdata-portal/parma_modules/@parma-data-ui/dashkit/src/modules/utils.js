import _get from 'lodash/get';

export function matchParamsWithAliases({ aliases, namespace, params, initiatorItem }) {
  const aliasesByNamespace = _get(aliases, [namespace], []);
  return Object.keys(params).reduce((matchedParams, paramKey) => {
    const paramValue = params[paramKey];
    const collectAliasesParamsKeys = aliasesByNamespace.reduce(
      (collect, group) => {
        return group.includes(paramKey) ? collect.concat(group) : collect;
      },
      [paramKey],
    );
    return {
      ...matchedParams,
      ...collectAliasesParamsKeys.reduce((acc, matchedKey) => {
        return {
          ...acc,
          [matchedKey]: {
            value: paramValue,
            initiatorItem,
          },
        };
      }, {}),
    };
  }, {});
}

function paramsValue(params, paramKey) {
  if (params[paramKey].value === null || params[paramKey].value === undefined) {
    return params[paramKey];
  }

  return params[paramKey].value;
}

export function getParamsValue(params) {
  return Object.keys(params).reduce((acc, paramKey) => {
    return {
      ...acc,
      [paramKey]: paramsValue(params, paramKey),
    };
  }, {});
}
