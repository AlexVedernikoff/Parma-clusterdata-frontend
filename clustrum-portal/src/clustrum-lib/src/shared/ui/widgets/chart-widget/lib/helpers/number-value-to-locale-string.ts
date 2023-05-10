export const numberValueToLocaleString = (value: number, maximumFractionDigits = 2): string => {
  return Number(value).toLocaleString(undefined, { maximumFractionDigits });
};
