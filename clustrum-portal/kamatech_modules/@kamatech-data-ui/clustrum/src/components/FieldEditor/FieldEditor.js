import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import uuid from 'uuid/v1';
import _debounce from 'lodash/debounce';
import { Button, RadioButton, Tooltip } from 'lego-on-react';
import { Dialog } from '@kamatech-data-ui/common/src';

import { ConfirmationDialog, FieldSettingsEditor } from './components';
import DatasetSDK from '../../libs/datasetSdk';

import { ControlSourceType } from '@clustrum-lib/shared/types';
import { DATASET_JOIN_TYPE } from '../../../../../../src/containers/Dataset/dataset_join_type';
import { DATASET_ARRAY_JOIN_TYPE } from '../../../../../../src/containers/Dataset/dataset_array_join_type';
import Dataset from '../../../../../../src/containers/Dialogs/Control/Switchers/Dataset';
import DatasetField from '../../../../../../src/containers/Dialogs/Control/Switchers/DatasetField/DatasetField';

import YCSelect from '../../../../common/src/components/YCSelect/YCSelect';
import AceEditor from '../AceEditor/AceEditor';
import { CalcModes } from '../../constants/calc-modes';
import {
  SettingsSectionTypes,
  INITIAL_FIELD_PROPERTIES,
  INITIAL_STATE,
} from './lib/const';

const b = block('field-settings-editor');

