export const MEASURE_TYPE = {
  ABSOLUTE: 'absolute',
  RELATIVE: 'relative',
  EMPTY: 'empty',
};

export const DIAGRAM_MAGNITUDE_ITEMS = [
  {
    label: 'Абсолютные значения',
    value: MEASURE_TYPE.ABSOLUTE,
  },
  {
    label: 'Проценты',
    value: MEASURE_TYPE.RELATIVE,
  },
  {
    label: 'Не отображать',
    value: MEASURE_TYPE.EMPTY,
  },
];
