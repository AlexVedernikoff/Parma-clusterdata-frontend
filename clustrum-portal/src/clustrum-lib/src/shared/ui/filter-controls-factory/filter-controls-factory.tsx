import React from 'react';

import {
  InputFilterControl,
  SelectFilterControl,
  DatepickerFilterControl,
  RangeDatepickerFilterControl,
} from './filter-controls';

import { PickerValue } from './filter-controls/range-datepicker-filter-control/types';
import { convertToPartialMatchValue, convertToPlainValue } from './lib/helpers';
import styles from './filter-controls-factory.module.css';
import {
  FilterControlsFactoryProps,
  ControlType,
  DateParams,
  MemoizedHandlers,
} from './types';

export class FilterControlsFactory extends React.PureComponent<
  FilterControlsFactoryProps
> {
  memoizedHandlers: MemoizedHandlers = {
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

  handleChangeDefault(param: string): ((val: string) => void) | null {
    const handler = this.memoizedHandlers.defaultChangeHandler;

    if (handler.param === param) {
      return handler.memoizedHandleFn;
    }

    handler.param = param;
    handler.memoizedHandleFn = (value: string): void =>
      this.onChange(handler.param, value);
    return handler.memoizedHandleFn;
  }

  handleChangeSelect(param: string): ((val: string | string[]) => void) | null {
    const handler = this.memoizedHandlers.selectChangeHandler;

    if (handler.param === param) {
      return handler.memoizedHandleFn;
    }

    handler.param = param;
    handler.memoizedHandleFn = (value: string | string[]): void =>
      this.onChange(handler.param, value);
    return handler.memoizedHandleFn;
  }

  handleChangeInput(
    param: string,
    fieldDataType: string,
  ): ((val: string) => void) | null {
    const handler = this.memoizedHandlers.inputChangeHandler;

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

  handleChangeRangeDatepicker(param: string): ((value: PickerValue) => void) | null {
    const handler = this.memoizedHandlers.rangeDatepickerChangeHandler;

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

  onChange(param: string, value: string | string[]): void {
    const { onStateAndParamsChange } = this.props;

    onStateAndParamsChange({ params: { [param]: value } });
  }

  render(): JSX.Element | null {
    const { scheme, getActualParams } = this.props;

    if (!scheme) {
      return null;
    }

    const actualParams = getActualParams();

    return (
      <div className={styles['filter-controls-factory']}>
        {scheme.map(control => {
          const { param, type, fieldDataType } = control;

          if (!Object.keys(getActualParams()).includes(param)) {
            return null;
          }

          const props = {
            ...control,
            fieldDataType,
            className: styles['filter-controls-factory__control'],
            key: param,
          };

          switch (type) {
            case ControlType.Select:
              return (
                <SelectFilterControl
                  onChange={this.handleChangeSelect(param)}
                  defaultValue={actualParams[param] as string | string[]}
                  {...props}
                />
              );
            case ControlType.Input:
              return (
                <InputFilterControl
                  onChange={this.handleChangeInput(param, props.fieldDataType)}
                  defaultValue={convertToPlainValue(
                    actualParams[param] as string,
                    props.fieldDataType,
                  )}
                  {...props}
                />
              );
            case ControlType.Datepicker:
              return (
                <DatepickerFilterControl
                  onChange={this.handleChangeDefault(param)}
                  defaultValue={actualParams[param] as DateParams}
                  {...props}
                />
              );
            case ControlType.RangeDatepicker:
              return (
                <RangeDatepickerFilterControl
                  onChange={this.handleChangeRangeDatepicker(param)}
                  defaultValue={actualParams[param] as DateParams}
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
