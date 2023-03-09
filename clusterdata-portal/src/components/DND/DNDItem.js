import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {DragSource, DropTarget} from 'react-dnd';
import flow from 'lodash/flow';

const itemSource = {
    canDrag(props) {
        const {undragable} = props.item;

        return !(undragable || props.disabled);
    },
    beginDrag(props) {
        return {
            className: 'is-dragging',
            index: props.index,
            listId: props.listId,
            listAllowedTypes: props.listAllowedTypes,
            listCheckAllowed: props.listCheckAllowed,
            listNoRemove: props.listNoRemove,
            item: props.item
        };
    },
    endDrag(props, monitor) {
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();

        if (!dropResult)
            return;

        // завершение перетягивания без результатов - откатываем все как было
        if (dropResult.revert)
            return;

        if (dropResult) {
            const {targetComponent} = dropResult;
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
                let targetIndex = typeof dropPlace === 'number'
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
};

const itemTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        const sourceListId = monitor.getItem().listId;

        // сохраним индекс положения куда мы захуверились
        monitor.getItem().hoverIndex = hoverIndex;

        const domNode = findDOMNode(component);
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
            if (!(props.listId === sourceListId && (dragIndex === hoverIndex || dragIndex === hoverIndex - 1))) {
                props.setDropPlace(hoverIndex);
            }
        } else if (replaceZoneBottom < hoverClientY) {
            if (!(props.listId === sourceListId && (dragIndex === hoverIndex + 1 || dragIndex === hoverIndex))) {
                props.setDropPlace(hoverIndex + 1);
            }
        } else {
            props.setDropPlace(null);
        }
    }
};

class DNDItem extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const {connectDragSource, connectDropTarget, connectDragPreview} = this.props;

        return connectDragPreview(
            connectDragSource(connectDropTarget(
                this.props.wrapTo(this.props, this)
            )), {
                captureDraggingState: false,
                offsetX: 0,
                offsetY: 0
            }
        );
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    }
}

export default flow(
    DropTarget('ITEM', itemTarget, connect => ({
        connectDropTarget: connect.dropTarget()
    })),
    DragSource('ITEM', itemSource, collect)
)(DNDItem);