import { FieldAggregation } from '../../../constants/field-aggregation';

export const SettingsSectionTypes = {
  Connection: 'connection',
  Verification: 'verification',
};

export const INITIAL_FIELD_PROPERTIES = {
  calc_mode: '',
  source: '',
  formula: '',
  cast: 'string',
  type: 'DIMENSION',
  description: '',
  title: '',
  hidden: false,
  aggregation: FieldAggregation.None,
  hasIndex: false,
  hasArray: false,
  hasVersion: false,
  linkedDataset: null,
  linkedField: null,
  joinType: null,
  verification_rules: '',
  spel: '',
};

export const INITIAL_STATE = {
  isVisibleConfirmCancelPopup: false,
  isDisplayDescriptionInput: false,
  isDisabledAction: false,
  showError: false,
  errorMessages: [],
  field: undefined,
  initialField: undefined,
  fields: [],
  types: [],
  sources: [],
  fieldErrors: [],
  isVisibleFunctionManual: false,
  sourceType: '',
  errors: {
    isTitleEmptyError: false,
    isTitleDuplicateError: false,
    isSourceEmptyError: false,
    isFailedFormulaValidation: false,
  },
  settingsSection: SettingsSectionTypes.Connection,
};
