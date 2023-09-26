export const NULL_ALIAS_LIST = {
  NULL: 'null',
  EMPTY: 'empty',
  DASH: 'dash',
  NO_DATA: 'no-data',
  UNDEFINED: 'undefined',
  ZERO: 'zero',
};

export const NULL_ALIAS_ITEMS = [
  {
    label: 'Без подписи',
    value: NULL_ALIAS_LIST.NULL,
  },
  {
    label: 'Пустая строка " "',
    value: NULL_ALIAS_LIST.EMPTY,
  },
  {
    label: '"—"',
    value: NULL_ALIAS_LIST.DASH,
  },
  {
    label: '"Нет данных"',
    value: NULL_ALIAS_LIST.NO_DATA,
  },
  {
    label: '"Не указано"',
    value: NULL_ALIAS_LIST.UNDEFINED,
  },
  {
    label: 'Значение "0"',
    value: NULL_ALIAS_LIST.ZERO,
  },
];
