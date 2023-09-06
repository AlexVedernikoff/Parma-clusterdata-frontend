import React, { useEffect, useState } from 'react';
import { CastIconsFactory } from '@clustrum-lib/shared/ui/cast-icons-factory';
import Dialog from '@kamatech-data-ui/common/src/components/Dialog/Dialog';
import cloneDeep from 'lodash/cloneDeep';

import { Toaster } from '@kamatech-data-ui/common/src';
import { DialogPivotTableProps, IItem, ISubTotalsSettings } from './types';
import { NOTIFY_TYPES } from '@kamatech-data-ui/clustrum/src/constants/common';
import { DialogPivotTableBody } from './DialogPivotTableBody';

const toaster = new Toaster();

export const DialogPivotTable = <T extends IItem>(
  props: DialogPivotTableProps<T>,
): JSX.Element => {
  const { item, callback } = props;
  const [subTotalsSettings, setSubTotalsSettings] = useState<ISubTotalsSettings>({});
  const [formulaError, setFormulaError] = useState<{} | null>(null);

  useEffect(() => {
    setSubTotalsSettings(item.subTotalsSettings ?? {});
  }, [item]);

  const clearFormulaField = () => {
    setSubTotalsSettings(prevValue => ({ ...prevValue, formula: '' }));
    setFormulaError(null);
  };

  const onApplay = () => {
    if (formulaError) {
      console.error(formulaError);
      toaster.createToast({
        title: 'Сохранение невозможно, некорректная формура расчета итогов',
        type: NOTIFY_TYPES.ERROR,
        allowAutoHiding: true,
        actions: [
          {
            label: 'Сбросить формулу',
            onClick: clearFormulaField,
          },
        ],
      });
      return;
    }
    const newItem = cloneDeep(item);
    newItem.subTotalsSettings = subTotalsSettings;
    callback(newItem);
  };

  return (
    <Dialog visible onClose={callback}>
      <div className={`dialog-filter dialog-filter-${item.type?.toLowerCase()}`}>
        <Dialog.Header
          caption={item.title}
          insertBefore={<CastIconsFactory iconType={item.cast} />}
        />
        <Dialog.Body>
          <DialogPivotTableBody
            subTotalsSettings={subTotalsSettings}
            setSubTotalsSettings={setSubTotalsSettings}
            clearFormulaField={clearFormulaField}
            setFormulaError={setFormulaError}
            toaster={toaster}
            {...props}
          />
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
