import React, { useRef } from 'react';
import { DragSourceMonitor, DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { DndItemProps, DndDropResult, DndDraggedItem, DndItemData } from './types';
import { calcInsertionIndex } from './insertion-index';
import { getTargetItemData, setLastDropIndex, setTargetItemData } from './dnd-state';

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
    size,
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
        droppedItemId,
        dropContainerItems,
        dropContainerInsert,
        dropContainerReplace,
        dropContainerSwap,
        setIsNeedReplace,
        isNeedReplace,
        isNeedSwap,
      } = dropResult;

      const inSameContainer = droppedItemId === draggedItem.listId;

      if (inSameContainer && !isNeedSwap) {
        return;
      }

      if (isNeedReplace) {
        if (inSameContainer) {
          dropContainerSwap(hoverIndex, draggedItem.index);
          setIsNeedReplace(false);
        } else {
          const targetItemData = getTargetItemData();

          if (targetItemData) {
            dragContainerReplace(draggedItem.index, targetItemData);
            dropContainerReplace(hoverIndex, draggedItem.data);
            setIsNeedReplace(false);
          }
        }
      } else {
        if (listIsNeedRemove || inSameContainer) {
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
      const domNode = ref.current;

      // сохраним индекс положения куда мы захуверились
      dropMonitor.getItem().hoverIndex = hoverIndex;

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

      setTargetItemData(itemData);

      if (hoverClientY < replaceZoneTop && !(isContainerTypeMatch && isUnderTarget)) {
        setDropPlace(hoverIndex);
        setLastDropIndex(hoverIndex);

        return;
      }

      if (replaceZoneBottom < hoverClientY && !(isContainerTypeMatch && isOnTarget)) {
        setDropPlace(hoverIndex + 1);
        setLastDropIndex(hoverIndex + 1);

        return;
      }

      setDropPlace(null);
      setLastDropIndex(null);
    },
  }));

  const style = {
    height: size.height,
    marginTop: size.margin,
    marginBottom: size.margin,
  };

  return (
    <div ref={drop}>
      <div ref={drag}>
        <div style={style} ref={ref}>
          {wrapTo(props, ref.current)}
        </div>
      </div>
    </div>
  );
}
