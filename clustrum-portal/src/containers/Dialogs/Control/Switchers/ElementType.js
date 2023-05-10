import React from 'react';
import PropTypes from 'prop-types';

import { YCSelect } from '@kamatech-data-ui/common/src';

import withWrap from '../withWrap/withWrap';

import { ELEMENT_TYPE } from '../constants';

const ITEMS = [
  {
    value: ELEMENT_TYPE.SELECT,
    get title() {
      return 'Список';
    },
  },
  {
    value: ELEMENT_TYPE.DATE,
    get title() {
      return 'Календарь';
    },
  },
  {
    value: ELEMENT_TYPE.INPUT,
    get title() {
      return 'Поле ввода';
    },
  },
];

function ElementType(props) {
  return (
    <YCSelect
      showSearch={false}
      value={props.elementType}
      onChange={props.onChange}
      items={ITEMS.map(({ value, title }) => ({
        value,
        title,
        key: value,
      }))}
    />
  );
}

ElementType.propTypes = {
  elementType: PropTypes.oneOf(Object.values(ELEMENT_TYPE)),
  onChange: PropTypes.func.isRequired,
};

export default withWrap(ElementType);

export { ELEMENT_TYPE };
