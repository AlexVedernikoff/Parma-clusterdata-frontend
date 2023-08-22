import isEqual from 'lodash/isEqual';

import { getParamsValue } from '@clustrum-lib';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function isPropsTheSame(prevProps, newProps) {
  const { id, source, params, forceUpdate, editMode, paginateInfo, orderBy } = newProps;
  return (
    (forceUpdate || forceUpdate === prevProps.forceUpdate) &&
    prevProps.id === id &&
    prevProps.source === source &&
    isEqual(getParamsValue(prevProps.params), getParamsValue(params)) &&
    isEqual(prevProps.editMode, editMode) &&
    isEqual(prevProps.paginateInfo, paginateInfo) &&
    isEqual(prevProps.orderBy, orderBy)
  );
}
