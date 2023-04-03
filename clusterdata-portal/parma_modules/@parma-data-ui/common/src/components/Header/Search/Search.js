import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import { TextInput, Popup } from 'lego-on-react';
import SearchItems from '../SearchItems/SearchItems';

// import './Search.scss';

const b = block('yc-header');
const BORDER_WIDTH_OFFSET = 2;

export default class Search extends React.PureComponent {
  static propTypes = {
    onItemClickHandler: PropTypes.func.isRequired,
  };

  state = {
    isSuggestVisible: false,
    isFocused: false,
    isSearchAvailable: true,
    searchInputValue: '',
  };

  static getDerivedStateFromProps(props, state) {
    const { searchInputValue } = state;
    const { isFocused } = state;

    if (!searchInputValue) {
      return { isSuggestVisible: false };
    }

    if (searchInputValue && isFocused) {
      return { isSuggestVisible: true };
    }

    return state;
  }

  componentDidMount() {
    window.addEventListener('resize', this.setItemsWrapperWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setItemsWrapperWidth);
  }

  inputRef = React.createRef();

  itemsRef = React.createRef();

  getInputWidth = () => {
    return this.inputNode.getBoundingClientRect().width;
  };

  setItemsWrapperWidth = () => {
    if (!this.inputNode) {
      return;
    }

    this.setState({ width: this.getInputWidth() });
  };

  setInputNode = ref => {
    this.inputNode = ref;
  };

  selectItem = item => {
    if (!item) {
      return;
    }

    const { onItemClickHandler } = this.props;

    onItemClickHandler(item);

    this.inputNode.blur();

    this.setState({
      isSuggestVisible: false,
      searchInputValue: item.title,
      isSearchAvailable: false,
    });
  };

  onInputKeyDown = async e => {
    const { searchInputValue, isSearchAvailable } = this.state;

    if (!searchInputValue) {
      return;
    }

    const { current: itemsWrapper } = this.itemsRef;

    switch (e.key) {
      case 'Enter':
        this.selectItem(itemsWrapper.getFocusedItem());
        return;
      case 'ArrowUp':
        e.nativeEvent.preventDefault();
        itemsWrapper.setFocusedItemIndex(-1);
        return;
      case 'ArrowDown':
        itemsWrapper.setFocusedItemIndex(1);
        return;
    }

    if (!isSearchAvailable) {
      this.setState({ isSearchAvailable: true });
    }
  };

  onInputChange = val => this.setState({ searchInputValue: val });

  onInputFocus = () => {
    this.setState({
      isFocused: true,
      isSearchAvailable: true,
      width: this.getInputWidth(),
    });
  };

  onInputBlur = () => this.setState({ isFocused: false });

  onOutsidePopupClickHandler = () => this.setState({ isSuggestVisible: false });

  render() {
    const { width, isSuggestVisible, isSearchAvailable, searchInputValue } = this.state;

    return (
      <div className={b('search-section')}>
        <TextInput
          ref={this.inputRef}
          innerRef={this.setInputNode}
          theme="normal"
          size="m"
          view="default"
          tone="default"
          text={searchInputValue}
          onChange={this.onInputChange}
          onFocus={this.onInputFocus}
          onBlur={this.onInputBlur}
          onKeyDown={this.onInputKeyDown}
          placeholder="Поиск"
          hasClear
        />
        <Popup
          cls={b('suggest')}
          theme="normal"
          visible={isSuggestVisible}
          anchor={this.inputRef.current}
          onOutsideClick={this.onOutsidePopupClickHandler}
        >
          <SearchItems
            {...this.props}
            ref={this.itemsRef}
            width={width - BORDER_WIDTH_OFFSET}
            searchPattern={isSearchAvailable ? searchInputValue : undefined}
            selectItem={this.selectItem}
          />
        </Popup>
      </div>
    );
  }
}
