import React, { useEffect, useState } from 'react';
import { CancelToken } from 'axios';
import pick from 'lodash/pick';
import { Spin } from 'antd';
import {
  ActualParamsReturnType,
  FilterFactoryControlsProps,
  LoadStatus,
  LoadedData,
  LoadedDataScheme,
} from '@lib-shared/ui/filter-controls-factory/types';
import { ControlSourceType, ItemType } from '@lib-shared/types';
import { FilterFactoryControls } from '@lib-shared/ui/filter-controls-factory';
import { getParamsValue } from '@lib-shared/lib/utils';
import { SDK } from '../../../../../modules/sdk';
import styles from './filter-controls-container.module.css';

function FilterControlsContainer(props: FilterFactoryControlsProps): JSX.Element {
  const [status, setStatus] = useState<LoadStatus>(LoadStatus.Pending);
  const [scheme, setScheme] = useState<LoadedDataScheme[] | null>(null);

  useEffect(() => {
    init();
  }, []);

  const getCancelToken = (): CancelToken => {
    const cancelSource = SDK.createCancelSource();
    return cancelSource.token;
  };

  const initAvailableItems = (scheme: LoadedDataScheme[]): void => {
    const { params } = props;

    for (const control of scheme) {
      const { param } = control;
      const { initiatorItem: item } = params[param];
      if (
        !item.availableItems ||
        !item.availableItems[param] ||
        item.availableItems[param].length === 0
      ) {
        continue;
      }

      const availableItems = new Set(item.availableItems[param]);
      control.content = control.content.filter(
        (it: { title: string; value: string }) =>
          availableItems.has(it.title) || availableItems.has(it.value),
      );
    }
  };

  const actualParams = (): ActualParamsReturnType => {
    const { params, defaults } = props;

    return pick(getParamsValue(params), Object.keys(defaults));
  };

  const init = async (): Promise<void> => {
    try {
      setStatus(LoadStatus.Pending);
      const { data } = props;

      const cancelToken = await getCancelToken();

      const loadedData: LoadedData =
        data.sourceType === ControlSourceType.External
          ? await SDK.runDashChart({
              id: data.external?.entryId,
              params: actualParams(),
              cancelToken,
            })
          : await SDK.runDashControl({ shared: data, cancelToken });

      const { uiScheme: scheme } = loadedData;

      initAvailableItems(scheme);

      setStatus(LoadStatus.Success);
      setScheme(scheme);
    } catch (error) {
      console.error('FILTER_CONTROL_RUN', error);
      setStatus(LoadStatus.Fail);
    }
  };

  if (status === LoadStatus.Pending) {
    return (
      <div className={styles['filter-control']}>
        <Spin />
      </div>
    );
  }

  if (status === LoadStatus.Fail) {
    return (
      <div className={styles['filter-control']}>
        <span className={styles['filter-control__error']}>Произошла ошибка</span>
      </div>
    );
  }

  return (
    <FilterFactoryControls {...props} scheme={scheme} getActualParams={actualParams} />
  );
}

export const filterControlsPlugin = {
  type: ItemType.Control,
  defaultLayout: { w: 8, h: 4 },
  renderer: (props: FilterFactoryControlsProps): JSX.Element =>
    FilterControlsContainer(props),
};
