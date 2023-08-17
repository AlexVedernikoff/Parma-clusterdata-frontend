import React, { useState, useEffect, ReactElement } from 'react';
import { Button, Input } from 'antd';
import { DeleteOutlined, EditOutlined, MenuOutlined } from '@ant-design/icons';
import { EditableTabItemProps } from '../../types';
import styles from './editable-tab-item.module.css';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUpdatedTitle(e.currentTarget.value);
  };

  const handleInputBlur = (): void => {
    if (updatedTitle) {
      onUpdate(id, { title: updatedTitle });
      return;
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
      <div className={styles['editing-item']}>
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
    <div className={styles.item} onDoubleClick={handleEditingItemChange}>
      <MenuOutlined className={styles['item__draggable-icon']} />
      <div className={styles.item__title}>{title}</div>
      <div className={styles.item__controls}>
        <Button
          className={styles.item__button}
          type="link"
          title="Редактировать"
          onClick={handleEditingItemChange}
        >
          <EditOutlined />
        </Button>
        {isDeletable && (
          <Button
            className={styles.item__button}
            type="link"
            title="Удалить"
            onClick={handleRemove}
          >
            <DeleteOutlined />
          </Button>
        )}
      </div>
    </div>
  );
}
