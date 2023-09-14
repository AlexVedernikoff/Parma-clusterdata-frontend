export interface MemoizedHandlers {
  defaultChangeHandler: {
    param: string;
    memoizedHandleFn: ((value: string) => void) | null;
  };
  selectChangeHandler: {
    param: string;
    memoizedHandleFn: ((value: string | string[]) => void) | null;
  };
  inputChangeHandler: {
    param: string;
    fieldDataType: string;
    memoizedHandleFn: ((value: string) => void) | null;
  };
  rangeDatepickerChangeHandler: {
    param: string;
    memoizedHandleFn: ((value: string) => void) | null;
  };
}
