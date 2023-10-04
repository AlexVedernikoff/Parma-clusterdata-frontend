import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { Button, CheckBox, RadioButton, TextArea } from 'lego-on-react';
import { Icon, TextInput, YCSelect } from '@kamatech-data-ui/common/src';

import DataTypeIconSelector from '../../../DataTypeIconSelector/DataTypeIconSelector';
//import './FieldSettingsEditor.scss';
import iconPlus from '../../../../icons/plus.svg';

import { FormulaEditor } from '../index';
import { Spel } from './components/Spel';
import { CalcModes } from '../../../../constants/calc-modes';

const b = block('field-settings-editor');

const FieldSettingsEditor = props => {
  const {
    isNewField,
    isVisibleFunctionManual,
    isDisplayDescriptionInput,
    sdk,
    datasetId,
    field,
    aceModeUrl,
    modePath,
    field: {
      aggregation_locked: aggregationLocked,
      calc_mode: calcMode,
      title,
      description,
      formula,
      source,
      cast,
      aggregation,
      hidden,
      spel,
    } = {},
    types = [],
    sources = [],
    fieldErrors: [{ errors: fieldErrors = [] } = {}] = [],
    errors: {
      isTitleEmptyError,
      isTitleDuplicateError,
      // isSourceEmptyError
    } = {},
    displayDescriptionInput,
    fields,
    modifyField,
    onlyFormulaEditor,
  } = props;

  if (!field) {
    return null;
  }

  const isDisplayInWizard = !hidden;
  const isDisplayDescription = description || isDisplayDescriptionInput;

  const { aggregations = [] } = types.find(({ name }) => name === cast) || {};

  const getTitle = str => {
    switch (str) {
      case 'formula':
        return 'Формула';
      case 'spel':
        return 'Формула EL';
      case 'boolean':
        return 'Логический';
      case 'date':
        return 'Дата';
      case 'datetime':
        return 'Дата и время';
      case 'timestamp':
        return 'Отметка времени';
      case 'float':
        return 'Дробное число';
      case 'double':
        return 'Дробное число (64)';
      case 'integer':
        return 'Целое число';
      case 'long':
        return 'Целое число (64)';
      case 'string':
        return 'Строка';
      case 'auto':
        return 'Авто';
      case 'geopoint':
        return 'Геоточка';
      case 'geopolygon':
        return 'Геополигон';
      case 'none':
        return 'Нет';
      case 'count':
        return 'Количество';
      case 'countunique':
        return 'Количество уникальных';
      case 'uniquearray':
        return 'Массив уникальных';
      case 'max':
        return 'Максимум';
      case 'min':
        return 'Минимум';
      case 'avg':
        return 'Среднее';
      case 'sum':
        return 'Сумма';
      default:
        return '';
    }
  };

  const aggregationsList = aggregations.map((aggregation, index) => ({
    value: aggregation,
    key: `select-aggregation-${index}`,
    title: getTitle(aggregation),
  }));

  const fieldTypesList = types.map(({ name }, index) => ({
    value: name,
    key: `select-cast-${index}`,
    title: getTitle(name),
    icon: <DataTypeIconSelector className={b('cast')} type={name} />,
  }));

  const accessibleFieldList = sources.map(({ name, title }, index) => ({
    value: name,
    key: `select-source-${index}`,
    title: title || name,
  }));

  const annotations = fieldErrors.map(({ row, column, message }) => ({
    type: 'error',
    row,
    column,
    text: message,
  }));

  let titleErrorMessage, isTitleError;

  if (isTitleEmptyError || isTitleDuplicateError) {
    isTitleError = true;

    if (isTitleEmptyError) {
      titleErrorMessage = 'Имя поля не должно быть пустым';
    } else if (isTitleDuplicateError) {
      titleErrorMessage = 'Поле с таким именем уже существует';
    }
  }

  const isDisplayElement = !onlyFormulaEditor;
  const fieldsNext = fields;

  const modifySource = source => {
    modifyField({ source });
  };

  const sourceOrEmpty = source => {
    return source === null ? '' : source;
  };

  return (
    <div className={b()}>
      <div className={b('content-row')}>
        <div className={b('label')}>
          <span>Имя</span>
        </div>
        <TextInput
          autoFocus={true}
          cls={b('inp-title')}
          theme="normal"
          size="s"
          view="default"
          tone="default"
          text={title}
          error={isTitleError ? titleErrorMessage : ''}
          onChange={title => modifyField({ title }, { validate: true })}
        />
        {isDisplayElement && (
          <CheckBox
            cls={b('chb-display-in-wizard')}
            theme="normal"
            size="n"
            view="default"
            tone="default"
            checked={!isDisplayInWizard}
            onChange={() => modifyField({ hidden: !hidden })}
            text="Не отображать в визарде"
          />
        )}
        {!isDisplayDescription && (
          <Button
            cls={b('add-description-btn')}
            theme="flat"
            size="n"
            view="default"
            tone="default"
            iconLeft={
              <Icon className={b('plus')} data={iconPlus} width="16" height="16" />
            }
            text="Добавить описание"
            onClick={displayDescriptionInput}
          />
        )}
      </div>
      {isDisplayDescription && (
        <div className={b('content-row')}>
          <div className={b('label', { align: 'top' })}>
            <span>Описание</span>
          </div>
          <TextArea
            rows={3}
            cls={b('inp-description')}
            theme="normal"
            size="s"
            text={description}
            onChange={description => modifyField({ description })}
          />
        </div>
      )}
      {isDisplayElement && (
        <div className={b('content-row')}>
          <div className={b('label')}>
            <span>Источник данных</span>
          </div>
          <RadioButton
            cls={b('rb-calc-mode')}
            theme="normal"
            size="s"
            view="default"
            tone="default"
            value={calcMode}
            onChange={e => modifyField({ calc_mode: e.target.value })}
          >
            <RadioButton.Radio value={CalcModes.Formula}>Формула</RadioButton.Radio>
            <RadioButton.Radio value={CalcModes.Direct}>
              Поле из источника
            </RadioButton.Radio>
            <RadioButton.Radio value={CalcModes.Spel}>Формула EL</RadioButton.Radio>
          </RadioButton>
        </div>
      )}
      {calcMode === CalcModes.Direct && (
        <React.Fragment>
          <div className={b('content-row')}>
            <div className={b('label')}>
              <span>Поле источника</span>
            </div>
            <YCSelect
              showSearch={true}
              allowEmptyValue={true}
              controlWidth={300}
              value={source}
              items={accessibleFieldList}
              onChange={source => modifySource(sourceOrEmpty(source))}
            />
          </div>
          <div className={b('content-row')}>
            <div className={b('label')}>
              <span>Тип поля</span>
            </div>
            <YCSelect
              controlWidth={200}
              showItemIcon={true}
              value={cast}
              items={fieldTypesList}
              onChange={cast => modifyField({ cast })}
            />
          </div>
          <div className={b('content-row')}>
            <div className={b('label')}>
              <span>Агрегация</span>
            </div>
            <YCSelect
              controlWidth={200}
              disabled={aggregationLocked}
              value={aggregation}
              items={aggregationsList}
              onChange={aggregation => modifyField({ aggregation })}
            />
          </div>
        </React.Fragment>
      )}
      {calcMode === CalcModes.Formula && (
        <FormulaEditor
          sdk={sdk}
          isNewField={isNewField}
          datasetId={datasetId}
          formula={formula}
          fields={fieldsNext}
          isVisibleFunctionManual={isVisibleFunctionManual}
          annotations={annotations}
          aceModeUrl={aceModeUrl}
          modePath={modePath}
          onChange={formula =>
            modifyField(
              { formula },
              {
                validate: true,
                cleanUpFieldErrors: true,
              },
            )
          }
        />
      )}
      {calcMode === CalcModes.Spel && (
        <Spel
          spel={spel}
          source={source}
          modifyField={modifyField}
          aceModeUrl={aceModeUrl}
          modePath={modePath}
        />
      )}
    </div>
  );
};

FieldSettingsEditor.propTypes = {
  isVisibleFunctionManual: PropTypes.bool.isRequired,
  isDisplayDescriptionInput: PropTypes.bool.isRequired,
  aceModeUrl: PropTypes.string.isRequired,
  datasetId: PropTypes.string.isRequired,
  types: PropTypes.array.isRequired,
  sources: PropTypes.array.isRequired,
  displayDescriptionInput: PropTypes.func.isRequired,
  modifyField: PropTypes.func.isRequired,
  sdk: PropTypes.object.isRequired,
  modePath: PropTypes.string,
  isNewField: PropTypes.bool,
  onlyFormulaEditor: PropTypes.bool,
  fieldErrors: PropTypes.array,
  fields: PropTypes.array,
  errors: PropTypes.object,
  field: PropTypes.object,
};

FieldSettingsEditor.defaultProps = {
  types: [],
  sources: [],
};

export default FieldSettingsEditor;
