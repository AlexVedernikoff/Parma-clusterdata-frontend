import React, { useCallback, useEffect, useState } from 'react';
import Dialog from '@kamatech-data-ui/common/src/components/Dialog/Dialog';
import { CastIconsFactory } from '@clustrum-lib/shared/ui/cast-icons-factory';
import cloneDeep from 'lodash/cloneDeep';
import { CastIconType } from '@clustrum-lib/shared/ui/cast-icons-factory/types';
// TODO разобраться с ошибкой импорта в TS
// @ts-ignore
import { CheckBox } from 'lego-on-react';

interface ISubTotalsSettings {
  enabled?: boolean;
}

interface IItem {
  title: string;
  cast: CastIconType;
  type: string;
  subTotalsSettings?: ISubTotalsSettings;
}

interface DialogPivotTableProps<T> {
  item: T;
  callback: (item: IItem) => void;
}

export const DialogPivotTable = <T extends IItem>({
  item,
  callback,
}: DialogPivotTableProps<T>): JSX.Element => {
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    setEnabled(item.subTotalsSettings?.enabled ?? false);
  }, [item]);

  const switchEnabled = useCallback(() => setEnabled(prevValue => !prevValue), []);
  const onApplay = useCallback(() => {
    const newItem = cloneDeep(item);
    const subTotalsSettings: ISubTotalsSettings = newItem.subTotalsSettings ?? {};
    subTotalsSettings.enabled = enabled;
    newItem.subTotalsSettings = subTotalsSettings;
    callback(newItem);
  }, [enabled, item]);

  return (
    <Dialog visible onClose={callback}>
      <div className={`dialog-filter dialog-filter-${item.type?.toLowerCase()}`}>
        <Dialog.Header
          caption={item.title}
          insertBefore={<CastIconsFactory iconType={item.cast} />}
        />
        <Dialog.Body>
          <div className="subcontainer">
            <div className="subitem">
              <CheckBox
                theme="normal"
                size="n"
                view="default"
                tone="default"
                checked={enabled}
                text="Подытоги"
                onChange={switchEnabled}
              />
            </div>
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
