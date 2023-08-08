const iframeParamNames = [
  'hideHeader',
  'hideSubHeader',
  'hideTabs',
  'hideEdit',
  'enableCaching',
  'cacheMode',
  'exportMode',
  'stateUuid',
  'hideRightSideContent',
];

export const replaceIframeParams = (buildProps: Record<string, unknown> = {}): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dl = (window as any).DL;

  iframeParamNames.forEach(param => {
    delete dl[param];

    if (buildProps[param]) {
      dl[param] = buildProps[param];
    }
  });
};
