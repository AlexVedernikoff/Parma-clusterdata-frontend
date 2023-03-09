import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import template from 'es6-template-strings';
import {FixedSizeList as List} from 'react-window';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import {Link, Button} from 'lego-on-react';
import Loader from '../../Loader';
import Item from '../Item/Item';
import trans from '../i18n';
import {SelectTypes} from '../types/SelectTypes';

const b = block('yc-select-items');
const BORDER_WIDTH = 2;
const ITEM_HEIGHT = 28;
const ITEM_WITH_META_HEIGHT = 48;
const MARGIN_OFFSET = 4;

export default class ItemsWrapper extends React.PureComponent {
    static propTypes = {
        controlWidth: PropTypes.number,
        virtualizeThreshold: PropTypes.number,
        items: PropTypes.array,
        inputValue: PropTypes.string,
        isFetchingItems: PropTypes.bool,
        isDynamic: PropTypes.bool,
        isItemsGrouped: PropTypes.bool,
        showMoreLinkVisible: PropTypes.bool,
        showSearch: PropTypes.bool,
        showApply: PropTypes.bool,
        selectedItemsPopup: PropTypes.bool,
        selectType: PropTypes.oneOf([SelectTypes.Single, SelectTypes.Multiple]),
        showMoreItems: PropTypes.func,
        addNewItem: PropTypes.func,
        setPopupWidth: PropTypes.func
    };

    static defaultProps = {
        showMoreLinkVisible: false
    };

    state = {
        isAddingUserItem: false,
        isFetchingItemsByLink: false
    };

    componentDidMount() {
        if (this.ref.current) {
            this.props.setPopupWidth(this.ref.current.getBoundingClientRect().width + BORDER_WIDTH);
        }
    }

    componentDidUpdate(prevProps) {
        const {isFetchingItemsByLink} = this.state;
        const listRef = this.listRef.current;
        const isSelectedItemsChanged = prevProps.innerValue !== this.props.innerValue;

        if (isSelectedItemsChanged && listRef || isFetchingItemsByLink && listRef) {
            listRef.forceUpdate();
        }
    }

    ref = React.createRef();

    listRef = React.createRef();

    _addUserItem = async () => {
        const {inputValue, addNewItem} = this.props;
        this.setState({isAddingUserItem: true});
        await addNewItem(inputValue);
        this.setState({isAddingUserItem: false});
    };

    _onAddButtonClick = e => {
        e.stopPropagation();
        this._addUserItem();
    };

    _onShowMoreLinkClick = async e => {
        const {showMoreItems} = this.props;

        e.stopPropagation();

        this.setState({isFetchingItemsByLink: true});
        await showMoreItems();
        this.setState({isFetchingItemsByLink: false});
    };

    _itemRenderer = ({index, style}) => {
        const {
            items,
            innerValue,
            showMoreLinkVisible
        } = this.props;
        const {isFetchingItemsByLink} = this.state;
        const item = items[index];
        const isSelected = innerValue.has(item && item.value);

        if (index === items.length && showMoreLinkVisible) {
            if (isFetchingItemsByLink) {
                return (
                    <div
                        className={b('loader')}
                        style={style}
                    >
                        <Loader size="s"/>
                    </div>
                );
            }

            return (
                <div
                    className={b('show-more-link')}
                    style={style}
                    onClick={this._onShowMoreLinkClick}
                >
                    <Link
                        theme="ghost"
                        text={trans('items_show_more')}
                    />
                </div>
            );
        }

        return (
            <Item
                {...this.props}
                key={item.key}
                style={style}
                item={item}
                isSelected={isSelected}
            />
        );
    };

    _renderItemsWithoutVirtualized() {
        const {
            items,
            innerValue,
            isItemsGrouped
        } = this.props;

        if (isItemsGrouped) {
            return items.map(item => {
                const {groupTitle, items} = item;

                // при allowEmptyValue: true, когда есть пустой элемент
                if (!groupTitle && !items) {
                    const isSelected = innerValue.has(item.value);
                    return (
                        <Item
                            {...this.props}
                            key={item.key}
                            style={{}}
                            item={item}
                            isSelected={isSelected}
                        />
                    );
                }

                const groupTitleNode = (
                    <div
                        key={groupTitle}
                        className={b('group-title')}
                    >
                        {groupTitle}
                    </div>
                );
                const groupItems = items.map(item => {
                    const isSelected = innerValue.has(item.value);
                    return (
                        <Item
                            {...this.props}
                            key={item.key}
                            style={{}}
                            item={item}
                            isSelected={isSelected}
                        />
                    );
                });

                return groupItems.length ? [groupTitleNode, ...groupItems] : null;
            });
        }

        return items.map(item => {
            const isSelected = innerValue.has(item.value);
            return (
                <Item
                    {...this.props}
                    key={item.key}
                    style={{}}
                    item={item}
                    isSelected={isSelected}
                />
            );
        });
    }

    render() {
        const {
            controlWidth,
            virtualizeThreshold,
            items,
            inputValue,
            showSearch,
            showApply,
            showItemMeta,
            isDynamic,
            showMoreLinkVisible,
            selectedItemsPopup,
            addNewItem,
            isFetchingItems,
            isItemsGrouped,
            selectType
        } = this.props;

        const {isAddingUserItem} = this.state;

        if (isFetchingItems) {
            return (
                <div className={b('loader')}>
                    <Loader size="s"/>
                </div>
            );
        }

        if (isDynamic && !inputValue) {
            return (
                <div className={b('prompt')}>
                    <span>{trans('items_prompt')}</span>
                </div>
            );
        }

        const isNotFound = !items.length || (
            isItemsGrouped && items.every(group => group.items && !group.items.length)
        );

        if (isNotFound) {
            return (
                <div className={b('not-found')}>
                    <span>{template(trans('items_not_found'), {inputValue})}</span>
                    {
                        addNewItem && !isItemsGrouped && (
                            <Button
                                cls={b('add-button')}
                                theme="normal"
                                size="s"
                                view="default"
                                tone="default"
                                text={trans('items_add_new')}
                                onClick={this._onAddButtonClick}
                                disabled={isAddingUserItem}
                            />
                        )
                    }
                </div>
            );
        }

        const wrapperMods = {
            'with-search': !selectedItemsPopup && showSearch,
            'with-selected-title': selectedItemsPopup,
            'with-apply-button': showApply,
            'multiple': selectType === SelectTypes.Multiple,
        };

        if (!isDynamic && items.length < virtualizeThreshold) {
            wrapperMods['without-virtualized'] = true;

            return (
                <div
                    ref={this.ref}
                    className={b(wrapperMods)}
                >
                    {this._renderItemsWithoutVirtualized()}
                </div>
            );
        }

        const itemHeight = showItemMeta ? ITEM_WITH_META_HEIGHT : ITEM_HEIGHT;
        const itemCount = showMoreLinkVisible ? items.length + 1 : items.length;
        const marginOffset = items.length === 1 ? MARGIN_OFFSET * 2 : MARGIN_OFFSET;

        return (
            <div
                className={b(wrapperMods)}
                style={{
                    width: controlWidth,
                    height: itemCount * itemHeight + marginOffset
                }}
            >
                <AutoSizer>
                    {({width, height}) => (
                        <List
                            ref={this.listRef}
                            width={width}
                            height={height}
                            itemSize={itemHeight}
                            itemData={items}
                            itemCount={itemCount}
                            overscanRowCount={10}
                        >
                            {this._itemRenderer}
                        </List>
                    )}
                </AutoSizer>
            </div>

        );
    }
}
