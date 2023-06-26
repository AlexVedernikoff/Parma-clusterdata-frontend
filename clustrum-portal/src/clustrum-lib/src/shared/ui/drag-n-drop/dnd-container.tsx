import React, { useEffect, useRef, useState } from 'react';
// TODO: убрать зависимость из старого кода
import { getUniqueId } from '../../../../../utils/helpers';
import { useDrop } from 'react-dnd';
import { DndItem } from './dnd-item';
import { DndItem as IDndItem, DndContainerProps } from './types';

//TODO 696922 деконструировать просы и вынести функции
// eslint-disable-next-line max-lines-per-function
export function DndContainer(props: DndContainerProps): JSX.Element {
  const [items, setItems] = useState<IDndItem[]>(props.items || []);
  const [dropPlace, setDropPlace] = useState<number | null>();
  const [tooltipVisible, setTooltipVisibleState] = useState<boolean>(false);
  const [usedItem, setUsedItem] = useState<IDndItem>();
  const [action, setAction] = useState<string>();
  const [isNeedToUpdate, setIsNeedToUpdate] = useState<boolean>(false);
  const [isNeedReplace, setIsNeedReplace] = useState<boolean>(true);
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

  useEffect(() => {
    if (!isNeedReplace) {
      setIsNeedReplace(true);
    }
  }, [isNeedReplace]);

  const [, drop] = useDrop(() => ({
    accept: 'ITEM',
    //TODO 696922 вынести в отдельный метод и типизировать
    drop: (itemWrapper: any, monitor: any): any => {
      const { id } = props;
      const itemType = itemWrapper.item.type;
      const replacedItem = items[itemWrapper.hoverIndex] ?? itemWrapper.item;

      if (id !== itemWrapper.listId) {
        // отменяем, если не вмещается (но если не разрешена замена)
        if (props.capacity && props.capacity <= items.length && !isNeedReplace) {
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

      const targetIndex =
        typeof dropPlace === 'number'
          ? dropPlace
          : typeof itemWrapper.hoverIndex === 'number'
          ? itemWrapper.hoverIndex
          : items.length;

      if (props.id === itemWrapper.listId) {
        remove(itemWrapper.index);
      }

      // добавляем в целевой контейнер
      insert(itemWrapper.item, targetIndex);

      return {
        targetItem: replacedItem,
        dropedItem: props,
        replace,
        isNeedReplace,
        onSetReplaced: setIsNeedReplace,
      };
    },
  }));

  function setTooltipVisible(visibility: boolean): void {
    setTooltipVisibleState(visibility);
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
    setUsedItem(item);
    setAction('replace');
    setItems(() => {
      items.splice(index, 1, item);
      setIsNeedToUpdate(true);
      return items;
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
              replace={replace}
              setDropPlace={setDropPlace}
            />
          );
        })}
      </div>
    </div>
  );
}
