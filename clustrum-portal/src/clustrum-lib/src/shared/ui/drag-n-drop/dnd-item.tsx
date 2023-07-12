import React, { useRef } from 'react';
import { DragSourceMonitor, DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { DndItemProps, DndDropResult, DndDraggedItem } from './types';
import { calcInsertionIndex, setLastDropIndex } from './dnd-indexes';

// TODO 696922 деконструировать просы, вынести функции и уменьшить размер компонента
/* eslint-disable max-lines-per-function */
/* eslint-disable react/destructuring-assignment */
export function DndItem(props: DndItemProps): JSX.Element {
  const {
    index,
    listId,
    listAllowedTypes,
    listIsNeedRemove,
    itemData,
    dragContainerReplace,
    remove,
    setDraggedItem,
    setDropPlace,
    wrapTo,
  } = props;
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag(() => ({
    type: 'ITEM',
    item: {
      className: 'is-dragging',
      hoverIndex: 0,
      index,
      listId,
      listAllowedTypes,
      listIsNeedRemove,
      data: itemData,
    },
    end: (
      draggedItem: DndDraggedItem,
      dragMonitor: DragSourceMonitor<DndDraggedItem, DndDropResult>,
    ): void => {
      const dropResult: DndDropResult | null = dragMonitor.getDropResult();
      const hoverIndex = dragMonitor.getItem().hoverIndex;

      if (!dropResult) {
        return;
      }

      const {
        targetItem,
        droppedItemId,
        dropContainerItems,
        dropContainerInsert,
        dropContainerReplace,
        dropContainerSwap,
        setIsNeedReplace,
        isNeedReplace,
        isNeedSwap,
      } = dropResult;

      if (droppedItemId === draggedItem.listId && !isNeedSwap) {
        return;
      }

      if (isNeedReplace) {
        if (droppedItemId === draggedItem.listId) {
          dropContainerSwap(hoverIndex, draggedItem.index);
        } else {
          dragContainerReplace(draggedItem.index, targetItem);
          dropContainerReplace(hoverIndex, draggedItem.data);
          setIsNeedReplace(false);
        }
      } else {
        const inSameContainer = droppedItemId === draggedItem.listId;

        if (inSameContainer) {
          remove(draggedItem.index);
        }

        const insertionIndex = calcInsertionIndex(
          index,
          typeof hoverIndex === 'number' ? hoverIndex : dropContainerItems.length,
          inSameContainer,
        );

        // добавляем в целевой контейнер
        dropContainerInsert(insertionIndex, draggedItem.data);
      }
    },
  }));

  const [, drop] = useDrop(() => ({
    accept: 'ITEM',
    //TODO 696922 вынести в отдельный метод и типизировать
    hover: (
      draggedItem: DndDraggedItem,
      dropMonitor: DropTargetMonitor<DndDraggedItem>,
    ): void => {
      setDraggedItem(draggedItem);
      const sourceItem = dropMonitor.getItem();
      const dragIndex = sourceItem.index;
      const sourceListId = sourceItem.listId;
      const hoverIndex = index;

      // сохраним индекс положения куда мы захуверились
      dropMonitor.getItem().hoverIndex = hoverIndex;

      const domNode = ref.current;
      if (!domNode) {
        return;
      }
      const hoverBoundingRect = domNode.getBoundingClientRect();
      const clientOffset = dropMonitor.getClientOffset();
      if (clientOffset === null) {
        return;
      }
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Представьте себе систему координат в евклидовом пространстве, где ось y направлена вниз (ось х не важна):
      // 0 находится там, где верхний край элемента, на который мы попали курсором, пока что-то тащили;
      // elementSize находится там, где нижний край этого же элемента.
      // Зона, которую мы считаем триггером для реплейса - это зона размером с половину элемента от 1/4 его высоты до 3/4 его высоты
      const replaceZoneSize = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const replaceZoneBottom =
        hoverBoundingRect.bottom - replaceZoneSize / 2 - hoverBoundingRect.top;
      const replaceZoneTop = replaceZoneSize / 2;

      const isContainerTypeMatch = listId === sourceListId;
      const isUnderTarget = dragIndex === hoverIndex || dragIndex === hoverIndex - 1;
      const isOnTarget = dragIndex === hoverIndex + 1 || dragIndex === hoverIndex;

      if (hoverClientY < replaceZoneTop && !(isContainerTypeMatch && isUnderTarget)) {
        setDropPlace(hoverIndex);
        setLastDropIndex(hoverIndex);
      } else {
        if (replaceZoneBottom < hoverClientY && !(isContainerTypeMatch && isOnTarget)) {
          setDropPlace(hoverIndex + 1);
          setLastDropIndex(hoverIndex + 1);
        } else {
          setDropPlace(null);
          setLastDropIndex(null);
        }
      }
    },
  }));

  return (
    <div ref={drop}>
      <div ref={drag}>
        <div ref={ref}>{wrapTo(props, ref.current)}</div>
      </div>
    </div>
  );
}
