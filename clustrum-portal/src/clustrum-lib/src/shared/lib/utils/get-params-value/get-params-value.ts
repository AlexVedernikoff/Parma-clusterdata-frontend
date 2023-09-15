const paramsValue = (
  params: { [key: string]: { value: string | string[] } },
  paramKey: string,
): unknown => {
  if (!('value' in params[paramKey])) {
    return params[paramKey];
  }

  return params[paramKey].value;
};

export const getParamsValue = (params: {
  [key: string]: { value: string | string[] };
}): { [key: string]: string | string[] } => {
  return Object.keys(params).reduce((acc, paramKey) => {
    return {
      ...acc,
      [paramKey]: paramsValue(params, paramKey),
    };
  }, {});
};
