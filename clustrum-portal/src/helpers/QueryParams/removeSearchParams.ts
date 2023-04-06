export const removeSearchParams = (search: string, paramNames: string[]): string => {
  const searchParams = new URLSearchParams(search);

  paramNames.forEach(name => searchParams.delete(name));

  return searchParams.toString();
};
