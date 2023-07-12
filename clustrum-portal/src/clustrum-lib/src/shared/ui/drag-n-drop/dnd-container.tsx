import React, { useEffect, useRef, useState } from 'react';
// TODO: убрать зависимость из старого кода
import { getUniqueId } from '../../../../../utils/helpers';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { DndItem } from './dnd-item';
import { DndItemData, DndContainerProps, DndDraggedItem, DndDropResult } from './types';
import { DndContainerTitle } from './dnd-container-title';

// TODO 696922 деконструировать просы, вынести функции и уменьшить размер компонента
/* eslint-disable max-lines-per-function */
/* eslint-disable react/destructuring-assignment */
export function DndContainer(props: DndContainerProps): JSX.Element {
  const {
    id,
    title,
    items: propItems,
    itemsClassName,
    capacity,
    allowedTypes,
    disabled,
    isNeedRemove = false,
    isNeedSwap = false,
    checkAllowed,
    wrapTo,
    onUpdate,
    onItemClick,
  } = props;

  const [items, setItems] = useState<DndItemData[]>(propItems || []);
  const [dropPlace, setDropPlace] = useState<number | null>(null);
  const [tooltipVisible, setTooltipVisibleState] = useState<boolean>(false);
  const [usedItem, setUsedItem] = useState<DndItemData>();
  const [action, setAction] = useState<string>();
  const [isNeedToUpdate, setIsNeedToUpdate] = useState<boolean>(false);
  const ref = useRef(null);
  const isNeedReplaceRef = useRef(false);
  const [draggedItem, setDraggedItem] = useState<DndDraggedItem | null>(null);

  useEffect(() => {
    setItems(propItems);
  }, [propItems]);

  useEffect(() => {
    if (onUpdate && isNeedToUpdate) {
      onUpdate(items, usedItem, action);
      setIsNeedToUpdate(false);
    }
  }, [items]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    collect: (monitor: DropTargetMonitor<DndDraggedItem, DndDropResult>) => ({
      isOver: monitor.isOver(),
    }),
    //TODO 696922 вынести в отдельный метод и типизировать
    drop: (draggedItem: DndDraggedItem): DndDropResult | null => {
      const itemType = draggedItem.data.type;
      const targetItem = items[draggedItem.hoverIndex] ?? draggedItem.data;

      if (id !== draggedItem.listId) {
        // отменяем, если не вмещается (но если не разрешена замена)
        const isContainerFull = capacity && capacity <= items.length;
        if (isContainerFull && !isNeedReplaceRef.current) {
          return null;
        }

        // отменяем, если не подходит по типу
        if (allowedTypes) {
          if (!allowedTypes.has(itemType)) {
            return null;
          }
        } else if (checkAllowed) {
          if (!checkAllowed(draggedItem.data)) {
            return null;
          }
        }
      }

      return {
        targetItem,
        droppedItemId: id,
        dropContainerItems: items,
        dropContainerReplace: replace,
        dropContainerInsert: insert,
        dropContainerSwap: swap,
        dropPlace,
        isNeedReplace: isNeedReplaceRef.current,
        setIsNeedReplace,
        isNeedSwap,
      };
    },
  }));

  function setTooltipVisible(visibility: boolean): void {
    setTooltipVisibleState(visibility);
  }

  function setIsNeedReplace(isNeedReplace: boolean): void {
    isNeedReplaceRef.current = isNeedReplace;
  }

  function swap(targetIndex: number, sourceIndex: number): void {
    if (!isNeedSwap) {
      return;
    }

    setItems(prev => {
      setIsNeedToUpdate(true);
      const newItems = [...prev];
      const targetItem = newItems[targetIndex];
      newItems[targetIndex] = newItems[sourceIndex];
      newItems[sourceIndex] = targetItem;
      return newItems;
    });
  }

  const insert = (index: number, item: DndItemData): void => {
    // если контейнер работает в режиме с копированиями из себя, то не добавляем
    if (!isNeedRemove && !items.includes(item)) {
      return;
    }

    const insertionItem = { ...item };
    insertionItem.id = getUniqueId('inserted');

    setUsedItem(insertionItem);
    setAction('insert');
    setItems(prevItems => {
      setIsNeedToUpdate(true);
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 0, insertionItem);
      return updatedItems;
    });
  };

  function remove(index: number): void {
    // если контейнер работает в режиме с копированиями из себя, то не удаляем
    if (!isNeedRemove) {
      return;
    }

    const removedItem = items[index];
    setUsedItem(removedItem);
    setAction('remove');
    setItems(prev => {
      setIsNeedToUpdate(true);
      const filtredItems = prev.filter((_, i) => i !== index);
      return filtredItems;
    });
  }

  function replace(index: number, item: DndItemData): void {
    if (!isNeedRemove) {
      return;
    }

    setUsedItem(item);
    setAction('replace');
    setItems(prev => {
      setIsNeedToUpdate(true);
      const updatedItems = [...prev];
      updatedItems.splice(index, 1, item);
      return updatedItems;
    });
  }

  let canDrop = false;
  let isDropPlaceExists = false;

  if (draggedItem?.data) {
    isDropPlaceExists = typeof dropPlace === 'number';

    if (isOver) {
      if (!isDropPlaceExists && items.length === 0) {
        isDropPlaceExists = true;
        setDropPlace(0);
      }
    } else {
      isDropPlaceExists = false;
    }

    if (allowedTypes) {
      canDrop = allowedTypes.has(draggedItem.data.type);
    } else if (checkAllowed) {
      canDrop = checkAllowed(draggedItem.data);
    } else {
      canDrop = true;
    }

    if ((capacity && capacity <= items.length) || !canDrop) {
      isDropPlaceExists = false;
    }
  }

  return (
    <div ref={ref}>
      <div
        ref={drop}
        className={`dnd-container${canDrop ? ' can-drop' : ''}${
          isOver ? ' is-over' : ''
        }`}
      >
        {dropPlace !== null && (
          <div
            className="drop-place"
            style={{
              background: 'red',
              display: isDropPlaceExists ? 'block' : 'none',
              top: isDropPlaceExists
                ? dropPlace === 0
                  ? -12
                  : dropPlace * 40 + 12 * dropPlace
                : 'auto',
            }}
          ></div>
        )}
        <DndContainerTitle title={title} />
        {items.map(
          (item: DndItemData, index: number): JSX.Element => {
            return (
              <DndItem
                key={`${item.id}-${index}`}
                className={itemsClassName || ''}
                itemData={item}
                index={index}
                listId={id}
                listAllowedTypes={allowedTypes}
                listIsNeedRemove={isNeedRemove}
                wrapTo={wrapTo}
                disabled={disabled}
                setTooltipVisible={setTooltipVisible}
                tooltipVisible={tooltipVisible}
                remove={remove}
                dragContainerReplace={replace}
                setDropPlace={setDropPlace}
                onItemClick={onItemClick}
                draggedItem={draggedItem}
                setDraggedItem={setDraggedItem}
                setIsNeedReplace={setIsNeedReplace}
              />
            );
          },
        )}
      </div>
    </div>
  );
}
