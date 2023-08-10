import React, { useState, useEffect, ReactElement } from 'react';
// eslint-disable-next-line
// @ts-ignore
import block from 'bem-cn-lite';
import { Input } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { EditableTabItemProps } from '../../types';

const b = block('dialog-tabs');

export function EditableTabItem(props: EditableTabItemProps): ReactElement {
  const {
    id,
    isEditing = false,
    isDeletable = false,
    title,
    onUpdate,
    onRemove,
    setEditingTabId,
  } = props;

  const [updatedTitle, setUpdatedTitle] = useState<string>(title);

  useEffect(() => {
    setUpdatedTitle(title);
  }, [title]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setUpdatedTitle(e.currentTarget.value);

  const handleInputBlur = (): void => {
    if (updatedTitle) {
      return onUpdate(id, { title: updatedTitle });
    }
    setEditingTabId(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && updatedTitle) {
      return onUpdate(id, { title: updatedTitle });
    }
    if (e.key === 'Escape' || (e.key === 'Enter' && !updatedTitle)) {
      setUpdatedTitle(title);
      setEditingTabId(null);
    }
  };

  const handleEditingItemChange = (): void => setEditingTabId(id);

  const handleRemove = (): void => onRemove(id);

  if (isEditing) {
    return (
      <div className={b('row', { input: true })}>
        <Input
          autoFocus
          value={updatedTitle}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
        />
      </div>
    );
  }

  return (
    <div className={b('row')} onDoubleClick={handleEditingItemChange}>
      <div className={b('title')}>{title}</div>
      <div className={b('controls')}>
        <EditOutlined className={b('icon')} onClick={handleEditingItemChange} />
        {isDeletable && <CloseOutlined className={b('icon')} onClick={handleRemove} />}
      </div>
    </div>
  );
}
