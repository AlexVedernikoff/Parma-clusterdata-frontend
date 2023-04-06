export const getSearchParam = (name: string): string => {
  const searchParams = new URLSearchParams(window.location.search);
  const param = searchParams.get(name);

  return param ? decodeURIComponent(param) : '';
};
