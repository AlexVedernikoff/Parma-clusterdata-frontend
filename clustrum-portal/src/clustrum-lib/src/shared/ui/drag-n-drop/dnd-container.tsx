import React, { useEffect, useRef, useState } from 'react';
import update from 'immutability-helper';
import { getUniqueId } from '../../../../../utils/helpers';
import { useDrop } from 'react-dnd';
import { DndItem } from './dnd-item';
import { findDOMNode } from 'react-dom';
import { DndItemInterface } from './types/dnd-item';
import { DndContainerProps } from './types/dnd-container-props';

export function DndContainer(props: DndContainerProps) {
  console.log(props);
  const [items, setItems] = useState<DndItemInterface[]>(props.items || []);
  const [dropPlaceState, setDropPlaceState] = useState(0);
  const [tooltipVisible, setTooltipVisibleState] = useState(false);
  let ref = React.useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
    drop: (item: any, monitor: any) => {
      const { id } = props;
      console.log('drop start');
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

      // if (targetComponent.doingReplace) {
      //   // сбросим флаг замены
      //   targetComponent.doingReplace = false;

      //   // если дропаем в другой контейнер
      //   if (dropResult.listId !== item.listId) {
      //     let replacedItem = targetComponent.state.items[item.hoverIndex];
      //     const revert = () => {
      //       targetComponent.replace(item.hoverIndex, replacedItem);
      //       props.replace(item.index, item.item);
      //     };

      //     props.replace(item.index, replacedItem, revert);
      //     targetComponent.replace(item.hoverIndex, item.item, revert);
      //   } else {
      //     // свап
      //     targetComponent.swap(item.hoverIndex, item.index);
      //   }
      // }
      // else {
      let targetIndex =
        typeof dropPlaceState === 'number'
          ? dropPlaceState
          : typeof item.hoverIndex === 'number'
          ? item.hoverIndex
          : items.length;

      if (!(props.listId === item.listId && (targetIndex === item.index + 1 || targetIndex === item.index))) {
        // удаляем в исходном контейнере
        remove(item.index);

        // добавляем в целевой контейнер
        push(item.item);
      }
      //}

      console.log('drop end');
      return {
        listId: id,
        dropPlace: dropPlaceState,
        items: items,
      };
    },
    hover: (item, monitor) => hoverItem(item, monitor, props, ref),
  }));

  function setTooltipVisible(visibility: boolean) {
    setTooltipVisibleState(visibility);
  }

  function getTooltipVisible() {
    return tooltipVisible;
  }

  function hoverItem(item: any, monitor: any, props: any, ref: any) {
    console.log('hover start');
    const dragIndex = monitor.getItem().index;
    const hoverIndex = item.index;
    const sourceListId = monitor.getItem().listId;

    // сохраним индекс положения куда мы захуверились
    monitor.getItem().hoverIndex = hoverIndex;

    const domNode = findDOMNode(ref.current) as Element;
    //if(ref.current == null) return;
    const hoverBoundingRect = domNode.getBoundingClientRect();

    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Представьте себе систему координат в евклидовом пространстве, где ось y направлена вниз (ось х не важна):
    // 0 находится там, где верхний край элемента, на который мы попали курсором, пока что-то тащили;
    // elementSize находится там, где нижний край этого же элемента.
    // Зона, которую мы считаем триггером для реплейса - это зона размером с половину элемента от 1/4 его высоты до 3/4 его высоты
    const replaceZoneSize = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const replaceZoneBottom = hoverBoundingRect.bottom - replaceZoneSize / 2 - hoverBoundingRect.top;
    const replaceZoneTop = replaceZoneSize / 2;

    if (hoverClientY < replaceZoneTop) {
      if (!(item.listId === sourceListId && (dragIndex === hoverIndex || dragIndex === hoverIndex - 1))) {
        setDropPlace(hoverIndex);
      }
    } else if (replaceZoneBottom < hoverClientY) {
      if (!(item.listId === sourceListId && (dragIndex === hoverIndex + 1 || dragIndex === hoverIndex))) {
        setDropPlace(hoverIndex + 1);
      }
    } else {
      setDropPlace(null);
    }
    console.log('hover end');
  }

  //Вроде не используется
  function move(dragIndex: any, hoverIndex: any) {
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

  //Вроде не используется
  function push(item: DndItemInterface) {
    // по умолчанию пушим всегда
    let push = true;

    // если контейнер работает в режиме с копированиями из себя, то не добавляем
    if (props.noRemove) {
      push = items.indexOf(item) === -1;
    }

    if (push) {
      const pushedItem = { ...item };

      pushedItem.id = getUniqueId('inserted');

      setItems(prev => [...prev, pushedItem]);

      if (props.onUpdate) {
        props.onUpdate(items, pushedItem);
      }
    }
  }

  function insert(item: any, index: any, onUndoInsert?: any) {
    // по умолчанию пушим всегда
    let insert = true;

    // если контейнер работает в режиме с копированиями из себя, то не добавляем
    if (props.noRemove) {
      insert = items.indexOf(item) === -1;
    }

    if (insert) {
      const insertedItem = { ...item };

      insertedItem.id = getUniqueId('inserted');

      setItems(
        update(items, {
          $splice: [[index, 0, insertedItem]],
        }),
      );

      if (props.onUpdate) {
        props.onUpdate(items, insertedItem, 'insert', onUndoInsert);
      }
    }
  }

  function replace(index: any, item: any, onUndoReplace: any, noUpdate: any) {
    setItems(
      update(items, {
        $splice: [[index, 1, item]],
      }),
    );

    if (props.onUpdate && !noUpdate) {
      props.onUpdate(items, item, 'replace', onUndoReplace);
    }
  }

  function swap(indexA: any, indexB: any) {
    if (props.noSwap) {
      return;
    }

    const itemA = items[indexA];

    items[indexA] = items[indexB];
    items[indexB] = itemA;

    setItems(items);

    if (props.onUpdate) {
      props.onUpdate(items);
    }
  }

  function remove(index: any) {
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

  function setDropPlace(dropPlace: any) {
    setDropPlaceState(dropPlace);
  }

  const { disabled } = props;

  let dropPlaceExists = false;
  let canDrop = false;

  // if (draggingItem && draggingItem.item) {
  //   dropPlaceExists = typeof dropPlaceState === 'number';
  //   if (props.noDropPlace) {
  //     dropPlaceExists = false;
  //   }

  //   if (isOver) {
  //     if (!dropPlaceExists && items.length === 0) {
  //       dropPlaceExists = true;
  //       setDropPlace(0);
  //     }
  //   } else {
  //     dropPlaceExists = false;
  //   }

  //   if (props.allowedTypes) {
  //     canDrop = props.allowedTypes.has(draggingItem.item.type);
  //   } else if (props.checkAllowed) {
  //     canDrop = props.checkAllowed(draggingItem.item);
  //   } else {
  //     canDrop = true;
  //   }

  //   if (props.capacity && props.capacity <= items.length) {
  //     dropPlaceExists = false;
  //   }

  //   if (!canDrop) {
  //     dropPlaceExists = false;
  //   }
  // }

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
      <div ref={drop} className={`dnd-container${canDrop ? ' can-drop' : ''}${isOver ? ' is-over' : ''}`}>
        {
          <div
            className="drop-place"
            style={{
              display: dropPlaceExists ? 'block' : 'none',
              top: dropPlaceExists
                ? dropPlaceState === 0
                  ? -4
                  : dropPlaceState * 32 + 4 * (dropPlaceState - 1) + 1
                : 'auto',
            }}
          ></div>
        }
        {title}

        {items.map((item: any, index: any) => {
          return (
            <DndItem
              key={`${item.id}-${index}`}
              className={props.itemsClassName || ''}
              item={item}
              // draggingItem={draggingItem}
              index={index}
              listId={props.id}
              listAllowedTypes={props.allowedTypes}
              // listCheckAllowed={
              //   props.checkAllowed
              //     ? (item: any) => {
              //         return props.checkAllowed(item);
              //       }
              //     : null
              // }
              listNoRemove={props.noRemove}
              remove={remove}
              replace={replace}
              move={move}
              insert={insert}
              wrapTo={props.wrapTo}
              disabled={disabled}
              setDropPlace={setDropPlace}
              setTooltipVisible={setTooltipVisible}
              getTooltipVisible={getTooltipVisible}
            />
          );
        })}
      </div>
    </div>
  );
}
