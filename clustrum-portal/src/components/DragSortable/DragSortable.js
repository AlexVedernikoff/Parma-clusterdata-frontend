import React from 'react';
import PropTypes from 'prop-types';
import { DndContext, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import block from 'bem-cn-lite';

// import './DragSortable.scss';

const b = block('drag-sortable');

function SortableItem({ id, index, type, children, moveItem }) {
  const ref = React.useRef(null);
  const [, drop] = useDrop({
    accept: type,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type, id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity }} className={b('item')}>
      {children}
    </div>
  );
}

SortableItem.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  moveItem: PropTypes.func,
};

export function SortableContainer({ children, type, moveItem }) {
  return (
    <div className={b()}>
      {React.Children.map(children, (child, index) => {
        const id = child.key;
        return (
          <SortableItem key={id} index={index} id={id} moveItem={moveItem} type={type}>
            {child}
          </SortableItem>
        );
      })}
    </div>
  );
}

SortableContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node)]).isRequired,
  type: PropTypes.string.isRequired,
  moveItem: PropTypes.func,
};
