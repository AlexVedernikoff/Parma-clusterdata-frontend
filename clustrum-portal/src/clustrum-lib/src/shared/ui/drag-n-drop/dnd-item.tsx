import React, { useRef } from 'react';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { DndItemProps, DndDropResult, DndDropedItem } from './types';

//TODO 696922 деконструировать просы
export function DndItem(props: DndItemProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag(() => ({
    type: 'ITEM',
    item: {
      className: 'is-dragging',
      index: props.index,
      listId: props.listId,
      listAllowedTypes: props.listAllowedTypes,
      listNoRemove: props.listNoRemove,
      item: props.item,
      replace: props.replace,
    },
    end: (item, monitor: DragSourceMonitor<DndDropedItem, DndDropResult>): void => {
      const dropResult: DndDropResult | null = monitor.getDropResult();
      const hoverIndex = monitor.getItem().hoverIndex;

      if (!dropResult) {
        return;
      }
      if (dropResult.revert) {
        return;
      }

      const {
        targetItem,
        dropedItem,
        isNeedReplace,
        onSetReplaced,
        replace,
      } = dropResult;

      if (dropedItem.id === item.listId || !isNeedReplace) {
        return;
      }

      onSetReplaced(false);
      props.replace(item.index, targetItem);
      replace(hoverIndex, item.item);
    },
  }));

  const [, drop] = useDrop(() => ({
    accept: 'ITEM',
    //TODO 696922 вынести в отдельный метод и типизировать
    hover: (itemWrapper: any, monitor: any): any => {
      const sourceItem = monitor.getItem();
      const dragIndex = sourceItem.index;
      const sourceListId = sourceItem.listId;
      const hoverIndex = props.index;

      // сохраним индекс положения куда мы захуверились
      monitor.getItem().hoverIndex = hoverIndex;

      const domNode = ref.current;
      if (!domNode) {
        return;
      }
      const hoverBoundingRect = domNode.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Представьте себе систему координат в евклидовом пространстве, где ось y направлена вниз (ось х не важна):
      // 0 находится там, где верхний край элемента, на который мы попали курсором, пока что-то тащили;
      // elementSize находится там, где нижний край этого же элемента.
      // Зона, которую мы считаем триггером для реплейса - это зона размером с половину элемента от 1/4 его высоты до 3/4 его высоты
      const replaceZoneSize = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const replaceZoneBottom =
        hoverBoundingRect.bottom - replaceZoneSize / 2 - hoverBoundingRect.top;
      const replaceZoneTop = replaceZoneSize / 2;

      const isContainerTypeMatch = itemWrapper.listId === sourceListId;
      const isUnderTarget = dragIndex === hoverIndex || dragIndex === hoverIndex - 1;
      const isOnTarget = dragIndex === hoverIndex + 1 || dragIndex === hoverIndex;

      if (hoverClientY < replaceZoneTop && !(isContainerTypeMatch && isUnderTarget)) {
        props.setDropPlace(hoverIndex);
      } else {
        if (replaceZoneBottom < hoverClientY && !(isContainerTypeMatch && isOnTarget)) {
          props.setDropPlace(hoverIndex + 1);
        } else {
          props.setDropPlace(-1);
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
