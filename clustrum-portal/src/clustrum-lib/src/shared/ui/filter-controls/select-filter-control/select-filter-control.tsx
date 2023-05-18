import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Select } from 'antd';
import { Content } from './types/content';
import { useDebounce } from '../../../lib/hooks/use-debounce/use-debounce';
import './select-filter-control.css';

export interface SelectFilterControlProps {
  label: string;
  content: Content[];
  value?: string | string[];
  multiselect?: boolean;
  searchable?: boolean;
  className?: string;
  onChange: (value: string | string[]) => void;
}

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
    onChange(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className="select-filter-control">
      <label className="select-filter-control__label">
        {`${label}:`}
        <Select
          className={cn('select-filter-control__select', className)}
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
        />
      </label>
    </div>
  );
}
