import React from 'react';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import { Spin } from 'antd';
import { CancelToken, CancelTokenSource } from 'axios';

import { CONTROL_SOURCE_TYPE } from '../../../../../constants/constants';

import { SDK } from '../../../../../modules/sdk';
import { getParamsValue } from '@kamatech-data-ui/utils/param-utils';
import {
  InputFilterControl,
  SelectFilterControl,
  DatepickerFilterControl,
  RangeDatepickerFilterControl,
} from './filter-controls';

import { PickerValue } from '@lib-shared/ui/dashboard-factory/filter-controls/range-datepicker-filter-control/types';
import { convertToPartialMatchValue, convertToPlainValue } from './lib/helpers';
import styles from './style.module.css';
import {
  FilterFactoryControlsProps,
  LoadStatus,
  ControlType,
  DateParams,
  LoadedDataScheme,
  LoadedData,
  ActualParamsReturnType,
  ControlState,
  MemoizedHandlers,
} from './types';

export class FilterFactoryControls extends React.PureComponent<
  FilterFactoryControlsProps
> {
  state: ControlState = {
    status: LoadStatus.Pending,
    scheme: null,
    loadedData: null,
    usedParams: null,
  };

  componentDidMount(): void {
    this.init();
  }

  componentDidUpdate(prevProps: FilterFactoryControlsProps): void {
    const { data } = this.props;

    if (!isEqual(data, prevProps.data)) {
      this.init();
    }
  }

  componentWillUnmount(): void {
    this._isUnmounted = true;
    this.cancelCurrentRequests();
  }

  _isUnmounted = false;
  _cancelSource: CancelTokenSource | null = null;
  _memoizedHandlers: MemoizedHandlers = {
    defaultChangeHandler: {
      param: '',
      memoizedHandleFn: null,
    },
    selectChangeHandler: {
      param: '',
      memoizedHandleFn: null,
    },
    inputChangeHandler: {
      param: '',
      fieldDataType: '',
      memoizedHandleFn: null,
    },
    rangeDatepickerChangeHandler: {
      param: '',
      memoizedHandleFn: null,
    },
  };

  get actualParams(): ActualParamsReturnType {
    const { params, defaults } = this.props;

    return pick(getParamsValue(params), Object.keys(defaults));
  }

  _createDefaultChangeHandler(param: string): ((val: string) => void) | null {
    const handler = this._memoizedHandlers.defaultChangeHandler;

    if (handler.param === param) {
      return handler.memoizedHandleFn;
    }

    handler.param = param;
    handler.memoizedHandleFn = (value: string): void =>
      this.onChange(handler.param, value);
    return handler.memoizedHandleFn;
  }

  _createSelectChangeHandler(param: string): ((val: string | string[]) => void) | null {
    const handler = this._memoizedHandlers.selectChangeHandler;

    if (handler.param === param) {
      return handler.memoizedHandleFn;
    }

    handler.param = param;
    handler.memoizedHandleFn = (value: string | string[]): void =>
      this.onChange(handler.param, value);
    return handler.memoizedHandleFn;
  }

  _createInputChangeHandler(
    param: string,
    fieldDataType: string,
  ): ((val: string) => void) | null {
    const handler = this._memoizedHandlers.inputChangeHandler;

    if (handler.param === param && handler.fieldDataType === fieldDataType) {
      return handler.memoizedHandleFn;
    }

    handler.param = param;
    handler.fieldDataType = fieldDataType;
    handler.memoizedHandleFn = (value: string): void => {
      this.onChange(
        handler.param,
        convertToPartialMatchValue(value, handler.fieldDataType),
      );
    };

    return handler.memoizedHandleFn;
  }

  _createRangeDatepickerChangeHandler(
    param: string,
  ): ((value: PickerValue) => void) | null {
    const handler = this._memoizedHandlers.rangeDatepickerChangeHandler;

    if (handler.param === param) {
      return handler.memoizedHandleFn;
    }

    handler.param = param;
    handler.memoizedHandleFn = (value: PickerValue): void => {
      const newValue = value.from && value.to ? `${value.from}_${value.to}` : '';
      this.onChange(handler.param, newValue);
    };

    return handler.memoizedHandleFn;
  }

  reload(): void {
    this.setState({ status: LoadStatus.Pending });
    this.init();
  }

  getCancelToken(): CancelToken {
    this._cancelSource = SDK.createCancelSource();
    return this._cancelSource.token;
  }

  cancelCurrentRequests(): void {
    if (this._cancelSource) {
      this._cancelSource.cancel('DASHKIT_CONTROL_CANCEL_CURRENT_REQUESTS');
    }
  }

  async init(): Promise<void> {
    try {
      const { data } = this.props;

      const cancelToken = await this.getCancelToken();

      const loadedData: LoadedData =
        data.sourceType === CONTROL_SOURCE_TYPE.EXTERNAL
          ? await SDK.runDashChart({
              id: data.external?.entryId,
              params: this.actualParams,
              cancelToken,
            })
          : await SDK.runDashControl({ shared: data, cancelToken });

      const { usedParams, uiScheme: scheme } = loadedData;

      if (this._isUnmounted) {
        return;
      }

      this.initAvailableItems(scheme);

      this.setState({
        status: LoadStatus.Success,
        scheme,
        usedParams: Object.keys(usedParams),
        loadedData,
      });
    } catch (error) {
      console.error('DASHKIT_CONTROL_RUN', error);
      if (this._isUnmounted) {
        return;
      }
      this.setState({ status: LoadStatus.Fail, loadedData: null });
    }
  }

  initAvailableItems(scheme: LoadedDataScheme[]): void {
    const { params } = this.props;

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
  }

  onChange(param: string, value: string | string[]): void {
    const { onStateAndParamsChange } = this.props;

    onStateAndParamsChange({ params: { [param]: value } });
  }

  renderStateProccesing(): JSX.Element | null {
    const { status } = this.state;

    switch (status) {
      case LoadStatus.Pending:
        return (
          <div className={styles['dashkit-plugin-control']}>
            <Spin />
          </div>
        );
      case LoadStatus.Fail:
        return (
          <div className={styles['dashkit-plugin-control']}>
            <span className={styles['dashkit-plugin-control__error']}>
              Произошла ошибка
            </span>
          </div>
        );

      default:
        return null;
    }
  }

  render(): JSX.Element | null {
    const { status, scheme } = this.state;
    if ([LoadStatus.Pending, LoadStatus.Fail].includes(status)) {
      return this.renderStateProccesing();
    }

    if (!scheme) {
      return null;
    }

    return (
      <div className={styles['dashkit-plugin-control']}>
        {scheme.map(control => {
          const { param, type, fieldDataType } = control;

          if (!Object.keys(this.actualParams).includes(param)) {
            return null;
          }

          const props = {
            ...control,
            fieldDataType,
            className: styles['dashkit-plugin-control__item'],
            key: param,
          };

          switch (type) {
            case ControlType.Select:
              return (
                <SelectFilterControl
                  onChange={this._createSelectChangeHandler(param)}
                  defaultValue={this.actualParams[param] as string | string[]}
                  {...props}
                />
              );
            case ControlType.Input:
              return (
                <InputFilterControl
                  onChange={this._createInputChangeHandler(param, props.fieldDataType)}
                  defaultValue={convertToPlainValue(
                    this.actualParams[param] as string,
                    props.fieldDataType,
                  )}
                  {...props}
                />
              );
            case ControlType.Datepicker:
              return (
                <DatepickerFilterControl
                  onChange={this._createDefaultChangeHandler(param)}
                  defaultValue={this.actualParams[param] as DateParams}
                  {...props}
                />
              );
            case ControlType.RangeDatepicker:
              return (
                <RangeDatepickerFilterControl
                  onChange={this._createRangeDatepickerChangeHandler(param)}
                  defaultValue={this.actualParams[param] as DateParams}
                  {...props}
                />
              );
          }

          return null;
        })}
      </div>
    );
  }
}
