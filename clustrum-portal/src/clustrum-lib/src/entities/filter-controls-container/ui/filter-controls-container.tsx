import React, { useEffect, useRef, useState } from 'react';
import isMatch from 'lodash/isMatch';
import pick from 'lodash/pick';
import { Spin } from 'antd';
import {
  ActualParamsReturnType,
  DashboardControlsData,
  FilterControlsFactoryProps,
  LoadStatus,
  LoadedDataScheme,
} from '@lib-shared/ui/filter-controls-factory/types';
import { FilterControlsFactory } from '@lib-shared/ui/filter-controls-factory';
import { getParamsValue } from '@lib-shared/lib/utils';
import styles from './filter-controls-container.module.css';
import { filterControlsContainerModel } from '../model/filter-controls-container-model';
import { ParamsProps } from '@lib-shared/ui/filter-controls-factory/types/filter-factory-controls-props';

export function FilterControlsContainer(props: FilterControlsFactoryProps): JSX.Element {
  const { data, defaults, params } = props;

  const [status, setStatus] = useState<LoadStatus>(LoadStatus.Pending);
  const [scheme, setScheme] = useState<LoadedDataScheme[] | null>(null);
  const previousParams = useRef<ParamsProps | null>(null);
  const previousControlData = useRef<DashboardControlsData | null>(null);

  useEffect(() => {
    const isDataChanged = !isMatch(previousControlData.current ?? {}, data);
    const isParamsChanged = !isMatch(previousParams.current ?? {}, params);
    if (isDataChanged || isParamsChanged) {
      init();
    }
    previousControlData.current = data;
    previousParams.current = params;
  }, [data, params]);

  const initAvailableItems = (scheme: LoadedDataScheme[]): void => {
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
    return pick(getParamsValue(params), Object.keys(defaults));
  };

  const init = async (): Promise<void> => {
    try {
      setStatus(LoadStatus.Pending);

      const requestData = { ...data, params };
      const loadedData = await filterControlsContainerModel(requestData, actualParams);

      const { uiScheme: scheme } = loadedData;
      initAvailableItems(scheme);

      setStatus(LoadStatus.Success);
      setScheme(scheme);
    } catch (error) {
      console.error('FILTER_CONTROLS_CONTAINER_RUN', error);
      setStatus(LoadStatus.Fail);
    }
  };

  if (status === LoadStatus.Pending) {
    return (
      <div className={styles['filter-controls-container']}>
        <Spin />
      </div>
    );
  }

  if (status === LoadStatus.Fail) {
    return (
      <div className={styles['ffilter-controls-container']}>
        <span className={styles['filter-controls-container__error']}>
          Произошла ошибка
        </span>
      </div>
    );
  }

  return (
    <FilterControlsFactory {...props} scheme={scheme} getActualParams={actualParams} />
  );
}
