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
import {
  useCustomNotification,
  NotificationType,
} from '@clustrum-lib/shared/lib/notification';

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
        title: (error as RejectFormulaError).response.data.message,
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
                  checked: subTotalsSettings[id] as boolean,
                  value:
                    type === VisualizationType.TextInput ? subTotalsSettings[id] : text,
                  onChange: onChangeFields(id, type) as any,
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
