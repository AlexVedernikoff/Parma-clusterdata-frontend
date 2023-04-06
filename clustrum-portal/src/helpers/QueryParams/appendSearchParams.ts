export const appendSearchParams = (search: string, params: { [key: string]: string }): string => {
  const searchParams = new URLSearchParams(search);

  Object.keys(params).forEach(key => searchParams.set(key, params[key]));

  return searchParams.toString();
};
