import { FieldDataType } from '../../DashboardControlsTypes';
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
