import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Select } from 'antd';
import { SelectFilterControlProps } from './types';
import { useDebounce } from '../../../lib/hooks/use-debounce/use-debounce';
import { SelectAllBtn } from './select-all-btn';

import './select-filter-control.css';

export function SelectFilterControl({
  multiselect = false,
  searchable = true,
  value = [],
  content,
  onChange,
  label,
  className,
}: SelectFilterControlProps): JSX.Element {
  const [currentValue, setCurrentValue] = useState<string | string[]>(value);
  const debouncedValue = useDebounce(currentValue, 500);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  const handleSelectAll = (): void => {
    const allValues = content.map(({ value }) => value);
    const isAllItemsSelected =
      Array.isArray(currentValue) && allValues.length === currentValue.length;
    if (isAllItemsSelected) {
      setCurrentValue([]);
    } else {
      setCurrentValue(allValues);
    }
  };

  return (
    <div className={classNames('select-filter-control', className)}>
      <label className="select-filter-control__label">
        {`${label}:`}
        <Select
          className="select-filter-control__select"
          mode={multiselect ? 'multiple' : undefined}
          maxTagCount="responsive"
          allowClear={multiselect}
          showSearch={searchable}
          value={currentValue}
          options={content.map(({ title, value }) => ({
            value,
            title,
            key: value,
          }))}
          onChange={setCurrentValue}
          onSelect={(newValue: string): void => {
            if (!multiselect && newValue === currentValue) {
              setCurrentValue([]);
            }
          }}
          dropdownRender={(menu): React.ReactElement => (
            <>
              {multiselect && <SelectAllBtn onClick={handleSelectAll} />}
              {menu}
            </>
          )}
        />
      </label>
    </div>
  );
}
