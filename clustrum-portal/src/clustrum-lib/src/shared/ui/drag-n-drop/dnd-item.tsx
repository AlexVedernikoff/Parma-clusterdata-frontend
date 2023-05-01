import React from 'react';
import { useDrag } from 'react-dnd';

export function DndItem(props: any) {
  const [, drag] = useDrag(
    () => ({
      type: 'ITEM',

      canDrag: () => !(props.item || props.disabled),
      end: monitor => endDrag(props, monitor),
    }),
    [],
  );

  return <div ref={drag}>{props.wrapTo(props, DndItem)}</div>;
}

function endDrag(props: any, monitor: any) {
  console.log('endDrag');
  const item = monitor.getItem();
  const dropResult = monitor.getDropResult();

  if (!dropResult) return;

  // завершение перетягивания без результатов - откатываем все как было
  if (dropResult.revert) return;

  if (dropResult) {
    const { targetComponent } = dropResult;
    const dropPlace = targetComponent.state.dropPlace;

    // игнорируем дроп внутри контейнера при перетаскивании из этого же контейнера при флаге noSwap
    if (dropResult.listId === item.listId && targetComponent.props.noSwap) {
      return;
    }

    targetComponent.setDropPlace(null);

    if (targetComponent.doingReplace) {
      // сбросим флаг замены
      targetComponent.doingReplace = false;

      // если дропаем в другой контейнер
      if (dropResult.listId !== item.listId) {
        let replacedItem = targetComponent.state.items[item.hoverIndex];
        const revert = () => {
          targetComponent.replace(item.hoverIndex, replacedItem);
          props.replace(item.index, item.item);
        };

        props.replace(item.index, replacedItem, revert);
        targetComponent.replace(item.hoverIndex, item.item, revert);
      } else {
        // свап
        targetComponent.swap(item.hoverIndex, item.index);
      }
    } else {
      let targetIndex =
        typeof dropPlace === 'number'
          ? dropPlace
          : typeof item.hoverIndex === 'number'
          ? item.hoverIndex
          : targetComponent.state.items.length;

      if (!(dropResult.listId === item.listId && (targetIndex === item.index + 1 || targetIndex === item.index))) {
        // удаляем в исходном контейнере
        props.remove(item.index);

        // добавляем в целевой контейнер
        dropResult.targetComponent.insert(item.item, targetIndex, () => {
          props.insert(item.item, item.index);
        });
      }
    }
  }
}
