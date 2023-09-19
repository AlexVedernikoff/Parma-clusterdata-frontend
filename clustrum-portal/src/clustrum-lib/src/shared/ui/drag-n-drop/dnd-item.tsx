import React, { useRef, useState } from 'react';
import { DragSourceMonitor, DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import {
  DndItemProps,
  DndDropResult,
  DndDraggedItem,
  DndEmptyDropResult,
  notEmptyDndDropResult,
} from './types';
import { calcInsertionIndex } from './insertion-index';
import { getTargetItemData, setLastDropIndex, setTargetItemData } from './dnd-state';

export function DndItem<T>(props: DndItemProps<T>): JSX.Element {
  const {
    index,
    containerId,
    containerAllowedTypes,
    containerIsNeedRemove,
    itemData,
    size,
    containerCheckAllowed,
    replace: sourceContainerReplace,
    remove,
    setDraggedItem,
    setDropPlace,
    wrapTo,
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [tooltipVisibility, setTooltipVisibility] = useState<boolean>(false);
  const newProps = { ...props, tooltipVisibility, setTooltipVisibility };

  const [, drag] = useDrag(() => ({
    type: 'ITEM',
    item: {
      className: 'is-dragging',
      hoverIndex: 0,
      index,
      data: itemData,
      containerId,
      containerAllowedTypes,
      containerIsNeedRemove,
      containerCheckAllowed,
    } as DndDraggedItem<T>,
    end: (
      draggedItem: DndDraggedItem<T>,
      sourceMonitor: DragSourceMonitor<DndDraggedItem<T>, DndDropResult<T>>,
    ): void => {
      const dropResult:
        | DndDropResult<T>
        | DndEmptyDropResult<T>
        | null = sourceMonitor.getDropResult();
      const hoverIndex = draggedItem.hoverIndex;

      if (!dropResult) {
        return;
      }

      const dropResultIsEmpty = !notEmptyDndDropResult(dropResult);

      if (dropResult.revert || dropResultIsEmpty) {
        return;
      }

      const {
        containerId: targetContainerId,
        items: targetContainerItems,
        insert: targetContainerInsert,
        replace: targetContainerReplace,
        swap: targetContainerSwap,
        setIsNeedReplace,
        isNeedReplace,
        isNeedSwap,
      } = dropResult;

      const inSameContainer = targetContainerId === draggedItem.containerId;

      if (inSameContainer && !isNeedSwap) {
        return;
      }

      if (isNeedReplace) {
        if (inSameContainer) {
          targetContainerSwap(hoverIndex, draggedItem.index);
          setIsNeedReplace(false);

          return;
        }

        const targetItemData = getTargetItemData<T>();
        if (targetItemData) {
          sourceContainerReplace(draggedItem.index, targetItemData);
          targetContainerReplace(hoverIndex, draggedItem.data);
          setIsNeedReplace(false);

          return;
        }
      } else {
        if (containerIsNeedRemove || inSameContainer) {
          remove(draggedItem.index);
        }

        const insertionIndex = calcInsertionIndex(
          index,
          typeof hoverIndex === 'number' ? hoverIndex : targetContainerItems.length,
          inSameContainer,
        );

        // добавляем в целевой контейнер
        targetContainerInsert(insertionIndex, draggedItem.data);
      }
    },
  }));

  const [, drop] = useDrop(() => ({
    accept: 'ITEM',
    //TODO 696922 вынести в отдельный метод и типизировать
    hover: (
      draggedItem: DndDraggedItem<T>,
      targetMonitor: DropTargetMonitor<DndDraggedItem<T>>,
    ): void => {
      setDraggedItem(draggedItem);

      const sourceIndex = draggedItem.index;
      const sourceContainerId = draggedItem.containerId;
      const hoverIndex = index;
      const domNode = ref.current;

      // сохраним индекс положения, куда мы навелись курсором
      draggedItem.hoverIndex = hoverIndex;

      if (!domNode) {
        return;
      }

      const hoverBoundingRect = domNode.getBoundingClientRect();
      const clientOffset = targetMonitor.getClientOffset();

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

      const isContainerTypeMatch = containerId === sourceContainerId;
      const isUnderTarget = sourceIndex === hoverIndex || sourceIndex === hoverIndex - 1;
      const isOnTarget = sourceIndex === hoverIndex + 1 || sourceIndex === hoverIndex;

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
          {wrapTo(newProps, ref.current)}
        </div>
      </div>
    </div>
  );
}
