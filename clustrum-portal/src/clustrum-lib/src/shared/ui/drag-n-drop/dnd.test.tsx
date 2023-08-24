import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DndContainer } from './dnd-container';
import { DndItemData, DndItemProps } from './types';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const itemsContainer1: DndItemData[] = [
  { id: '1', title: 'Item 1', type: 'DIMENSION', datasetName: 'test', className: '' },
  { id: '2', title: 'Item 2', type: 'DIMENSION', datasetName: 'test', className: '' },
  { id: '3', title: 'Item 3', type: 'DIMENSION', datasetName: 'test', className: '' },
];
const itemsContainer2: DndItemData[] = [
  { id: '4', title: 'Item 4', type: 'DIMENSION', datasetName: 'test', className: '' },
  { id: '5', title: 'Item 5', type: 'DIMENSION', datasetName: 'test', className: '' },
];

const itemSize = {
  height: 40,
  margin: 12,
};

const renderDatasetItem = (props: DndItemProps<DndItemData>): JSX.Element => {
  const { itemData, draggedItem } = props;
  const dragHoveredClassName = `drag-hovered`;

  return (
    <div
      key={itemData.id}
      title={itemData.title}
      draggable="true"
      onDragOver={(e): void => {
        if (itemData.type === 'PSEUDO') {
          return;
        }
        if (draggedItem === null) {
          return;
        }

        const element = e.currentTarget;

        //getBoundingClientRect возвращает все поля нулевыми
        //т.к. по факту jsdom ничего не рендерит.
        //зададим положение айтема вречную
        const top = 224.625;
        const bottom = 264.625;
        const clientY = 250;
        const y = clientY - top;

        const elementSize = bottom - top;
        const replaceZoneSize = elementSize / 2;

        const inReplaceZone =
          replaceZoneSize / 2 < y && y < elementSize - replaceZoneSize / 2;

        if (inReplaceZone) {
          let drawReplace;

          if (props?.containerAllowedTypes) {
            drawReplace = props?.containerAllowedTypes.has(draggedItem.data.type);
          } else if (props?.containerCheckAllowed) {
            drawReplace = props?.containerCheckAllowed(draggedItem.data);
          } else {
            drawReplace = false;
          }

          if (drawReplace && element.className.indexOf(dragHoveredClassName) === -1) {
            element.className += ` ${dragHoveredClassName}`;
          }
        } else {
          element.className = element.className.replace(` ${dragHoveredClassName}`, '');
        }
      }}
      onDrop={(e): void => {
        const element = e.currentTarget;

        if (element.className.indexOf(dragHoveredClassName) > -1) {
          element.className = element.className.replace(` ${dragHoveredClassName}`, '');
          props.setIsNeedReplace(true);
        }
      }}
    >
      <div className="item-title" title={itemData.datasetName + '.' + itemData.title}>
        {itemData.title}
      </div>
    </div>
  );
};

const startDragAndDrop = (draggableItem: Element, dropZone: Element): void => {
  fireEvent.dragStart(draggableItem);
  fireEvent.dragEnter(dropZone);
  fireEvent.dragOver(dropZone);
  fireEvent.drop(dropZone);
};

