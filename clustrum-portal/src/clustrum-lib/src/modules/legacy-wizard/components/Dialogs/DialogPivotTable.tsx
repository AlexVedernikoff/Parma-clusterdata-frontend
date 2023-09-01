import React, { useCallback, useEffect, useState } from 'react';
import Dialog from '@kamatech-data-ui/common/src/components/Dialog/Dialog';
import { CastIconsFactory } from '@clustrum-lib/shared/ui/cast-icons-factory';
import { FormulaEditor } from '@kamatech-data-ui/clustrum/src/components/FieldEditor/components';
import cloneDeep from 'lodash/cloneDeep';
// TODO разобраться с ошибкой импорта в TS
// @ts-ignore
import { CheckBox } from 'lego-on-react';
import { DialogPivotTableProps, IItem, ISubTotalsSettings } from './types';

export const DialogPivotTable = <T extends IItem>({
  item,
  callback,
  sdk,
  fields,
  aceModeUrl,
}: DialogPivotTableProps<T>): JSX.Element => {
  const [needSubTotal, setNeedSubTotal] = useState<boolean>(false);
  const [formula, setFormula] = useState<string>('');
  const [formulaError, setFormulaError] = useState<{} | null>(null);
  const { datasetId } = item;

  useEffect(() => {
    setNeedSubTotal(item.subTotalsSettings?.needSubTotal ?? false);
    setFormula(item.subTotalsSettings?.formula || item.formula || '');
  }, [item]);

  const switchEnabled = useCallback(() => setNeedSubTotal(prevValue => !prevValue), []);
  const onApplay = useCallback(() => {
    if (formulaError) {
      console.error(formulaError);
      return;
    }
    const newItem = cloneDeep(item);
    const subTotalsSettings: ISubTotalsSettings = newItem.subTotalsSettings ?? {};
    subTotalsSettings.needSubTotal = needSubTotal;
    subTotalsSettings.formula = formula;
    newItem.subTotalsSettings = subTotalsSettings;
    callback(newItem);
  }, [needSubTotal, item, formula]);

  const validateFormula = useCallback(async (formula: string) => {
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
        setFormula(formula);
        setFormulaError(null);
      }
    } catch (error) {
      setFormulaError(error as {});
    }
  }, []);

  return (
    <Dialog visible onClose={callback}>
      <div className={`dialog-filter dialog-filter-${item.type?.toLowerCase()}`}>
        <Dialog.Header
          caption={item.title}
          insertBefore={<CastIconsFactory iconType={item.cast} />}
        />
        <Dialog.Body>
          <div className="dialog-pivot-table-container">
            <div className="subcontainer">
              <div className="subitem">
                <CheckBox
                  theme="normal"
                  size="n"
                  view="default"
                  tone="default"
                  checked={needSubTotal}
                  text="Подытоги"
                  onChange={switchEnabled}
                />
              </div>
            </div>
            <FormulaEditor
              sdk={sdk}
              isNewField={false}
              datasetId={datasetId}
              formula={formula}
              fields={fields}
              isVisibleFunctionManual={false}
              aceModeUrl={aceModeUrl}
              onChange={validateFormula}
            />
          </div>
        </Dialog.Body>
        <Dialog.Footer
          preset="default"
          onClickButtonCancel={callback}
          onClickButtonApply={onApplay}
          textButtonApply="Применить"
          textButtonCancel="Отменить"
          listenKeyEnter
          hr={false}
        />
      </div>
    </Dialog>
  );
};
