// import React, { Component } from 'react';
// import update from 'immutability-helper';
// import { DragDropContext, DropTarget } from 'react-dnd';
// import HTML5Backend from 'react-dnd-html5-backend';
// import DNDItem from './DNDItem';

// import { getUniqueId } from '../../../../../../utils/helpers';

// class DNDContainer extends Component {
//   constructor(props) {
//     super(props);

//     const items = props.items || [];

//     this.state = {
//       items,
//     };
//   }

//   componentWillReceiveProps(nextProps) {
//     if (this.state.items !== nextProps.items) {
//       this.setState({ items: nextProps.items });
//     }
//   }

//   push(item) {
//     // по умолчанию пушим всегда
//     let push = true;

//     // если контейнер работает в режиме с копированиями из себя, то не добавляем
//     if (this.props.noRemove) {
//       push = this.state.items.indexOf(item) === -1;
//     }

//     if (push) {
//       const pushedItem = { ...item };

//       pushedItem.id = getUniqueId('inserted');

//       this.setState(
//         update(this.state, {
//           items: {
//             $push: [pushedItem],
//           },
//         }),
//       );

//       if (this.props.onUpdate) {
//         this.props.onUpdate(this.state.items, pushedItem);
//       }
//     }
//   }

//   insert(item, index, onUndoInsert) {
//     // по умолчанию пушим всегда
//     let insert = true;

//     // если контейнер работает в режиме с копированиями из себя, то не добавляем
//     if (this.props.noRemove) {
//       insert = this.state.items.indexOf(item) === -1;
//     }

//     if (insert) {
//       const insertedItem = { ...item };

//       insertedItem.id = getUniqueId('inserted');

//       this.setState(
//         update(this.state, {
//           items: {
//             $splice: [[index, 0, insertedItem]],
//           },
//         }),
//       );

//       if (this.props.onUpdate) {
//         this.props.onUpdate(this.state.items, insertedItem, 'insert', onUndoInsert);
//       }
//     }
//   }

//   replace(index, item, onUndoReplace, noUpdate) {
//     this.setState(
//       update(this.state, {
//         items: {
//           $splice: [[index, 1, item]],
//         },
//       }),
//     );

//     if (this.props.onUpdate && !noUpdate) {
//       this.props.onUpdate(this.state.items, item, 'replace', onUndoReplace);
//     }
//   }

//   swap(indexA, indexB) {
//     if (this.props.noSwap) {
//       return;
//     }

//     const itemA = this.state.items[indexA];

//     this.state.items[indexA] = this.state.items[indexB];
//     this.state.items[indexB] = itemA;

//     this.setState({
//       items: this.state.items,
//     });

//     if (this.props.onUpdate) {
//       this.props.onUpdate(this.state.items);
//     }
//   }

//   remove(index) {
//     // если контейнер работает в режиме с копированиями из себя, то не удаляем
//     if (this.props.noRemove) {
//       return;
//     }

//     const removedItems = this.state.items.splice(index, 1);

//     this.setState({
//       items: this.state.items,
//     });

//     if (this.props.onUpdate) {
//       this.props.onUpdate(this.state.items, removedItems[0], 'remove');
//     }
//   }

//   move(dragIndex, hoverIndex) {
//     const { items } = this.state;
//     const dragItem = items[dragIndex];

//     this.setState(
//       update(this.state, {
//         items: {
//           $splice: [
//             [dragIndex, 1],
//             [hoverIndex, 0, dragItem],
//           ],
//         },
//       }),
//     );

//     if (this.props.onUpdate) {
//       this.props.onUpdate(this.state.items);
//     }
//   }

//   setDropPlace(dropPlace) {
//     this.setState({
//       dropPlace,
//     });
//   }

//   render() {
//     let { items, dropPlace } = this.state;
//     const { isOver, item: draggingItem, connectDropTarget, disabled } = this.props;