describe('Drag and Drop Interaction', () => {
  it('Перенос элемента с удалением из исходного контейнера', () => {
    //Пример - из одного контейнера визуализации в другой

    render(
      <DndProvider backend={HTML5Backend}>
        <DndContainer
          id="container1"
          isNeedRemove
          title="Контейнер 1"
          items={itemsContainer1}
          wrapTo={renderDatasetItem}
          itemSize={itemSize}
        />
        <DndContainer
          id="container2"
          isNeedRemove
          title="Контейнер 2"
          items={itemsContainer2}
          wrapTo={renderDatasetItem}
          itemSize={itemSize}
        />
      </DndProvider>,
    );

    //берем нулевой элемент т.к. такой тайтл есть не только у нужного блока
    let draggableItem = screen.getAllByTitle('Item 1')[0];
    const dropZoneContainer2 = screen.getAllByTitle('dnd-container')[1];
    const dropZoneContainer1 = screen.getAllByTitle('dnd-container')[0];

    startDragAndDrop(draggableItem, dropZoneContainer2);

    expect(dropZoneContainer2).toHaveTextContent('Item 1');
    expect(dropZoneContainer1).not.toHaveTextContent('Item 1');

    draggableItem = screen.getAllByTitle('Item 5')[0];

    startDragAndDrop(draggableItem, dropZoneContainer1);

    expect(dropZoneContainer1).toHaveTextContent('Item 5');
    expect(dropZoneContainer2).not.toHaveTextContent('Item 5');
  });

  it('Перенос элемента без удаления из исходного контейнера', () => {
    //Пример - из датасета в визуализации

    render(
      <DndProvider backend={HTML5Backend}>
        <DndContainer
          id="container1"
          title="Контейнер 1"
          items={itemsContainer1}
          wrapTo={renderDatasetItem}
          itemSize={itemSize}
        />
        <DndContainer
          id="container2"
          isNeedRemove
          title="Контейнер 2"
          items={itemsContainer2}
          wrapTo={renderDatasetItem}
          itemSize={itemSize}
        />
      </DndProvider>,
    );

    const draggableItem = screen.getAllByTitle('Item 1')[0];
    const dropZoneContainer2 = screen.getAllByTitle('dnd-container')[1];
    const dropZoneContainer1 = screen.getAllByTitle('dnd-container')[0];

    startDragAndDrop(draggableItem, dropZoneContainer2);

    expect(dropZoneContainer2).toHaveTextContent('Item 1');
    expect(dropZoneContainer1).toHaveTextContent('Item 1');
  });

  it('Замена элемента без удаления из исходного контейнера', () => {
    const containerAllowedTypes = new Set(['DIMENSION', 'MEASURE']);

    render(
      <DndProvider backend={HTML5Backend}>
        <DndContainer
          id="container1"
          allowedTypes={containerAllowedTypes}
          title="Контейнер 1"
          items={itemsContainer1}
          wrapTo={renderDatasetItem}
          itemSize={itemSize}
        />
        <DndContainer
          id="container2"
          allowedTypes={containerAllowedTypes}
          isNeedRemove
          title="Контейнер 2"
          items={itemsContainer2}
          wrapTo={renderDatasetItem}
          itemSize={itemSize}
        />
      </DndProvider>,
    );

    const draggableItem = screen.getAllByTitle('Item 1')[0];
    const dropZoneItem5 = screen.getAllByTitle('Item 5')[0];
    const container1 = screen.getAllByTitle('dnd-container')[0];

    startDragAndDrop(draggableItem, dropZoneItem5);

    const itemsInContainer2 = screen.getAllByTitle('dnd-container')[1].childNodes;
    const itemTitlesInContainer2 = Array.from(itemsInContainer2)
      .slice(1) //избавляемся от спана с названием контейнера
      .map(item => item.textContent);

    expect(container1).toHaveTextContent('Item 1');
    expect(itemTitlesInContainer2).toEqual(['Item 4', 'Item 1']);
  });

  it('Провекра соответствия типов контейнера', () => {
    const containerAllowedTypes = new Set(['MEASURE']);

    render(
      <DndProvider backend={HTML5Backend}>
        <DndContainer
          id="container1"
          title="Контейнер 1"
          isNeedRemove
          items={itemsContainer1}
          wrapTo={renderDatasetItem}
          itemSize={itemSize}
        />
        <DndContainer
          id="container2"
          allowedTypes={containerAllowedTypes}
          isNeedRemove
          title="Контейнер 2"
          items={itemsContainer2}
          wrapTo={renderDatasetItem}
          itemSize={itemSize}
        />
      </DndProvider>,
    );

    const draggableItem = screen.getAllByTitle('Item 1')[0];
    const dropZoneContainer2 = screen.getAllByTitle('dnd-container')[1];
    const dropZoneContainer1 = screen.getAllByTitle('dnd-container')[0];

    startDragAndDrop(draggableItem, dropZoneContainer2);

    expect(dropZoneContainer2).not.toHaveTextContent('Item 1');
    expect(dropZoneContainer1).toHaveTextContent('Item 1');
  });
});
