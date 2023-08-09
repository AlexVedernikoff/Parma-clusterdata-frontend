export const getUniqueId = (prefix = 'id'): string => {
  return `${prefix}-${Date.now()}`;
};
