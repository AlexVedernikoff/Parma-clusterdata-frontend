import React, { useRef } from 'react';
import { DragSourceMonitor, DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { DndItemProps, DndDropResult, DndDraggedItem } from './types';

// Это пока что единственный способ прокинуть в событие end актуальный drop index
let lastDropIndex: number | null = null;

// TODO 696922 деконструировать просы, вынести функции и уменьшить размер компонента
/* eslint-disable max-lines-per-function */
/* eslint-disable react/destructuring-assignment */
export function DndItem(props: DndItemProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag(() => ({
    type: 'ITEM',
    item: {
      className: 'is-dragging',
      index: props.index,
      listId: props.listId,
      listAllowedTypes: props.listAllowedTypes,
      listIsNeedRemove: props.listIsNeedRemove,
      item: props.item,
    },
    end: (
      draggedItemWrapper,
      dragMonitor: DragSourceMonitor<DndDraggedItem, DndDropResult>,
    ): void => {
      const dropResult: DndDropResult | null = dragMonitor.getDropResult();
      const hoverIndex = dragMonitor.getItem().hoverIndex;

      if (!dropResult) {
        return;
      }
      if (dropResult.revert) {
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

      if (droppedItemId === draggedItemWrapper.listId && !isNeedSwap) {
        return;
      }

      if (isNeedReplace) {
        if (droppedItemId !== draggedItemWrapper.listId) {
          props.dragContainerReplace(draggedItemWrapper.index, targetItem);
          dropContainerReplace(hoverIndex, draggedItemWrapper.item);
          setIsNeedReplace(false);
        } else {
          dropContainerSwap(hoverIndex, draggedItemWrapper.index);
        }
      } else {
        const dropIndex =
          lastDropIndex !== null
            ? lastDropIndex
            : typeof hoverIndex === 'number'
            ? hoverIndex
            : dropContainerItems.length;

        if (droppedItemId === draggedItemWrapper.listId) {
          props.remove(draggedItemWrapper.index);
        }

        // добавляем в целевой контейнер
        dropContainerInsert(dropIndex, draggedItemWrapper.item);
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
      props.setDraggedItem(draggedItem);
      const sourceItem = dropMonitor.getItem();
      const dragIndex = sourceItem.index;
      const sourceListId = sourceItem.listId;
      const hoverIndex = props.index;

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

      const isContainerTypeMatch = props.listId === sourceListId;
      const isUnderTarget = dragIndex === hoverIndex || dragIndex === hoverIndex - 1;
      const isOnTarget = dragIndex === hoverIndex + 1 || dragIndex === hoverIndex;

      if (hoverClientY < replaceZoneTop && !(isContainerTypeMatch && isUnderTarget)) {
        props.setDropPlace(hoverIndex);
        lastDropIndex = hoverIndex;
      } else {
        if (replaceZoneBottom < hoverClientY && !(isContainerTypeMatch && isOnTarget)) {
          props.setDropPlace(hoverIndex + 1);
          lastDropIndex = hoverIndex + 1;
        } else {
          props.setDropPlace(null);
          lastDropIndex = null;
        }
      }
    },
  }));

  return (
    <div ref={drop}>
      <div ref={drag}>
        <div ref={ref}>{props.wrapTo(props, ref.current)}</div>
      </div>
    </div>
  );
}
