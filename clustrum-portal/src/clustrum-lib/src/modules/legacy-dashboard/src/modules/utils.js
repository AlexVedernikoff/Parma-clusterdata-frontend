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
