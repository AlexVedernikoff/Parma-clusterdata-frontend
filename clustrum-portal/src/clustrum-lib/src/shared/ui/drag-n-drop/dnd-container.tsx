import React, { useEffect, useRef, useState } from 'react';
// TODO: убрать зависимость из старого кода
import { getUniqueId } from '../../../../../utils/helpers';
import { useDrop } from 'react-dnd';
import { DndItem } from './dnd-item';
import { DndItem as IDndItem, DndContainerProps } from './types';

//TODO 696922 деконструировать просы и вынести функции
export function DndContainer(props: DndContainerProps): JSX.Element {
  const [items, setItems] = useState<IDndItem[]>([]);
  const [dropPlace, setDropPlace] = useState<number | null>();
  const [tooltipVisible, setTooltipVisibleState] = useState(false);
  const [usedItem, setUsedItem] = useState<IDndItem>();
  const [action, setAction] = useState<string>();
  const [isNeedToUpdate, setIsNeedToUpdate] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setItems(props.items);
  }, [props.items]);

  useEffect(() => {
    if (props.onUpdate && isNeedToUpdate) {
      props.onUpdate(items, usedItem, action);
      setIsNeedToUpdate(false);
    }
  }, [items]);

  const [, drop] = useDrop(() => ({
    accept: 'ITEM',
    //TODO 696922 вынести в отдельный метод и типизировать
    drop: (item: any, monitor: any): any => {
      const { id } = props;
      const itemType = item.item.type;

      if (id !== item.listId) {
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
          if (!props.checkAllowed(item.item)) {
            return { revert: true };
          }
        }
      }

      const targetIndex =
        typeof dropPlace === 'number'
          ? dropPlace
          : typeof item.hoverIndex === 'number'
          ? item.hoverIndex
          : items.length;

      if (props.id === item.listId) {
        remove(item.index);
      }

      // добавляем в целевой контейнер
      insert(item.item, targetIndex);
    },
  }));

  function setTooltipVisible(visibility: boolean): void {
    setTooltipVisibleState(visibility);
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

      setIsNeedToUpdate(true);
      setUsedItem(insertedItem);
      setAction('insert');
      setItems(prevItems => {
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
    setIsNeedToUpdate(true);
    setUsedItem(removedItem);
    setAction('remove');
    setItems(prev => {
      const filtredItems = prev.filter((_, i) => i !== index);
      return filtredItems;
    });
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
              setDropPlace={setDropPlace}
            />
          );
        })}
      </div>
    </div>
  );
}
