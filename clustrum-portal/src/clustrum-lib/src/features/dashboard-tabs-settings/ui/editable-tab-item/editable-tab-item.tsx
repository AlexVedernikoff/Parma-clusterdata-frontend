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
    isRemoved = false,
    title,
    onUpdate,
    setEditingTabId,
  } = props;

  const [currentTitle, setCurrentTitle] = useState<string>(title);

  useEffect(() => {
    setCurrentTitle(title);
    setEditingTabId(null);
  }, [title]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCurrentTitle(e.currentTarget.value);
  };

  const handleInputBlur = (): void => {
    if (currentTitle) {
      onUpdate(id, { title: currentTitle });
    } else {
      setCurrentTitle(title);
    }
    setEditingTabId(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && currentTitle) {
      onUpdate(id, { title: currentTitle });
      setEditingTabId(null);
    }
    if (e.key === 'Escape' || (e.key === 'Enter' && !currentTitle)) {
      setCurrentTitle(title);
      setEditingTabId(null);
    }
  };

  const handleEditingItemChange = (): void => setEditingTabId(id);
  const toggleRemoveFlag = (): void => onUpdate(id, { isDeleted: !isRemoved });

  if (isRemoved) {
    return (
      <div className={styles['removed-item']}>
        <div className={styles['removed-item__label']}>Вкладка удалена</div>
        <Button
          className={styles['removed-item__restore-button']}
          type="link"
          onClick={toggleRemoveFlag}
        >
          Восстановить
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className={styles['editing-item']}>
        <Input
          autoFocus
          value={currentTitle}
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
          type="text"
          title="Редактировать"
          onClick={handleEditingItemChange}
        >
          <EditOutlined />
        </Button>
        {isDeletable && (
          <Button
            className={styles.item__button}
            type="text"
            title="Удалить"
            onClick={toggleRemoveFlag}
          >
            <DeleteOutlined />
          </Button>
        )}
      </div>
    </div>
  );
}
