import React from 'react';
import { FormulaEditor } from '@kamatech-data-ui/clustrum/src/components/FieldEditor/components';

import {
  IItem,
  ISubTotalsSettings,
  MainDialogPivotTableFieldsProps,
  RejectFormulaError,
} from './types';
import { VisualizationType } from '@clustrum-lib/entities/visualization-factory/types';
import { pivotTableDialogFields } from './helper';
import { VisualizationFactory } from '@clustrum-lib/entities/visualization-factory';
import { NotificationType, useCustomNotification } from '@entities/notification';

export const DialogPivotTableBody = <T extends IItem>({
  subTotalsSettings,
  setSubTotalsSettings,
  placeholderType,
  sdk,
  item,
  fields,
  aceModeUrl,
  clearFormulaField,
  setFormulaError,
}: MainDialogPivotTableFieldsProps<T>): JSX.Element => {
  const { datasetId } = item;
  const [openNotification, contextHolder] = useCustomNotification();
  const onChangeFields = (key: keyof ISubTotalsSettings, type: VisualizationType) => (
    value: string | boolean,
  ) =>
    setSubTotalsSettings(prevValue => ({
      ...prevValue,
      [key]: type === VisualizationType.CheckBox ? !prevValue[key] : value,
    }));

  const validateFormula = async (formula: string) => {
    const itemIndex = fields.findIndex((field: T) => field.guid === item.guid);
    item.formula = formula;
    fields[itemIndex] = item;

    try {
      const response = await sdk.bi.validateFormula({
        dataSetId: datasetId,
        version: 'draft',
        resultSchema: fields,
        field: item,
      });
      if (response) {
        setFormulaError(null);
      }
    } catch (error) {
      setFormulaError(error as RejectFormulaError);
      openNotification({
        message: (error as RejectFormulaError).response.data.message,
        type: NotificationType.Error,
        duration: 6,
        actions: [
          {
            label: 'Сбросить формулу',
            onClick: clearFormulaField,
          },
        ],
      });
    }
    setSubTotalsSettings(prevValue => ({ ...prevValue, formula }));
  };

  return (
    <div className="dialog-pivot-table-container">
      {contextHolder}
      <div className="subcontainer">
        {pivotTableDialogFields(placeholderType)
          .filter(({ visible }) => visible)
          .map(({ text, type, id }) => (
            <div key={`${id}__${text}`} className="subitem">
              <VisualizationFactory
                title={type === VisualizationType.TextInput ? text : ''}
                type={type}
                className="subitem"
                containerProps={{
                  theme: 'normal',
                  size: 'n',
                  view: 'default',
                  checked: subTotalsSettings[id],
                  text:
                    type === VisualizationType.TextInput ? subTotalsSettings[id] : text,
                  onChange: onChangeFields(id, type),
                }}
              />
            </div>
          ))}
      </div>
      <FormulaEditor
        sdk={sdk}
        isNewField={false}
        datasetId={item.datasetId}
        formula={subTotalsSettings.formula}
        fields={fields}
        isVisibleFunctionManual={false}
        aceModeUrl={aceModeUrl}
        onChange={validateFormula}
        hidden={true}
      />
    </div>
  );
};
