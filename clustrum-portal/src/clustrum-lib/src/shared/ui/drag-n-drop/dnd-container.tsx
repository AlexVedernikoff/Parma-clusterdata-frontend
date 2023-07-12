import React, { useEffect, useRef, useState } from 'react';
// TODO: убрать зависимость из старого кода
import { getUniqueId } from '../../../../../utils/helpers';
import { useDrop } from 'react-dnd';
import { DndItem } from './dnd-item';
import { DndItemData, DndContainerProps, DndDraggedItem } from './types';

// TODO 696922 деконструировать просы, вынести функции и уменьшить размер компонента
/* eslint-disable max-lines-per-function */
/* eslint-disable react/destructuring-assignment */
export function DndContainer(props: DndContainerProps): JSX.Element {
  const { isNeedRemove = false, isNeedSwap = false } = props;
  const [items, setItems] = useState<DndItemData[]>(props.items || []);
  const [dropPlace, setDropPlace] = useState<number | null>(null);
  const [tooltipVisible, setTooltipVisibleState] = useState<boolean>(false);
  const [usedItem, setUsedItem] = useState<DndItemData>();
  const [action, setAction] = useState<string>();
  const [isNeedToUpdate, setIsNeedToUpdate] = useState<boolean>(false);
  const ref = useRef(null);
  const isNeedReplaceRef = useRef(false);
  const [draggedItem, setDraggedItem] = useState<DndDraggedItem | null>(null);

  useEffect(() => {
    setItems(props.items);
  }, [props.items]);

  useEffect(() => {
    if (props.onUpdate && isNeedToUpdate) {
      props.onUpdate(items, usedItem, action);
      setIsNeedToUpdate(false);
    }
  }, [items]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
    }),
    //TODO 696922 вынести в отдельный метод и типизировать
    drop: (draggedItem: DndDraggedItem): any => {
      const { id } = props;
      const itemType = draggedItem.item.type;
      const targetItem = items[draggedItem.hoverIndex] ?? draggedItem.item;

      if (id !== draggedItem.listId) {
        // отменяем, если не вмещается (но если не разрешена замена)
        const isContainerFull = props.capacity && props.capacity <= items.length;
        if (isContainerFull && !isNeedReplaceRef.current) {
          return { revert: true };
        }

        // отменяем, если не подходит по типу
        if (props.allowedTypes) {
          if (!props.allowedTypes.has(itemType)) {
            return { revert: true };
          }
        } else if (props.checkAllowed) {
          if (!props.checkAllowed(draggedItem.item)) {
            return { revert: true };
          }
        }
      }

      return {
        targetItem,
        droppedItemId: props.id,
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

  if (draggedItem?.item) {
    isDropPlaceExists = typeof dropPlace === 'number';

    if (isOver) {
      if (!isDropPlaceExists && items.length === 0) {
        isDropPlaceExists = true;
        setDropPlace(0);
      }
    } else {
      isDropPlaceExists = false;
    }

    if (props.allowedTypes) {
      canDrop = props.allowedTypes.has(draggedItem.item.type);
    } else if (props.checkAllowed) {
      canDrop = props.checkAllowed(draggedItem.item);
    } else {
      canDrop = true;
    }

    if ((props.capacity && props.capacity <= items.length) || !canDrop) {
      isDropPlaceExists = false;
    }
  }

  let title;
  if (props.title) {
    title = (
      <div className="subheader dimensions-subheader dimensions-dataset">
        <span> {props.title}</span>
      </div>
    );
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
        {title}
        {items.map((item: any, index: any) => {
          return (
            <DndItem
              key={`${item.id}-${index}`}
              className={props.itemsClassName || ''}
              item={item}
              index={index}
              listId={props.id}
              listAllowedTypes={props.allowedTypes}
              listIsNeedRemove={isNeedRemove}
              wrapTo={props.wrapTo}
              disabled={props.disabled}
              setTooltipVisible={setTooltipVisible}
              tooltipVisible={tooltipVisible}
              remove={remove}
              dragContainerReplace={replace}
              setDropPlace={setDropPlace}
              onItemClick={props.onItemClick}
              draggedItem={draggedItem}
              setDraggedItem={setDraggedItem}
              setIsNeedReplace={setIsNeedReplace}
            />
          );
        })}
      </div>
    </div>
  );
}
