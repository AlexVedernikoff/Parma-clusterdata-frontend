import React, { useEffect, useState } from 'react';
import { CastIconsFactory } from '@clustrum-lib/shared/ui/cast-icons-factory';
import Dialog from '@kamatech-data-ui/common/src/components/Dialog/Dialog';
import cloneDeep from 'lodash/cloneDeep';
import {
  DialogPivotTableProps,
  IItem,
  ISubTotalsSettings,
  RejectFormulaError,
} from './types';
import { DialogPivotTableBody } from './DialogPivotTableBody';
import {
  useCustomNotification,
  NotificationType,
} from '@clustrum-lib/shared/lib/notification';

export const DialogPivotTable = <T extends IItem>(
  props: DialogPivotTableProps<T>,
): JSX.Element => {
  const { item, callback } = props;
  const [subTotalsSettings, setSubTotalsSettings] = useState<ISubTotalsSettings>({});
  const [formulaError, setFormulaError] = useState<RejectFormulaError | null>(null);
  const [openNotification, contextHolder] = useCustomNotification();

  useEffect(() => {
    setSubTotalsSettings(item.subTotalsSettings ?? {});
  }, [item]);

  const clearFormulaField = () => {
    setSubTotalsSettings(prevValue => ({ ...prevValue, formula: '' }));
    setFormulaError(null);
  };

  const onApply = () => {
    if (formulaError) {
      console.error(formulaError);
      openNotification({
        title: 'Сохранение невозможно, некорректная формура расчета итогов',
        key: `${formulaError.response.data.message}`,
        type: NotificationType.Error,
        duration: 6,
        actions: [
          {
            label: 'Сбросить формулу',
            onClick: clearFormulaField,
            isForceCloseAfterClick: true,
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
      {contextHolder}
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
            {...props}
          />
        </Dialog.Body>
        <Dialog.Footer
          preset="default"
          onClickButtonCancel={callback}
          onClickButtonApply={onApply}
          textButtonApply="Применить"
          textButtonCancel="Отменить"
          listenKeyEnter
          hr={false}
        />
      </div>
    </Dialog>
  );
};
