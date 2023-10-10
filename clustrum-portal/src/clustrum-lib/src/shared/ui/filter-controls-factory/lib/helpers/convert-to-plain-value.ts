import { FieldDataType } from '../../types';
import { PARTIAL_MATCH_POSTFIX } from '../constants';

export const convertToPlainValue = (value: string, fieldDataType: string): string => {
  if (fieldDataType === FieldDataType.String && value.includes(PARTIAL_MATCH_POSTFIX)) {
    const regexp = new RegExp(PARTIAL_MATCH_POSTFIX, 'g');

    return value.replace(regexp, '');
  }

  return value;
};
