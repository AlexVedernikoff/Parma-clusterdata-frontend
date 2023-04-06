import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import _debounce from 'lodash/debounce';
import { Popup, Button } from 'lego-on-react';
import Icon from '../Icon/Icon';
import Search from './Search/Search';
import Items from './Items/Items';
import { LEGO_POPUP_MIX_CLASS } from '../constants';
import trans from './i18n';
import { SelectTypes } from './types/SelectTypes';
import arrowIcon from '../../assets/icons/chevron.svg';

const bControl = block('yc-select-control');
const bAction = block('yc-select-action');
const bPopup = block('yc-select-popup');

const DEBOUNCE_DELAY = 350;
const EMPTY_VALUE = '—';
const AVAILABLE_POPUP_DIRECTIONS = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];
const ItemShape = PropTypes.shape({
  value: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
  meta: PropTypes.string,
  icon: PropTypes.node,
  disabled: PropTypes.bool,
});
const ItemsGroupShape = PropTypes.shape({
  groupTitle: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(ItemShape),
});

export default class YCSelect extends React.PureComponent {
  static INIT_ITEMS_PLACEHOLDER = 'Fetching initial items...';

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    getItems: PropTypes.func,
    addItem: PropTypes.func,
    size: PropTypes.oneOf(['s']),
    type: PropTypes.oneOf([SelectTypes.Single, SelectTypes.Multiple]),
    cls: PropTypes.string,
    popupCls: PropTypes.string,
    label: PropTypes.string,
    controlWidth: PropTypes.number,
    popupWidth: PropTypes.number,
    itemsPageSize: PropTypes.number,
    virtualizeThreshold: PropTypes.number,
    showSearch: PropTypes.bool,
    showArrow: PropTypes.bool,
    showApply: PropTypes.bool,
    showItemIcon: PropTypes.bool,
    showItemMeta: PropTypes.bool,
    allowEmptyValue: PropTypes.bool,
    hiding: PropTypes.bool,
    disabled: PropTypes.bool,
    stretched: PropTypes.bool,
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.arrayOf(ItemShape), PropTypes.arrayOf(ItemsGroupShape)]),
    value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    placeholder: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        icon: PropTypes.node.isRequired,
      }),
    ]),
  };

  static defaultProps = {
    size: 's',
    itemsPageSize: 100,
    virtualizeThreshold: 100,
    type: SelectTypes.Single,
    items: [],
    showSearch: true,
    showArrow: true,
    stretched: true,
    showApply: false,
    showItemIcon: false,
    showItemMeta: false,
    allowEmptyValue: false,
    hiding: false,
    disabled: false,
  };

  static getDerivedStateFromProps(props, state) {
    const changedState = {};

    const isPropsItemsChange = props.items !== state.prevPropsItems && !props.getItems;

    if (isPropsItemsChange) {
      changedState.prevPropsItems = props.items;
      changedState.items = props.items;
      changedState.isItemsGrouped = YCSelect.isItemsGrouped(props.items);

      if (state.inputValue) {
        const regExp = new RegExp(state.inputValue, 'i');

        if (changedState.isItemsGrouped) {
          changedState.shownItems = props.items.map(group => {
            const groupItems = group.items.filter(item => regExp.test(item.title));
            return {
              groupTitle: group.groupTitle,
              items: groupItems,
            };
          });
        } else {
          changedState.shownItems = props.items.filter(item => regExp.test(item.title));
        }
      } else {
        changedState.shownItems = props.items;
      }
    }

    if (props.value !== state.prevPropsValue || isPropsItemsChange) {
      const innerValue = YCSelect.getInnerValue(props.value);
      changedState.prevPropsValue = props.value;
      changedState.innerValue = innerValue;

      const items = props.getItems ? state.items : props.items;

      if (props.type === SelectTypes.Single && props.showItemIcon) {
        changedState.singleSelectItem = YCSelect.getSingleSelectedItem(items, innerValue);
      }

      changedState.titles = YCSelect.getTitles(items, innerValue);
    }

    return Object.keys(changedState).length > 0 ? changedState : null;
  }

  static getInnerValue(propsValue) {
    if (!propsValue) {
      return new Set();
    }

    return new Set(Array.isArray(propsValue) ? propsValue.filter(Boolean) : [propsValue]);
  }

  static getTitles(items, innerValue) {
    if (!innerValue.size) {
      return [];
    }

    const isItemsGrouped = YCSelect.isItemsGrouped(items);

    if (isItemsGrouped) {
      return items
        .map(({ items: groupedItems }) => {
          return groupedItems.filter(item => innerValue.has(item.value)).map(item => item.title);
        })
        .reduce((acc, val) => acc.concat(val));
    }

    return items.filter(item => innerValue.has(item.value)).map(item => item.title);
  }

  static getSingleSelectedItem(items, innerValue) {
    const isItemsGrouped = YCSelect.isItemsGrouped(items);

    if (isItemsGrouped) {
      const filteredList = items
        .map(({ items: groupedItems }) => groupedItems.find(item => innerValue.has(item.value)))
        .filter(Boolean);

      return filteredList[0];
    }

    return items.find(item => innerValue.has(item.value));
  }

  static isItemsGrouped(items = []) {
    if (!items.length) {
      return false;
    }

    return items[0].hasOwnProperty('groupTitle');
  }

  constructor(props) {
    super(props);

    const { type, value, showItemIcon, getItems } = this.props;

    this.controlRef = React.createRef();
    this.searchRef = React.createRef();

    let items = [];
    let titles = [];
    let isInitPending = false;
    let innerValue = new Set();
    let singleSelectItem;

    if (getItems && value) {
      isInitPending = true;
      innerValue = YCSelect.getInnerValue(value);
    } else if (!getItems) {
      items = this.props.items;
      innerValue = YCSelect.getInnerValue(value);
      titles = YCSelect.getTitles(items, innerValue);
    }

    if (type === SelectTypes.Single && showItemIcon) {
      singleSelectItem = YCSelect.getSingleSelectedItem(items, innerValue);
    }

    this.state = {
      items,
      titles,
      innerValue,
      isInitPending,
      singleSelectItem,
      prevPropsItems: items,
      prevPropsValue: value,
      // элементы, показанные в текущем состоянии селекта
      shownItems: items,
      // элементы в попапе с выбранными элементами
      selectedPopupItems: [],
      inputValue: '',
      showMainPopup: false,
      showSelectedPopup: false,
      isFetchingItems: false,
      // не рендерим попапы до первого клика на контрол
      isControlClicked: false,
      isItemsGrouped: YCSelect.isItemsGrouped(items),
    };
  }

  componentDidMount() {
    const controlNode = this.controlRef.current;

    // setState нужен для корректного определения ширины контрола
    this.timeout = setTimeout(() => {
      this.setState({
        controlWidth: controlNode.getBoundingClientRect().width,
      });
    }, 0);

    if (this.state.isInitPending) {
      this._initItems();
    }
  }

  componentDidUpdate() {
    const { controlWidth: controlWidthProps, showSearch } = this.props;
    const { controlWidth: controlWidthState } = this.state;
    const controlNode = this.controlRef.current;

    // возвращаем фокус в инпут поиска
    if (this.searchRef.current && showSearch) {
      this.searchRef.current.focusInput();
    }

    if (controlWidthProps) {
      return;
    }

    const currentControlWidth = controlNode && controlNode.getBoundingClientRect().width;

    if (!currentControlWidth && currentControlWidth !== controlWidthState) {
      this.setState({ controlWidth: currentControlWidth });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  // выбор элемента для 'single' селекта
  selectItem = item => {
    const { allowEmptyValue } = this.props;
    const prevInnerValue = new Set(this.state.innerValue);
    const innerValue = allowEmptyValue && prevInnerValue.has(item.value) ? new Set() : new Set([item.value]);

    this.setState(
      {
        innerValue,
        showMainPopup: false,
      },
      this._onChange,
    );
  };

  // выбор элемента для 'multiply' селекта
  selectItems = item => {
    const { getItems, allowEmptyValue } = this.props;
    const { items } = this.state;
    const innerValue = new Set(this.state.innerValue);

    if (innerValue.has(item.value)) {
      if (allowEmptyValue || innerValue.size > 1) {
        innerValue.delete(item.value);
      }
    } else {
      innerValue.add(item.value);
    }

    const state = {
      innerValue,
      selectedCurrentItem: undefined,
    };

    if (getItems) {
      const allItems = new Set([...items, ...this.state.selectedPopupItems]);
      state.selectItems = [...allItems].filter(item => innerValue.has(item.value));
    }

    this.setState(state, this._beforeOnChange);
  };

  onSingleSearchButtonClick = () => {
    this.setState(
      {
        innerValue: new Set(),
        showMainPopup: false,
      },
      this._onChange,
    );
  };

  onMultipleSearchButtonClick = () => {
    const { getItems } = this.props;
    const { items, shownItems, isItemsGrouped } = this.state;

    const state = {};
    let shownItemsValue;

    if (isItemsGrouped) {
      shownItemsValue = new Set(
        shownItems
          .map(({ items: groupedItems }) => {
            return groupedItems.filter(item => !item.disabled).map(item => item.value);
          })
          .reduce((acc, val) => acc.concat(val)),
      );
    } else {
      shownItemsValue = new Set(shownItems.filter(item => !item.disabled).map(item => item.value));
    }

    let innerValue = new Set([...this.state.innerValue, ...shownItemsValue]);

    if (innerValue.size === this.state.innerValue.size) {
      innerValue = new Set([...this.state.innerValue].filter(innerVal => !shownItemsValue.has(innerVal)));
    }

    state.innerValue = innerValue;

    if (getItems) {
      const allItems = new Set([...items, ...this.state.selectedPopupItems]);
      state.selectItems = [...allItems].filter(item => innerValue.has(item.value));
    }

    this.setState(state, this._beforeOnChange);
  };

  selectOnlyCurrentItem = selectedItem => {
    const { getItems } = this.props;
    const {
      items,
      selectedCurrentItem: { value: prevSelectedItemValue } = {},
      shownItems,
      selectedPopupItems,
      showSelectedPopup,
      isItemsGrouped,
    } = this.state;

    const state = { selectedCurrentItem: undefined };

    if (selectedItem.value === prevSelectedItemValue) {
      // клик по Кроме
      const itemsToFilter = showSelectedPopup ? selectedPopupItems : shownItems;
      let innerValue;

      if (isItemsGrouped) {
        innerValue = new Set(
          itemsToFilter
            .map(({ items: groupedItems }) => {
              return groupedItems.filter(item => !item.disabled).map(item => item.value);
            })
            .reduce((acc, val) => acc.concat(val))
            .filter(value => value !== selectedItem.value),
        );
      } else {
        innerValue = new Set(
          itemsToFilter.filter(item => !item.disabled && item.value !== selectedItem.value).map(item => item.value),
        );
      }

      state.innerValue = innerValue;

      if (getItems) {
        const allItems = new Set([...items, ...this.state.selectedPopupItems]);
        state.selectItems = [...allItems].filter(item => innerValue.has(item.value));
      }
    } else {
      // клик по Только
      state.innerValue = new Set([selectedItem.value]);
      state.selectedCurrentItem = selectedItem;

      if (getItems) {
        state.selectItems = [selectedItem];
      }
    }

    this.setState(state, this._beforeOnChange);
  };

  addNewItem = async inputValue => {
    const { getItems, addItem } = this.props;

    await addItem(inputValue);

    if (getItems) {
      this._onInputChangeDynamic(inputValue);
    } else {
      this._onInputChangeStatic(inputValue);
    }
  };

  setPopupWidth = width => {
    this.setState({ popupWidth: width });
  };

  _initItems = async () => {
    const { innerValue } = this.state;
    const fetchData = await this.props.getItems({
      exactKeys: [...innerValue.values()],
    });
    const { items } = fetchData;

    this.setState({
      items,
      shownItems: items,
      selectItems: items,
      titles: YCSelect.getTitles(items, innerValue),
      isInitPending: false,
    });
  };

  _fetchItems = async () => {
    const { getItems, itemsPageSize } = this.props;
    const { inputValue, nextPageToken, selectItems = [] } = this.state;

    const fetchData = await getItems({
      searchPattern: inputValue,
      itemsPageSize,
      nextPageToken,
    });

    const items = nextPageToken ? this.state.items.concat(fetchData.items) : fetchData.items;

    this.setState({
      items: selectItems.concat(items),
      shownItems: items,
      nextPageToken: fetchData.nextPageToken,
      isFetchingItems: false,
    });
  };

  _getSearchButtonSettings() {
    const { type, allowEmptyValue } = this.props;
    const { shownItems = [], isItemsGrouped } = this.state;

    const settings = {
      isCleaning: true,
      visible: true,
    };

    if (type === SelectTypes.Single) {
      settings.visible = Boolean(this.state.innerValue.size && allowEmptyValue);

      return settings;
    }

    if (!shownItems.length) {
      settings.visible = false;

      return settings;
    }

    let shownItemsValue;

    if (isItemsGrouped) {
      shownItemsValue = new Set(
        shownItems
          .map(({ items: groupedItems }) => {
            return groupedItems.filter(item => !item.disabled).map(item => item.value);
          })
          .reduce((acc, val) => acc.concat(val)),
      );
    } else {
      shownItemsValue = new Set(shownItems.filter(item => !item.disabled).map(item => item.value));
    }

    const innerValue = new Set([...this.state.innerValue, ...shownItemsValue]);

    settings.isCleaning = innerValue.size === this.state.innerValue.size;

    return settings;
  }

  // обработчик для поиска элементов в статичном режиме (когда все элементы переданы)
  _onInputChangeStatic = inputValue => {
    const { items, isItemsGrouped } = this.state;

    let shownItems;

    if (inputValue) {
      const regExp = new RegExp(inputValue, 'i');

      if (isItemsGrouped) {
        shownItems = items.map(group => {
          const groupItems = group.items.filter(item => regExp.test(item.title));
          return {
            groupTitle: group.groupTitle,
            items: groupItems,
          };
        });
      } else {
        shownItems = items.filter(item => regExp.test(item.title));
      }
    } else {
      shownItems = [...items];
    }

    const state = {
      shownItems,
      inputValue,
    };

    this.setState(state);
  };

  // обработчик для поиска элементов в динамическом режиме (когда элементы резолвятся из функции this.props.getItem)
  _onInputChangeDynamic = async inputValue => {
    if (!inputValue) {
      this.setState({
        items: [],
        shownItems: [],
        inputValue: '',
      });

      return;
    }

    const { nextPageToken } = this.state;

    this.setState(
      {
        inputValue,
        prevInputValue: this.state.inputValue,
        nextPageToken: inputValue === this.state.inputValue ? nextPageToken : undefined,
        isFetchingItems: true,
      },
      () => {
        if (this.debouncedFetchItems) {
          this.debouncedFetchItems.cancel();
        }

        this.debouncedFetchItems = _debounce(this._fetchItems, DEBOUNCE_DELAY);
        this.debouncedFetchItems();
      },
    );
  };

  _onBadgeClick = e => {
    const { getItems } = this.props;
    const { items, innerValue, showSelectedPopup, selectItems, showMainPopup, isItemsGrouped } = this.state;

    e.stopPropagation();

    const state = {
      showSelectedPopup: !showSelectedPopup,
      showMainPopup: showMainPopup && !showMainPopup,
      isControlClicked: true,
    };

    if (getItems) {
      state.selectedPopupItems = [...selectItems];
    } else if (isItemsGrouped) {
      state.selectedPopupItems = items.map(group => {
        const groupItems = group.items.filter(item => innerValue.has(item.value));
        return {
          groupTitle: group.groupTitle,
          items: groupItems,
        };
      });
    } else {
      state.selectedPopupItems = items.filter(item => innerValue.has(item.value));
    }

    this.setState(state);
  };

  _onControlClick = () => {
    const { showMainPopup, isControlClicked } = this.state;

    const state = {
      showMainPopup: !showMainPopup,
      showSelectedPopup: false,
    };

    if (!isControlClicked) {
      state.isControlClicked = true;
    }

    this.setState(state);
  };

  _onApplyClick = () => {
    this._onChange();
    this.setState({ showMainPopup: false });
  };

  _beforeOnChange() {
    const { showApply } = this.props;
    const { items, innerValue } = this.state;

    if (showApply) {
      this.setState({
        titles: YCSelect.getTitles(items, innerValue),
      });
    } else {
      this._onChange();
    }
  }

  _onChange = () => {
    const { type, onChange } = this.props;
    const { innerValue } = this.state;
    const values = [...innerValue];
    let output;

    if (type === SelectTypes.Single) {
      output = values[0] ? values[0] : null;
    } else {
      output = values;
    }

    onChange(output);
  };

  _onOutsideMainPopupClick = () => {
    const { showApply } = this.props;

    this.setState({ showMainPopup: false });

    if (showApply) {
      this._onChange();
    }
  };

  _onOutsideSelectedItemsPopupClick = () => {
    const { showApply } = this.props;

    this.setState({ showSelectedPopup: false });

    if (showApply) {
      this._onChange();
    }
  };

  _renderTokens() {
    const { placeholder } = this.props;
    const { titles, isInitPending } = this.state;
    let placeholderIcon;
    let placeholderText;

    if (placeholder && typeof placeholder === 'object') {
      placeholderIcon = placeholder.icon;
      placeholderText = placeholder.text;
    } else if (placeholder) {
      placeholderText = placeholder;
    }

    placeholderText = isInitPending ? YCSelect.INIT_ITEMS_PLACEHOLDER : placeholderText || EMPTY_VALUE;

    return (
      <div className={bControl('tokens')}>
        {placeholderIcon && !titles.length && <div className={bControl('placeholder-icon')}>{placeholderIcon}</div>}
        <span className={bControl('tokens-text')}>{titles.length ? titles.join(', ') : placeholderText}</span>
      </div>
    );
  }

  _renderControl() {
    const { controlWidth, size, type, cls, label, showArrow, showItemIcon, stretched, disabled } = this.props;

    const { showMainPopup, showSelectedPopup, innerValue, isInitPending, singleSelectItem: { icon } = {} } = this.state;

    const controlMods = {
      size: size,
      focused: showMainPopup || showSelectedPopup,
      stretched: stretched,
      disabled: disabled || isInitPending,
    };

    const badgeMods = {
      clicked: showSelectedPopup,
      'without-arrow': !showArrow,
    };

    const isMultiply = type === SelectTypes.Multiple;

    const controlStyles = {};

    if (controlWidth) {
      controlStyles.width = controlWidth;
    }

    return (
      <div
        ref={this.controlRef}
        className={cls ? bControl(controlMods, cls) : bControl(controlMods)}
        style={controlStyles}
        onClick={this._onControlClick}
      >
        {label && <span className={bControl('label')}>{label}</span>}
        {!isMultiply && showItemIcon && icon && <div className={bControl('selected-item-icon')}>{icon}</div>}

        {this._renderTokens()}

        {isMultiply && Boolean(innerValue.size) && (
          <div className={bControl('badge', badgeMods)} onClick={isMultiply ? this._onBadgeClick : null}>
            {innerValue.size}
          </div>
        )}
        {showArrow && (
          <div className={bControl('arrow')}>
            <Icon data={arrowIcon} />
          </div>
        )}
      </div>
    );
  }

  _renderApplyButton() {
    const { type, showApply } = this.props;
    const { shownItems, isItemsGrouped } = this.state;
    const isMultiply = type === SelectTypes.Multiple;

    if (!isMultiply || !showApply) {
      return null;
    }

    const isDisabled = isItemsGrouped
      ? shownItems.every(group => group.items && !group.items.length)
      : !shownItems.length;

    return (
      <div className={bAction()}>
        <Button
          style={{ width: '100%' }}
          theme="action"
          size="n"
          view="default"
          tone="default"
          text={trans('apply_button_text')}
          onClick={this._onApplyClick}
          disabled={isDisabled}
        />
      </div>
    );
  }

  render() {
    const {
      popupCls,
      controlWidth,
      virtualizeThreshold,
      type,
      showSearch,
      showApply,
      showItemIcon,
      showItemMeta,
      hiding,
      getItems,
      addItem,
    } = this.props;

    const {
      shownItems = [],
      showMainPopup,
      showSelectedPopup,
      selectedPopupItems,
      selectedCurrentItem,
      inputValue,
      isFetchingItems,
      isControlClicked,
      isItemsGrouped,
      innerValue,
      nextPageToken,
    } = this.state;

    const isMultiply = type === SelectTypes.Multiple;
    const selectItemHandler = isMultiply ? this.selectItems : this.selectItem;
    const inputChangeHandler = getItems ? this._onInputChangeDynamic : this._onInputChangeStatic;

    const popupStyles = { minWidth: controlWidth || this.state.controlWidth };
    let searchWidth;

    if (this.state.popupWidth) {
      popupStyles.width = this.state.popupWidth;
      searchWidth = this.state.popupWidth;
    } else {
      searchWidth = this.state.popupWidth > this.state.controlWidth ? this.state.popupWidth : this.state.controlWidth;
    }

    if (getItems || shownItems.length > virtualizeThreshold) {
      popupStyles.width = this.props.popupWidth || controlWidth || this.state.controlWidth;
    }

    return (
      <React.Fragment>
        {this._renderControl()}
        {/* Main popup*/
        isControlClicked && (
          <Popup
            cls={
              popupCls
                ? bPopup({ search: showSearch, multi: isMultiply }, LEGO_POPUP_MIX_CLASS + ' ' + popupCls)
                : bPopup({ search: showSearch, multi: isMultiply }, LEGO_POPUP_MIX_CLASS)
            }
            style={popupStyles}
            theme="normal"
            visible={showMainPopup}
            anchor={this.controlRef.current}
            directions={AVAILABLE_POPUP_DIRECTIONS}
            onOutsideClick={this._onOutsideMainPopupClick}
            hiding={hiding}
          >
            {showSearch && (
              <Search
                ref={this.searchRef}
                value={inputValue}
                width={this.props.popupWidth || searchWidth}
                minWidth={controlWidth || this.state.controlWidth}
                searchButtonSettings={this._getSearchButtonSettings()}
                onInputChange={inputChangeHandler}
                selectAllItems={isMultiply ? this.onMultipleSearchButtonClick : this.onSingleSearchButtonClick}
              />
            )}
            <Items
              controlWidth={this.props.popupWidth || controlWidth}
              virtualizeThreshold={virtualizeThreshold}
              items={shownItems}
              selectedCurrentItem={selectedCurrentItem}
              inputValue={inputValue}
              selectType={type}
              showSearch={showSearch}
              showApply={showApply}
              showItemIcon={showItemIcon}
              showItemMeta={showItemMeta}
              onItemClick={selectItemHandler}
              showMoreLinkVisible={Boolean(nextPageToken)}
              isDynamic={Boolean(getItems)}
              isFetchingItems={isFetchingItems}
              isItemsGrouped={isItemsGrouped}
              selectOnlyCurrentItem={this.selectOnlyCurrentItem}
              showMoreItems={this._fetchItems}
              addNewItem={addItem ? this.addNewItem : undefined}
              setPopupWidth={this.setPopupWidth}
              innerValue={innerValue}
            />
            {this._renderApplyButton()}
          </Popup>
        )}
        {/* Selected items popup*/
        isControlClicked && (
          <Popup
            cls={
              popupCls
                ? bPopup({ search: showSearch, multi: isMultiply }, LEGO_POPUP_MIX_CLASS + ' ' + popupCls)
                : bPopup({ search: showSearch, multi: isMultiply }, LEGO_POPUP_MIX_CLASS)
            }
            style={popupStyles}
            theme="normal"
            visible={showSelectedPopup}
            anchor={this.controlRef.current}
            directions={AVAILABLE_POPUP_DIRECTIONS}
            onOutsideClick={this._onOutsideSelectedItemsPopupClick}
            hiding={hiding}
          >
            <div className={bPopup('select-title')}>{'Выбрано'}</div>
            <Items
              controlWidth={this.props.popupWidth || controlWidth}
              virtualizeThreshold={virtualizeThreshold}
              items={selectedPopupItems}
              selectedCurrentItem={selectedCurrentItem}
              inputValue={inputValue}
              selectType={type}
              showSearch={showSearch}
              showApply={showApply}
              showItemIcon={showItemIcon}
              showItemMeta={showItemMeta}
              onItemClick={selectItemHandler}
              isItemsGrouped={isItemsGrouped}
              selectOnlyCurrentItem={this.selectOnlyCurrentItem}
              setPopupWidth={this.setPopupWidth}
              innerValue={innerValue}
              selectedItemsPopup
            />
            {this._renderApplyButton()}
          </Popup>
        )}
      </React.Fragment>
    );
  }
}
