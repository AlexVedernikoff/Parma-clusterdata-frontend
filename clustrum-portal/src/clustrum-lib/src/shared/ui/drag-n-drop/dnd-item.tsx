import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { DndItemProps } from './types/dnd-item-props';

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
    },
  }));

  return (
    <div ref={drag}>
      <div ref={ref}>{props.wrapTo(props, ref.current)}</div>
    </div>
  );
}
