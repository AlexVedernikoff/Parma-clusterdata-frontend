import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

// import './ScrollableListWithSticky.scss';

const b = block('yc-scrollable-list-with-sticky');

class ScrollableListItem extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number,
    style: PropTypes.object,
    selected: PropTypes.bool,
    sticky: PropTypes.bool,
    inactive: PropTypes.bool,
    children: PropTypes.node,
    onClick: PropTypes.func,
    onMouseMove: PropTypes.func,
  };
  onClick = () => {
    if (!this.props.inactive) {
      this.props.onClick(this.props.index);
    }
  };
  onMouseMove = () => {
    if (!this.props.inactive) {
      this.props.onMouseMove(this.props.index);
    }
  };
  render() {
    const { selected, style, sticky, inactive, children } = this.props;

    return (
      <div
        className={b('item', { selected, sticky, inactive })}
        style={style}
        onMouseMove={this.onMouseMove}
        onClick={this.onClick}
      >
        {children}
      </div>
    );
  }
}

export default class ScrollableList extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    itemHeight: PropTypes.number.isRequired,
    renderItem: PropTypes.func.isRequired,
    onItemClick: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    currentIndex: PropTypes.number,
  };
  state = {};
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
    setImmediate(() =>
      this.selectItem(this.findClosestSelectableIndex(this.props.currentIndex)),
    );
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }
  refList = React.createRef();
  findClosestSelectableIndex = (index, step) => {
    const { data } = this.props;
    const dataLength = data.length;
    const normalizedIndex = (index + dataLength) % dataLength;
    if (data[index] && !data[index].inactive) {
      return normalizedIndex;
    }
    for (
      let i = 0, currentIndex = (normalizedIndex + dataLength + step) % dataLength;
      i < dataLength;
      i += 1, currentIndex = (currentIndex + dataLength + step) % dataLength
    ) {
      if (data[currentIndex] && !data[currentIndex].inactive) {
        return currentIndex;
      }
    }
    return undefined;
  };
  onKeyDown = event => {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const { selectedIndex = -1 } = this.state;
        this.selectItem(this.findClosestSelectableIndex(selectedIndex + 1, 1));
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const { selectedIndex = 0 } = this.state;
        this.selectItem(this.findClosestSelectableIndex(selectedIndex - 1, -1));
        break;
      }
      case 'PageUp': {
        event.preventDefault();
        const { selectedIndex = 0, visibleStopIndex, visibleStartIndex } = this.state;
        const pageSize = visibleStopIndex - visibleStartIndex - 1;
        this.selectItem(this.findClosestSelectableIndex(selectedIndex - pageSize, -1));
        break;
      }
      case 'PageDown': {
        event.preventDefault();
        const { selectedIndex = 0, visibleStopIndex, visibleStartIndex } = this.state;
        const pageSize = visibleStopIndex - visibleStartIndex - 1;
        this.selectItem(this.findClosestSelectableIndex(selectedIndex + pageSize, 1));
        break;
      }
      case 'Enter': {
        if (!isNaN(this.state.selectedIndex)) {
          this.onItemClick(this.state.selectedIndex);
        }
        break;
      }
      default:
        break;
    }
  };
  onItemsRendered = itemsRendered => {
    const { visibleStartIndex, visibleStopIndex } = itemsRendered;
    const item = this.props.data[visibleStartIndex];
    const stickyItem = item && (item.sticky ? item : item.stickyItem);
    const stickyItemIndex = stickyItem && this.props.data.indexOf(stickyItem);
    this.setState({
      visibleStartIndex,
      visibleStopIndex,
      stickyItemIndex,
    });
  };
  onMouseMove = index => {
    this.selectItem(index);
  };
  onItemClick = index => {
    this.props.onItemClick(this.props.data[index]);
  };
  selectItem = index => {
    if (this.refList.current) {
      if (!isNaN(index) && index !== this.state.stickyItemIndex) {
        const scrollToIndex = index < this.state.visibleStopIndex ? index - 1 : index;
        this.refList.current.scrollToItem(scrollToIndex);
      }
    }
    this.setState({ selectedIndex: index });
  };
  renderItemInner = ({ item, index, style, sticky }) => (
    <ScrollableListItem
      index={index}
      style={style}
      selected={index === this.state.selectedIndex}
      sticky={sticky}
      inactive={item.inactive}
      onMouseMove={this.onMouseMove}
      onClick={this.onItemClick}
    >
      {this.props.renderItem(item)}
    </ScrollableListItem>
  );
  renderItem = ({ data, index, style }) => {
    const item = data[index];
    return this.renderItemInner({ item, index, style });
  };
  renderStickyItem = () => {
    const { stickyItemIndex } = this.state;
    const stickyItem = this.props.data[stickyItemIndex];
    if (!stickyItem) {
      return null;
    }
    return this.renderItemInner({
      item: stickyItem,
      index: stickyItemIndex,
      sticky: true,
    });
  };
  innerElementRender = ({ children, ...rest }, ref) => {
    return (
      <div ref={ref} {...rest}>
        {this.renderStickyItem()}
        {children}
      </div>
    );
  };
  innerElementType = React.forwardRef(this.innerElementRender);
  render() {
    const { data, itemHeight } = this.props;
    return (
      <div className={b()} style={{ maxHeight: data.length * itemHeight }}>
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={this.refList}
              height={height}
              width={width}
              itemCount={data.length}
              itemSize={itemHeight}
              itemData={data}
              selectedIndex={this.state.selectedIndex}
              innerElementType={this.innerElementType}
              onItemsRendered={this.onItemsRendered}
            >
              {this.renderItem}
            </List>
          )}
        </AutoSizer>
      </div>
    );
  }
}
