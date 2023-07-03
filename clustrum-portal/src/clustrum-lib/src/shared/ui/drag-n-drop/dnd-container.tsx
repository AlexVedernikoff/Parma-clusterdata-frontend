import React, { useEffect, useRef, useState } from 'react';
// TODO: убрать зависимость из старого кода
import { getUniqueId } from '../../../../../utils/helpers';
import { useDrop } from 'react-dnd';
import { DndItem } from './dnd-item';
import { DndItem as IDndItem, DndContainerProps, DndDropedItem } from './types';

// TODO 696922 деконструировать просы и вынести функции
// eslint-disable-next-line max-lines-per-function
/* eslint-disable react/destructuring-assignment */
export function DndContainer(props: DndContainerProps): JSX.Element {
  const [items, setItems] = useState<IDndItem[]>(props.items || []);
  const [dropPlace, setDropPlace] = useState<number | null>(null);
  const [tooltipVisible, setTooltipVisibleState] = useState<boolean>(false);
  const [usedItem, setUsedItem] = useState<IDndItem>();
  const [action, setAction] = useState<string>();
  const [isNeedToUpdate, setIsNeedToUpdate] = useState<boolean>(false);
  const ref = useRef(null);
  const isNeedReplaceRef = useRef(false);
  const [draggingItem, setDraggingItem] = useState<DndDropedItem | null>(null);

  useEffect(() => {
    setItems(props.items);
  }, [props.items]);

  useEffect(() => {
    if (props.onUpdate && isNeedToUpdate) {
      props.onUpdate(items, usedItem, action);
      setIsNeedToUpdate(false);
    }
  }, [items]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
    }),
    //TODO 696922 вынести в отдельный метод и типизировать
    drop: (itemWrapper: DndDropedItem, monitor: any): any => {
      const { id } = props;
      const itemType = itemWrapper.item.type;
      const targetItem = items[itemWrapper.hoverIndex] ?? itemWrapper.item;

      if (id !== itemWrapper.listId) {
        // отменяем, если не вмещается (но если не разрешена замена)
        if (
          props.capacity &&
          props.capacity <= items.length &&
          !isNeedReplaceRef.current
        ) {
          return { revert: true };
        }

        // отменяем, если не подходит по типу
        if (props.allowedTypes) {
          if (!props.allowedTypes.has(itemType)) {
            return { revert: true };
          }
        } else if (props.checkAllowed) {
          if (!props.checkAllowed(itemWrapper.item)) {
            return { revert: true };
          }
        }
      }

      return {
        targetItem,
        droppedItemId: props.id,
        dropContainerItems: items,
        dropContainerReplace: replace,
        dropContainerInsert: insert,
        dropContainerSwap: swap,
        dropPlace: dropPlace,
        isNeedReplace: isNeedReplaceRef.current,
        setIsNeedReplace,
        noSwap: props.noSwap,
      };
    },
  }));

  function setTooltipVisible(visibility: boolean): void {
    setTooltipVisibleState(visibility);
  }

  function setIsNeedReplace(isNeedReplace: boolean): void {
    isNeedReplaceRef.current = isNeedReplace;
  }

  function swap(targetIndex: number, sourceIndex: number): void {
    if (props.noSwap) {
      return;
    }

    setItems(prev => {
      setIsNeedToUpdate(true);
      const temp = [...prev];
      const targetItem = temp[targetIndex];
      temp[targetIndex] = temp[sourceIndex];
      temp[sourceIndex] = targetItem;
      return temp;
    });
  }

  function insert(item: IDndItem, index: number): void {
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
      setItems(prevItems => {
        setIsNeedToUpdate(true);
        const updatedItems = [...prevItems];
        updatedItems.splice(index, 0, insertedItem);
        return updatedItems;
      });
    }
  }

  function remove(index: number): void {
    // если контейнер работает в режиме с копированиями из себя, то не удаляем
    if (props.noRemove) {
      return;
    }

    const removedItem = items[index];
    setUsedItem(removedItem);
    setAction('remove');
    setItems(prev => {
      setIsNeedToUpdate(true);
      const filtredItems = prev.filter((_, i) => i !== index);
      return filtredItems;
    });
  }

  function replace(index: number, item: IDndItem): void {
    if (props.noRemove) {
      return;
    }

    setUsedItem(item);
    setAction('replace');
    setItems(prev => {
      setIsNeedToUpdate(true);
      const updatedItems = [...prev];
      updatedItems.splice(index, 1, item);
      return updatedItems;
    });
  }

  let canDrop = false;
  let dropPlaceExists = false;

  if (draggingItem && draggingItem.item) {
    dropPlaceExists = typeof dropPlace === 'number';

    if (isOver) {
      if (!dropPlaceExists && items.length === 0) {
        dropPlaceExists = true;
        setDropPlace(0);
      }
    } else {
      dropPlaceExists = false;
    }

    if (props.allowedTypes) {
      canDrop = props.allowedTypes.has(draggingItem.item.type);
    } else if (props.checkAllowed) {
      canDrop = props.checkAllowed(draggingItem.item);
    } else {
      canDrop = true;
    }

    if (props.capacity && props.capacity <= items.length) {
      dropPlaceExists = false;
    }

    if (!canDrop) {
      dropPlaceExists = false;
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
      <div
        ref={drop}
        className={`dnd-container${canDrop ? ' can-drop' : ''}${
          isOver ? ' is-over' : ''
        }`}
      >
        {dropPlace !== null && (
          <div
            className="drop-place"
            style={{
              background: 'red',
              display: dropPlaceExists ? 'block' : 'none',
              top: dropPlaceExists
                ? dropPlace === 0
                  ? -4
                  : dropPlace * 32 + 4 * (dropPlace - 1) + 1
                : 'auto',
            }}
          ></div>
        )}
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
              dragContainerReplace={replace}
              setDropPlace={setDropPlace}
              onItemClick={props.onItemClick}
              draggingItem={draggingItem}
              setDraggingItem={setDraggingItem}
              setIsNeedReplace={setIsNeedReplace}
            />
          );
        })}
      </div>
    </div>
  );
}
