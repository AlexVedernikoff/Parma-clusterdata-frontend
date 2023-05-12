import React from 'react';
import { Select, Space, Form } from 'antd';

interface IContent {
  title: string;
  value: string;
}

interface IselectFilterControlProps {
  label?: string;
  multiselect: boolean;
  searchable: boolean;
  content: IContent[];
  value: string;
  onChange?: (value: string) => void;
  className: string;
}

export const SelectFilterControl: React.FC<IselectFilterControlProps> = props => {
  const { multiselect, searchable = true, value, content, onChange, label } = props;

  return (
    <Space wrap>
      <Form.Item label={label}>
        <Select
          mode={multiselect ? 'multiple' : undefined}
          defaultValue={value}
          onChange={onChange}
          showSearch={searchable}
          options={content.map(({ title, value }) => ({
            value,
            title,
            key: value,
          }))}
        />
      </Form.Item>
    </Space>
  );
};

SelectFilterControl.displayName = 'SelectFilterControl';
