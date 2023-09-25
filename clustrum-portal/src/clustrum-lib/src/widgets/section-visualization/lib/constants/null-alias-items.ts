export const NULL_ALIAS = {
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
    value: NULL_ALIAS.NULL,
  },
  {
    label: 'Пустая строка " "',
    value: NULL_ALIAS.EMPTY,
  },
  {
    label: '"—"',
    value: NULL_ALIAS.DASH,
  },
  {
    label: '"Нет данных"',
    value: NULL_ALIAS.NO_DATA,
  },
  {
    label: '"Не указано"',
    value: NULL_ALIAS.UNDEFINED,
  },
  {
    label: 'Значение "0"',
    value: NULL_ALIAS.ZERO,
  },
];
