import React, { useEffect, useRef, useState } from 'react';
import { getUniqueId } from './get-unique-id';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import classNames from 'classnames';
import { DndItem } from './dnd-item';
import {
  DndItemGenericData,
  DndContainerProps,
  DndDraggedItem,
  DndDropResult,
  DndEmptyDropResult,
} from './types';
import { DndContainerTitle } from './dnd-container-title';
import { DropPlace } from './drop-place';
import { checkDndActionAvailability } from './check-action-availability';

export function DndContainer<T extends DndItemGenericData>(
  props: DndContainerProps<T>,
): JSX.Element {
  const {
    id,
    title,
    items: propItems,
    itemsClassName,
    itemSize = {
      height: 40,
      margin: 12,
    },
    capacity,
    allowedTypes,
    disabled,
    isNeedRemove = false,
    isNeedSwap = false,
    highlightDropPlace = false,
    checkAllowed,
    wrapTo,
    onUpdate,
    onItemClick,
  } = props;

  const [items, setItems] = useState<T[]>(propItems || []);
  const [dropPlace, setDropPlace] = useState<number | null>(null);
  const [tooltipVisibility, setTooltipVisibility] = useState<boolean>(false);
  const [usedItemData, setUsedItemData] = useState<T>();
  const [action, setAction] = useState<string>();
  const [isNeedToUpdate, setIsNeedToUpdate] = useState<boolean>(false);
  const ref = useRef(null);
  const isNeedReplaceRef = useRef(false);
  const [draggedItem, setDraggedItem] = useState<DndDraggedItem<T> | null>(null);

  useEffect(() => {
    setItems(propItems);
  }, [propItems]);

  useEffect(() => {
    if (onUpdate && isNeedToUpdate) {
      onUpdate(items, usedItemData, action);
      setIsNeedToUpdate(false);
    }
  }, [items]);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'ITEM',
      collect: (
        monitor: DropTargetMonitor<
          DndDraggedItem<T>,
          DndDropResult<T> | DndEmptyDropResult<T> | null
        >,
      ) => ({
        isOver: monitor.isOver(),
      }),
      //TODO 696922 вынести в отдельный метод и типизировать
      drop: (
        draggedItem: DndDraggedItem<T>,
      ): DndDropResult<T> | DndEmptyDropResult<T> | null => {
        const draggedItemData = draggedItem.data;
        const draggedItemDataType = draggedItemData.type;
        const targetItemData = items[draggedItem.hoverIndex] ?? draggedItemData;

        if (id !== draggedItem.containerId) {
          // отменяем, если не вмещается (но если не разрешена замена)
          const isContainerFull = capacity && capacity <= items.length;

          if (isContainerFull && !isNeedReplaceRef.current) {
            return { revert: true };
          }

          // отменяем, если не подходит по типу
          if (
            allowedTypes &&
            draggedItemDataType &&
            !allowedTypes.has(draggedItemDataType)
          ) {
            return { revert: true };
          }

          // отменяем, если не подходит по типу
          if (!allowedTypes && checkAllowed && !checkAllowed(draggedItemData)) {
            return { revert: true };
          }
        }

        return {
          revert: false,
          itemData: targetItemData,
          containerId: id,
          items,
          replace,
          insert,
          swap,
          dropPlace,
          isNeedReplace: isNeedReplaceRef.current,
          setIsNeedReplace,
          isNeedSwap,
        };
      },
    }),
    [items],
  );

  const setIsNeedReplace = (isNeedReplace: boolean): void => {
    isNeedReplaceRef.current = isNeedReplace;
  };

  const swap = (targetIndex: number, sourceIndex: number): void => {
    if (!isNeedSwap) {
      return;
    }

    setItems(prev => {
      setIsNeedToUpdate(true);

      const newItems = [...prev];
      const targetItemData = newItems[targetIndex];
      newItems[targetIndex] = newItems[sourceIndex];
      newItems[sourceIndex] = targetItemData;

      return newItems;
    });
  };

  const insert = (index: number, item: T): void => {
    // если контейнер работает в режиме с копированиями из себя, то не добавляем
    if (!isNeedRemove) {
      return;
    }

    const insertionItem = items.find(({ id }) => item.id === id) || { ...item };
    insertionItem.id = getUniqueId('inserted');

    setUsedItemData(insertionItem);
    setAction('insert');
    setItems(prevItems => {
      setIsNeedToUpdate(true);

      const updatedItems = [...prevItems];
      updatedItems.splice(index, 0, insertionItem);

      return updatedItems;
    });
  };

  const remove = (index: number): void => {
    // если контейнер работает в режиме с копированиями из себя, то не удаляем
    if (!isNeedRemove) {
      return;
    }

    const removedItem = items[index];

    setUsedItemData(removedItem);
    setAction('remove');
    setItems(prev => {
      setIsNeedToUpdate(true);

      const filteredItems = prev.filter((_, i) => i !== index);

      return filteredItems;
    });
  };

  const replace = (index: number, item: T): void => {
    if (!isNeedRemove) {
      return;
    }

    setUsedItemData(item);
    setAction('replace');
    setItems(prev => {
      setIsNeedToUpdate(true);

      const updatedItems = [...prev];
      updatedItems.splice(index, 1, item);

      return updatedItems;
    });
  };

  const canDrop = checkDndActionAvailability({
    itemData: draggedItem?.data,
    allowedTypes,
    checkAllowed,
  });
  const isDraggedItemHasData = !!draggedItem?.data;
  const isOverEmptyContainer =
    isDraggedItemHasData && isOver && dropPlace === null && items.length === 0;

  if (isOverEmptyContainer) {
    setDropPlace(0);
  }

  const containerClassName = classNames('dnd-container', {
    'can-drop': canDrop,
    'is-over': isOver,
  });

  return (
    <div ref={ref}>
      <div title="dnd-container" ref={drop} className={containerClassName}>
        {highlightDropPlace && (
          <DropPlace
            isDraggedItemHasData={isDraggedItemHasData}
            isOver={isOver}
            canDrop={canDrop}
            itemSize={itemSize}
            itemsCount={items.length}
            capacity={capacity}
            dropPlace={dropPlace}
          />
        )}
        <DndContainerTitle title={title} />
        {items.map(
          (item: T, index: number): JSX.Element => {
            return (
              <DndItem
                key={`${item.id}-${index}`}
                className={itemsClassName || ''}
                size={itemSize}
                itemData={item}
                index={index}
                containerId={id}
                containerAllowedTypes={allowedTypes}
                containerIsNeedRemove={isNeedRemove}
                wrapTo={wrapTo}
                disabled={disabled}
                containerCheckAllowed={checkAllowed}
                setTooltipVisibility={setTooltipVisibility}
                tooltipVisibility={tooltipVisibility}
                remove={remove}
                replace={replace}
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
