import React from 'react';
import { useDrag } from 'react-dnd';
import { DndItemProps } from './types/dnd-item-props';

//если типизировать пропсы, wrapTo перестает принимать DndItem
export function DndItem(props: any): JSX.Element {
  const [, drag] = useDrag(() => ({
    type: 'ITEM',
    item: {
      className: 'is-dragging',
      index: props.index,
      listId: props.listId,
      listAllowedTypes: props.listAllowedTypes,
      listNoRemove: props.listNoRemove,
      item: props.item,
    },
  }));

  return <div ref={drag}>{props.wrapTo(props, DndItem)}</div>;
}
