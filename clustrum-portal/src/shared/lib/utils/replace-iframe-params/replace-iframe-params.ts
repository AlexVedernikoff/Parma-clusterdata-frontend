const redundantParams = [
  'hideHeader',
  'hideSubHeader',
  'hideTabs',
  'hideEdit',
  'enableCaching',
  'cacheMode',
  'exportMode',
  'stateUuid',
];

export const replaceIframeParams = (newParams: { [key: string]: any } = {}): void => {
  const currentParams = Object.entries((window as any).DL).reduce(
    (res, [key, value]) =>
      redundantParams.includes(key) ? res : { ...res, [key]: value },
    {},
  );

  (window as any).DL = {
    ...currentParams,
    ...newParams,
  };
};
