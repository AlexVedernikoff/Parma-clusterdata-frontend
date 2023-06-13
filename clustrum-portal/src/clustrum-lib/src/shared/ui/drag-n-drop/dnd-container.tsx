import React, { useEffect, useRef, useState } from 'react';
import update from 'immutability-helper';
import { getUniqueId } from '../../../../../utils/helpers';
import { useDrop } from 'react-dnd';
import { DndItem } from './dnd-item';
import { DndItem as IDndItem } from './types/dnd-item';
import { DndContainerProps } from './types/dnd-container-props';

export function DndContainer(props: DndContainerProps): JSX.Element {
  const [items, setItems] = useState<IDndItem[]>(props.items || []);
  const [dropPlace, setDropPlace] = useState<number | null>();
  const [tooltipVisible, setTooltipVisibleState] = useState(false);
  const [usedItem, setUsedItem] = useState<IDndItem>();
  const [action, setAction] = useState<string>();
  const [onUndoActionState, setOnUndoActionState] = useState<() => void>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.onUpdate && items != props.items) {
      props.onUpdate(items, usedItem, action, onUndoActionState);
    }
  }, [items]);

  useEffect(() => {
    if (props.isNeedUpdate) {
      setItems(props.items);
    }
  }, [props.items, props.isNeedUpdate]);

  const [, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (item: any, monitor: any): any => {
      const { id } = props;
      const sourceObj = monitor.getItem();
      const itemType = sourceObj.item.type;

      if (id !== sourceObj.listId) {
        // отменяем, если не вмещается (но если не разрешена замена)
        if (props.capacity && props.capacity <= items.length) {
          return { revert: true };
        }

        // отменяем, если не подходит по типу
        if (props.allowedTypes) {
          if (!props.allowedTypes.has(itemType)) {
            return { revert: true };
          }
        } else if (props.checkAllowed) {
          if (!props.checkAllowed(sourceObj.item)) {
            return { revert: true };
          }
        }
      }

      setDropPlace(null);

      const targetIndex =
        typeof dropPlace === 'number'
          ? dropPlace
          : typeof item.hoverIndex === 'number'
          ? item.hoverIndex
          : items.length;

      if (
        !(
          props.listId === item.listId &&
          (targetIndex === item.index + 1 || targetIndex === item.index)
        )
      ) {
        // удаляем в исходном контейнере
        remove(item.index);

        // добавляем в целевой контейнер
        insert(item.item, targetIndex, () => {
          insert(item.item, item.index);
        });
      }
    },
    hover: (item: any, monitor: any): any => {
      const dragIndex = monitor.getItem().index;
      const hoverIndex = item.index;
      const sourceListId = monitor.getItem().listId;

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

      if (hoverClientY < replaceZoneTop) {
        if (
          !(
            item.listId === sourceListId &&
            (dragIndex === hoverIndex || dragIndex === hoverIndex - 1)
          )
        ) {
          setDropPlace(hoverIndex);
        }
      } else if (replaceZoneBottom < hoverClientY) {
        if (
          !(
            item.listId === sourceListId &&
            (dragIndex === hoverIndex + 1 || dragIndex === hoverIndex)
          )
        ) {
          setDropPlace(hoverIndex + 1);
        }
      } else {
        setDropPlace(null);
      }
    },
  }));

  function setTooltipVisible(visibility: boolean): void {
    setTooltipVisibleState(visibility);
  }

  function move(dragIndex: number, hoverIndex: number): void {
    const dragItem = items[dragIndex];

    setItems(
      update(items, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragItem],
        ],
      }),
    );

    if (props.onUpdate) {
      props.onUpdate(items);
    }
  }

  function insert(item: IDndItem, index: number, onUndoInsert?: () => void): void {
    // по умолчанию пушим всегда
    let insert = true;

    // если контейнер работает в режиме с копированиями из себя, то не добавляем
    if (props.noRemove) {
      insert = items.indexOf(item) === -1;
    }

    if (insert) {
      const insertedItem = { ...item };
      insertedItem.id = getUniqueId('inserted');

      setUsedItem(insertedItem);
      setAction('insert');
      setOnUndoActionState(onUndoInsert);
      setItems(
        update(items, {
          $splice: [[index, 0, insertedItem]],
        }),
      );
    }
  }

  function replace(index: number, item: IDndItem, onUndoReplace?: () => void): void {
    setUsedItem(item);
    setAction('replace');
    setOnUndoActionState(onUndoReplace);
    setItems(
      update(items, {
        $splice: [[index, 1, item]],
      }),
    );
  }

  function remove(index: number): void {
    // если контейнер работает в режиме с копированиями из себя, то не удаляем
    if (props.noRemove) {
      return;
    }

    const removedItems = items.splice(index, 1);
    setItems(items);

    if (props.onUpdate) {
      props.onUpdate(items, removedItems[0], 'remove');
    }
  }

  let title;
  if (props.title) {
    title = (
      <div className="subheader dimensions-subheader dimensions-dataset">
        <span> {props.title}</span>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <div ref={drop} className={`dnd-container`}>
        {title}
        {items.map((item: any, index: any) => {
          return (
            <DndItem
              key={`${item.id}-${index}`}
              className={props.itemsClassName || ''}
              item={item}
              index={index}
              listId={props.id}
              listAllowedTypes={props.allowedTypes}
              listNoRemove={props.noRemove}
              wrapTo={props.wrapTo}
              disabled={props.disabled}
              setTooltipVisible={setTooltipVisible}
              tooltipVisible={tooltipVisible}
              remove={remove}
            />
          );
        })}
      </div>
    </div>
  );
}
