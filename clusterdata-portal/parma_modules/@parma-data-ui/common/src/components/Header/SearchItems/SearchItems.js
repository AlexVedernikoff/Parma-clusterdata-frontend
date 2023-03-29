import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import _debounce from 'lodash/debounce';
import Loader from '../../Loader';

// import './SearchItems.scss';

const b = block('yc-header-search');
const DEBOUNCE_DELAY = 350;
const ITEM_HEIGHT = 40;

export default class SearchItems extends React.PureComponent {
  static propTypes = {
    getItems: PropTypes.func.isRequired,
    selectItem: PropTypes.func,
    getIcon: PropTypes.func,
    getPrimaryMeta: PropTypes.func,
    getSecondaryMeta: PropTypes.func,
    width: PropTypes.number,
    searchPattern: PropTypes.string,
  };

  state = {
    items: [],
    isLoading: false,
    focusedItemIndex: -1,
  };

  componentDidUpdate(prevProps) {
    const { searchPattern } = this.props;
    const prevSearchPattern = prevProps.searchPattern;

    if (searchPattern && searchPattern !== prevSearchPattern) {
      if (this.debouncedFetchItems) {
        this.debouncedFetchItems.cancel();
      }

      this.setState({ isLoading: true });
      this.debouncedFetchItems = _debounce(this._fetchItems, DEBOUNCE_DELAY);
      this.debouncedFetchItems();
    }
  }

  ref = React.createRef();

  focusedItemRef = React.createRef();

  async _fetchItems() {
    const { getItems, searchPattern } = this.props;

    const items = await getItems(searchPattern);

    if (searchPattern !== this.props.searchPattern) {
      return;
    }

    this.setState({
      items,
      isLoading: false,
      focusedItemIndex: 0,
    });
  }

  setFocusedItemIndex = step => {
    const { items = [] } = this.state;

    const focusedItemIndex = (this.state.focusedItemIndex + step + items.length) % items.length;

    if (isNaN(focusedItemIndex)) {
      return;
    }

    this.setState({ focusedItemIndex }, this._scrollToFocusedItem);
  };

  getFocusedItem = () => {
    const { focusedItemIndex, items = [] } = this.state;

    return items[focusedItemIndex];
  };

  _scrollToFocusedItem() {
    const wrapNode = this.ref.current;
    const itemNode = this.focusedItemRef.current;
    const wrapHeight = wrapNode.getBoundingClientRect().height;

    if (!itemNode) {
      return;
    }

    if (itemNode.offsetTop + ITEM_HEIGHT > wrapHeight + wrapNode.scrollTop) {
      wrapNode.scrollTop = itemNode.offsetTop + ITEM_HEIGHT - wrapHeight;
    } else if (itemNode.offsetTop < wrapNode.scrollTop) {
      wrapNode.scrollTop = itemNode.offsetTop;
    }
  }

  _getOnMouseMoveItemHandler(itemIndex) {
    return () => {
      const { focusedItemIndex } = this.state;

      if (itemIndex !== focusedItemIndex) {
        this.setState({ focusedItemIndex: itemIndex }, this._scrollToFocusedItem);
      }
    };
  }

  _getItem(item, index) {
    const { selectItem, getIcon, getPrimaryMeta, getSecondaryMeta } = this.props;
    const { focusedItemIndex } = this.state;
    const focused = focusedItemIndex === index;

    return (
      <div
        ref={focused ? this.focusedItemRef : null}
        key={item.key || item.title}
        className={b('item', { focused })}
        onClick={() => selectItem(item)}
        onMouseMove={this._getOnMouseMoveItemHandler(index)}
      >
        {Boolean(getIcon) && <div className={b('item-icon')}>{getIcon(item)}</div>}

        <div className={b('item-title')}>{item.title}</div>

        {Boolean(getSecondaryMeta) && <div className={b('item-meta')}>{getSecondaryMeta(item)}</div>}
        {Boolean(getPrimaryMeta) && <div className={b('item-meta')}>{getPrimaryMeta(item)}</div>}
      </div>
    );
  }

  _getItemList() {
    const { items = [] } = this.state;

    return items.map((item, index) => this._getItem(item, index));
  }

  _renderContent() {
    const { searchPattern } = this.props;
    const { items = [], isLoading } = this.state;

    if (isLoading) {
      return (
        <div className={b('loader')}>
          <Loader size="s" />
        </div>
      );
    }

    if (searchPattern && !items.length) {
      return <div className={b('not-found')}>{`По запросу "${searchPattern}" ничего не найдено`}</div>;
    }

    return this._getItemList();
  }

  render() {
    const { width } = this.props;

    return (
      <div ref={this.ref} className={b()} style={{ width }}>
        {this._renderContent()}
      </div>
    );
  }
}
