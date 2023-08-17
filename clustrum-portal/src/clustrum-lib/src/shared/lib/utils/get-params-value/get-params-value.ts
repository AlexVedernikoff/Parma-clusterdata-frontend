const paramsValue = (
  params: { [key: string]: { value: string | string[] } },
  paramKey: string,
): unknown => {
  if (params[paramKey].value === null || params[paramKey].value === undefined) {
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
