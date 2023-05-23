import React from 'react';
import { useDrag } from 'react-dnd';
import { DndItemProps } from './types/dnd-item-props';

export function DndItem(props: any) {
  const [, drag] = useDrag(
    () => ({
      type: 'ITEM',
      item: {
        className: 'is-dragging',
        index: props.index,
        listId: props.listId,
        listAllowedTypes: props.listAllowedTypes,
        listCheckAllowed: props.listCheckAllowed,
        listNoRemove: props.listNoRemove,
        item: props.item,
      },
      //end: (dragItem, monitor) => endDrag(props, dragItem, monitor),
    }),
    [],
  );

  return <div ref={drag}>{props.wrapTo(props, DndItem)}</div>;
}

function endDrag(props: any, dragItem: any, monitor: any) {
  console.log('endDrag start');

  const item = dragItem;

  const dropResult = monitor.getDropResult();

  if (!dropResult) return;

  // завершение перетягивания без результатов - откатываем все как было
  if (dropResult.revert) return;

  if (dropResult) {
    const { targetComponent } = dropResult;
    const dropPlace = dropResult.dropPlace;

    // игнорируем дроп внутри контейнера при перетаскивании из этого же контейнера при флаге noSwap
    if (dropResult.listId === item.listId && props.noSwap) {
      return;
    }

    props.setDropPlace(null);

    if (false) {
      // сбросим флаг замены
      targetComponent.doingReplace = false;

      // если дропаем в другой контейнер
      if (dropResult.listId !== item.listId) {
        let replacedItem = dropResult.items[item.hoverIndex];
        const revert = () => {
          props.replace(item.hoverIndex, replacedItem);
          props.replace(item.index, item.item);
        };

        props.replace(item.index, replacedItem, revert);
        props.replace(item.hoverIndex, item.item, revert);
      } else {
        // свап
        props.swap(item.hoverIndex, item.index);
      }
    } else {
      let targetIndex =
        typeof dropPlace === 'number'
          ? dropPlace
          : typeof item.hoverIndex === 'number'
          ? item.hoverIndex
          : dropResult.items.length;

      if (!(dropResult.listId === item.listId && (targetIndex === item.index + 1 || targetIndex === item.index))) {
        // удаляем в исходном контейнере
        props.remove(item.index);

        // добавляем в целевой контейнер
        props.insert(item.item, targetIndex, () => {
          props.insert(item.item, item.index);
        });
      }
      console.log('endDrag end');
    }
  }
}
