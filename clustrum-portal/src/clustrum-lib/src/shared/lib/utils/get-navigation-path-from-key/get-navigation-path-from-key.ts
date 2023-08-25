export const getNavigationPathFromKey = (key: string): string => {
  return key.replace(/\/?[^/]*$/g, '') || '/';
};