//     let dropPlaceExists = false;
//     let canDrop = false;

//     if (draggingItem && draggingItem.item) {
//       dropPlaceExists = typeof dropPlace === 'number';
//       if (this.props.noDropPlace) {
//         dropPlaceExists = false;
//       }

//       if (isOver) {
//         if (!dropPlaceExists && items.length === 0) {
//           dropPlaceExists = true;
//           dropPlace = 0;
//         }
//       } else {
//         dropPlaceExists = false;
//       }

//       if (this.props.allowedTypes) {
//         canDrop = this.props.allowedTypes.has(draggingItem.item.type);
//       } else if (this.props.checkAllowed) {
//         canDrop = this.props.checkAllowed(draggingItem.item);
//       } else {
//         canDrop = true;
//       }

//       if (this.props.capacity && this.props.capacity <= this.state.items.length) {
//         dropPlaceExists = false;
//       }

//       if (!canDrop) {
//         dropPlaceExists = false;
//       }
//     }

//     let title;
//     if (this.props.title) {
//       title = (
//         <div className="subheader dimensions-subheader dimensions-dataset">
//           <span> {this.props.title}</span>
//         </div>
//       );
//     }

//     return connectDropTarget(
//       <div className={`dnd-container${canDrop ? ' can-drop' : ''}${isOver ? ' is-over' : ''}`}>
//         {
//           <div
//             className="drop-place"
//             style={{
//               display: dropPlaceExists ? 'block' : 'none',
//               top: dropPlaceExists ? (dropPlace === 0 ? -4 : dropPlace * 32 + 4 * (dropPlace - 1) + 1) : 'auto',
//             }}
//           ></div>
//         }
//         {title}

//         {items.map((item, index) => {
//           return (
//             <DNDItem
//               key={`${item.id}-${index}`}
//               className={this.props.itemsClassName || ''}
//               item={item}
//               draggingItem={draggingItem}
//               index={index}
//               listId={this.props.id}
//               listAllowedTypes={this.props.allowedTypes}
//               listCheckAllowed={
//                 this.props.checkAllowed
//                   ? item => {
//                       return this.props.checkAllowed(item);
//                     }
//                   : null
//               }
//               listNoRemove={this.props.noRemove}
//               remove={this.remove.bind(this)}
//               replace={this.replace.bind(this)}
//               move={this.move.bind(this)}
//               insert={this.insert.bind(this)}
//               setDropPlace={this.setDropPlace.bind(this)}
//               wrapTo={this.props.wrapTo.bind(this)}
//               disabled={disabled}
//             />
//           );
//         })}
//       </div>,
//     );
//   }
// }

// const itemTarget = {
//   drop(props, monitor, component) {
//     const { id } = props;

//     const sourceObj = monitor.getItem();
//     const itemType = sourceObj.item.type;

//     if (id !== sourceObj.listId) {
//       // отменяем, если не вмещается (но если не разрешена замена)
//       if (
//         component.props.capacity &&
//         component.props.capacity <= component.state.items.length &&
//         !component.doingReplace
//       ) {
//         return {
//           revert: true,
//         };
//       }

//       // отменяем, если не подходит по типу
//       if (component.props.allowedTypes) {
//         if (!component.props.allowedTypes.has(itemType)) {
//           return {
//             revert: true,
//           };
//         }
//       } else if (component.props.checkAllowed) {
//         if (!component.props.checkAllowed(sourceObj.item)) {
//           return {
//             revert: true,
//           };
//         }
//       }
//     }

//     return {
//       listId: id,
//       targetComponent: component,
//     };
//   },
// };

// export default DragDropContext(HTML5Backend)(
//   DropTarget('ITEM', itemTarget, (connect, monitor) => ({
//     connectDropTarget: connect.dropTarget(),
//     isOver: monitor.isOver(),
//     canDrop: monitor.canDrop(),
//     item: monitor.getItem(),
//   }))(DNDContainer),
// );