class FieldEditor extends React.Component {
  static defaultProps = {
    initialType: 'formula',
    onlyFormulaEditor: false,
  };

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    datasetId: PropTypes.string.isRequired,
    aceModeUrl: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    types: PropTypes.array.isRequired,
    sources: PropTypes.array.isRequired,
    sdk: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    onlyFormulaEditor: PropTypes.bool.isRequired,
    modePath: PropTypes.string,
    initialType: PropTypes.oneOf(['direct', 'formula']),
    field: PropTypes.object,
    isVerification: PropTypes.bool,
  };

  static getDerivedStateFromProps(props, state) {
    const {
      visible,
      field: fieldProps,
      fields,
      types,
      sources,
      initialType,
      isVerification,
    } = props;
    const { field: fieldState } = state;

    if (visible && !fieldState) {
      if (fieldProps) {
        return {
          field: fieldProps,
          initialField: fieldProps,
          fields,
          types,
          sources,
          sourceType: ControlSourceType.Dataset,
          settingsSection: isVerification
            ? SettingsSectionTypes.Verification
            : SettingsSectionTypes.Connection,
        };
      } else {
        const guid = uuid();

        return {
          isNewField: true,
          field: {
            ...INITIAL_FIELD_PROPERTIES,
            guid,
            calc_mode: initialType,
          },
          initialField: {
            ...INITIAL_FIELD_PROPERTIES,
            guid,
            calc_mode: initialType,
          },
          sourceType: ControlSourceType.Dataset,
          fields,
          types,
          sources,
        };
      }
    } else if (!visible) {
      return {
        ...INITIAL_STATE,
        isNewField: false,
      };
    }

    return null;
  }

  state = INITIAL_STATE;

  async componentDidUpdate(prevProps) {
    const { visible: visiblePrev } = prevProps;
    const { visible: visible } = this.props;
    const { isNewField } = this.state;

    if (visible && visible !== visiblePrev && !isNewField) {
      this.validateField();
      this.validateFormula();
    }
  }

  _btnApplyRef = React.createRef();
  _btnCancelRef = React.createRef();

  modifyField = (field = {}, options = {}) => {
    const { validate = false, cleanUpFieldErrors = false } = options;

    this.setState({
      field: {
        ...this.state.field,
        ...field,
      },
      errors: {
        ...this.state.errors,
      },
    });

    if (validate) {
      this.debouncedValidateFormula();
    }
    if (cleanUpFieldErrors) {
      this.setState({
        fieldErrors: [],
      });
    }
  };

  clearLinkedDataset = () =>
    this.modifyField({
      linkedDataset: null,
      linkedField: null,
      joinType: null,
    });

  closeFieldEditor = () => {
    const { onClose } = this.props;
    const { field, initialField, fields } = this.state;

    const isEquals = JSON.stringify(field) === JSON.stringify(initialField);

    if (isEquals) {
      if (onClose) {
        onClose({
          result_schema: fields,
          field,
        });
      }
    } else {
      this.toggleConfirmCancelPopup();
    }
  };

  confirmCloseFieldEditor = () => {
    const { onClose } = this.props;
    const { fields, field } = this.state;

    if (onClose) {
      onClose({
        result_schema: fields,
        field,
      });
    }
  };

  isTitleDuplicate = () => {
    const { field: { title: titleCurrent, guid: guidCurrent } = {}, fields } = this.state;

    return fields.some(field => {
      const { title, guid } = field;

      if (guidCurrent === guid) {
        return false;
      } else {
        const titleCurrentPrepared = titleCurrent.toLowerCase().replace(/\s/g, '');
        const titlePrepared = title.toLowerCase().replace(/\s/g, '');

        return titleCurrentPrepared === titlePrepared;
      }
    });
  };

  isTitleEmpty = () => {
    const { field: { title = '' } = {} } = this.state;

    return !title.replace(/\s/g, '');
  };

  isFormulaEmpty = () => {
    const { field: { formula } = {} } = this.state;

    return !formula.replace(/\s/g, '');
  };

  isSourceEmpty = () => {
    const { field: { source } = {} } = this.state;

    return !source;
  };

  validateFormula = async () => {
    const { sdk, visible, datasetId, fields } = this.props;
    const { field } = this.state;
    let validation, isFailedFormulaValidation;

    if (visible) {
      try {
        validation = await sdk.bi.validateFormula({
          dataSetId: datasetId,
          version: 'draft',
          resultSchema: fields,
          field,
        });

        isFailedFormulaValidation = false;
      } catch (error) {
        const { response: { data: { data } = {} } = {} } = error;

        validation = data;
        isFailedFormulaValidation = true;
      }

      const { field_errors: fieldErrors = [] } = validation;

      this.setState({
        fieldErrors,
        errors: {
          ...this.state.errors,
          isFailedFormulaValidation,
        },
      });
    }
  };

  debouncedValidateFormula = _debounce(this.validateFormula, 1000);

  validateField = () => {
    const {
      field: { calc_mode: calcMode },
    } = this.state;

    this.setState({
      errors: {
        ...INITIAL_STATE.errors,
      },
    });
    const isTitleEmpty = this.isTitleEmpty();
    const isTitleDuplicate = this.isTitleDuplicate();

    let isValidField = !isTitleEmpty && !isTitleDuplicate;

    const errors = {
      isTitleEmptyError: isTitleEmpty,
      isTitleDuplicateError: isTitleDuplicate,
    };

    if (calcMode === CalcModes.Direct) {
      const isSourceEmpty = this.isSourceEmpty();
      errors.isSourceEmptyError = isSourceEmpty;

      isValidField = isValidField && !isSourceEmpty;
    }

    this.setState({
      errors: {
        ...this.state.errors,
        ...errors,
      },
    });

    return isValidField;
  };

  saveField = () => {
    const { onSave } = this.props;
    const { fields, field } = this.state;

    const isValidField = this.validateField();

    const fieldsNext = DatasetSDK.modifyField({ field, fields });
    const fieldNext = DatasetSDK.modifyFieldSettings({ field });

    onSave({
      result_schema: fieldsNext,
      field: fieldNext,
    });
  };

  createField = () => {
    const { onCreate } = this.props;
    const { fields, field } = this.state;

    const isValidField = this.validateField();

    if (isValidField) {
      const fieldsNext = DatasetSDK.createField({ field, fields });
      const fieldNext = DatasetSDK.modifyFieldSettings({ field });

      onCreate({
        result_schema: fieldsNext,
        field: fieldNext,
      });
    }
  };

  displayDescriptionInput = () => {
    this.setState({
      isDisplayDescriptionInput: true,
    });
  };

  toggleFormulaManual = () => {
    this.setState({
      isVisibleFunctionManual: !this.state.isVisibleFunctionManual,
    });
  };

  toggleConfirmCancelPopup = () => {
    this.setState({
      isVisibleConfirmCancelPopup: !this.state.isVisibleConfirmCancelPopup,
    });
  };

  getSelectorTitle(name) {
    switch (name) {
      case 'inner_join':
        return 'Пересечение';
      case 'left_join':
        return 'Левое';
      case 'right_join':
        return 'Правое';
      case 'array_join':
        return 'По всем элементам массива';
      case 'array_last_item_join':
        return 'По последнему элементу массива';
      default:
        return 'Объединение';
    }
  }

  listForSelector(data) {
    return data.map(({ name }, index) => ({
      value: name,
      key: `join-${index}`,
      title: this.getSelectorTitle(name),
    }));
  }

  _renderConnection({ type }) {
    const { sourceType } = this.state;
    return (
      <React.Fragment>
        {sourceType === type && (
          <div className={b('switchers')}>{this._renderCommonSwitchers()}</div>
        )}
      </React.Fragment>
    );
  }

  _renderCommonSwitchers() {
    const { sourceType, field } = this.state;
    const { linkedField, linkedDataset, joinType } = field;

    const joinTypeList = this.listForSelector(DATASET_JOIN_TYPE);

    return (
      <React.Fragment>
        <div>
          {sourceType === ControlSourceType.Dataset && (
            <React.Fragment>
              <Dataset
                title="Набор данных"
                datasetId={linkedDataset}
                onClick={linkedDataset =>
                  this.setState(prevState => ({
                    field: {
                      ...prevState.field,
                      linkedDataset: linkedDataset,
                    },
                  }))
                }
                parentBlock={() => b('content-row')}
              />
              <DatasetField
                title="Поле связывания"
                datasetId={linkedDataset}
                fieldId={linkedField}
                onChange={({ fieldId, fieldName }) => {
                  this.setState(prevState => ({
                    field: {
                      ...prevState.field,
                      linkedDataset: linkedDataset,
                      linkedField: fieldId,
                    },
                  }));
                }}
                parentBlock={() => b('content-row')}
              />
              <div className={b('content-row')}>
                <div className={b('label')}>
                  <span>Тип соединения</span>
                </div>
                <YCSelect
                  controlWidth={200}
                  value={joinType}
                  items={joinTypeList}
                  allowEmptyValue={true}
                  onChange={joinType => this.modifyField({ joinType })}
                />
              </div>
              {this._renderArrayJoinType(field)}
              <div className={b('clear-linked')}>
                <Button
                  theme="pseudo"
                  tone="default"
                  view="default"
                  size="m"
                  onClick={() => this.clearLinkedDataset()}
                >
                  Очистить
                </Button>
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }

  _renderArrayJoinType(field) {
    const { hasArray, arrayJoinType } = field;

    const arrayJoinTypeList = this.listForSelector(DATASET_ARRAY_JOIN_TYPE);

    if (!hasArray) {
      return null;
    }

    return (
      <div className={b('content-row')}>
        <div className={b('label')}>
          <span>Тип условия соединения для массивов</span>
        </div>
        <YCSelect
          controlWidth={200}
          value={arrayJoinType}
          items={arrayJoinTypeList}
          allowEmptyValue={true}
          onChange={arrayJoinType => this.modifyField({ arrayJoinType })}
        />
      </div>
    );
  }

  _renderVerification() {
    const { aceModeUrl, modePath } = this.props;
    const { verification_rules } = this.state.field;

    return (
      <React.Fragment>
        <div className={b('verification-container')}>
          <div className={b('verification-title')}>Список правил</div>
          <div className={b('verification-editor')}>
            <AceEditor
              onChange={verification_rules => this.modifyField({ verification_rules })}
              formula={verification_rules !== undefined ? verification_rules : ''}
              annotations={[]}
              aceModeUrl={aceModeUrl}
              modePath={modePath}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  _renderSettingsSections() {
    const { settingsSection } = this.state;

    return (
      <React.Fragment>
        <div className={b('content-row')}>
          <div className={b('settings-section')}>
            <RadioButton
              theme="normal"
              size="s"
              view="default"
              tone="default"
              value={settingsSection}
              onChange={e => {
                this.setState({ settingsSection: e.target.value });
              }}
            >
              <RadioButton.Radio value={SettingsSectionTypes.Connection}>
                Связывание
              </RadioButton.Radio>
              <RadioButton.Radio value={SettingsSectionTypes.Verification}>
                Верификация и сопоставление
              </RadioButton.Radio>
            </RadioButton>
          </div>
        </div>
        {settingsSection === SettingsSectionTypes.Connection &&
          this._renderConnection({
            type: ControlSourceType.Dataset,
          })}
        {settingsSection === SettingsSectionTypes.Verification &&
          this._renderVerification()}
      </React.Fragment>
    );
  }

  render() {
    const { visible } = this.props;
    const {
      field: { calc_mode: calcMode } = {},
      isNewField,
      isDisabledAction,
      isVisibleConfirmCancelPopup,
      showError,
      errorMessages,
    } = this.state;

    return (
      <Dialog visible={visible} onClose={this.closeFieldEditor}>
        <Dialog.Header caption="Настройка поля" onClose={this.closeFieldEditor} />
        <Dialog.Body>
          <FieldSettingsEditor
            {...this.props}
            {...this.state}
            {...{
              displayDescriptionInput: this.displayDescriptionInput,
              modifyField: this.modifyField,
            }}
          />
          {this._renderSettingsSections()}
        </Dialog.Body>
        <Dialog.Footer
          preset="default"
          progress={this.state.progress}
          onClickButtonCancel={this.closeFieldEditor}
          onClickButtonApply={isNewField ? this.createField : this.saveField}
          textButtonApply={isNewField ? 'Создать' : 'Сохранить'}
          textButtonCancel="Отменить"
          propsButtonCancel={{
            ref: this._btnCancelRef,
          }}
          propsButtonApply={{
            ref: this._btnApplyRef,
            disabled: isDisabledAction,
          }}
        >
          {calcMode === CalcModes.Formula && (
            <Button
              cls={b('btn-manual')}
              theme="normal"
              size="n"
              view="default"
              tone="default"
              text="Справочник"
              onClick={this.toggleFormulaManual}
            />
          )}
        </Dialog.Footer>
        <Tooltip
          theme="error"
          visible={showError}
          anchor={this._btnApplyRef.current}
          to="bottom"
        >
          <div className={b('errors')}>
            {errorMessages.map((errorMessage, index) => (
              <div key={`em-${index}`} className={b('error-message')}>
                {errorMessage}
              </div>
            ))}
          </div>
        </Tooltip>
        <ConfirmationDialog
          isVisible={isVisibleConfirmCancelPopup}
          cancel={this.toggleConfirmCancelPopup}
          confirm={this.confirmCloseFieldEditor}
        />
      </Dialog>
    );
  }
}

export default FieldEditor;
