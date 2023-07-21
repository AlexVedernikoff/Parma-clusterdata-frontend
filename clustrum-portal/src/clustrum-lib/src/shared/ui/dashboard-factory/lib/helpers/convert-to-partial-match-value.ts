import { FieldDataType } from '@lib-shared/ui/dashboard-factory/types';
import { PARTIAL_MATCH_POSTFIX } from '../../constants';

export const convertToPartialMatchValue = (
  valueInput: string,
  fieldDataType: string,
): string => {
  if (fieldDataType !== FieldDataType.String) {
    return valueInput;
  }

  return `${valueInput}${PARTIAL_MATCH_POSTFIX}`;
};
