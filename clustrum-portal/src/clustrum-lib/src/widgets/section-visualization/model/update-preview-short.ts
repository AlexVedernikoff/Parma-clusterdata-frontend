import { Dispatch } from 'redux';
import { updatePreview } from '../../../../../actions';

/* eslint-disable */
export const updatePreviewShort = <T>(
  params: T,
  dispatch: Dispatch,
  paramName?: keyof T,
  param?: T[keyof T],
): void => {
  const obj = { ...params };
  if (param !== null && param !== undefined && paramName) {
    obj[paramName] = param;
  }
  dispatch(updatePreview(obj));
};
