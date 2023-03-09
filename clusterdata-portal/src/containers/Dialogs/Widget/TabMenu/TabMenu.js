import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

import {Icon} from '@parma-data-ui/common/src';

import iconStar from '@parma-data-ui/clusterdata/src/icons/star.svg';
import iconPreviewClose from '@parma-data-ui/clusterdata/src/icons/preview-close.svg';
import iconPlus from '@parma-data-ui/clusterdata/src/icons/plus.svg';

import {i18n} from '@parma-data-ui/clusterdata';

// import './TabMenu.scss';

const b = block('tab-menu');

export default class TabMenu extends React.PureComponent {
    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.object),
        itemChosen: PropTypes.number,
        itemDefault: PropTypes.number,
        update: PropTypes.func
    };

    onAction = ({action, index}) => event => {
        event.stopPropagation();
        const data = this[`${action}`]({index});
        if (data) {
            this.props.update(data);
        }
    };

    tabText(index = this.props.items.length) {
        return i18n('dash.widget-dialog.edit', 'value_title-default', {index: index + 1});
    }

    add() {
        const items = [...this.props.items, {
            data: {},
            title: this.tabText()
        }];
        const len = this.props.items.length;
        return {
            items,
            itemChosen: len ? this.props.itemChosen : 0,
            itemDefault: len ? this.props.itemDefault : 0
        };
    }

    changeDefault({index}) {
        if (this.props.itemDefault === index) {
            return;
        }
        const items = [...this.props.items];
        return {
            items,
            itemChosen: this.props.itemChosen,
            itemDefault: index
        };
    }

    changeChosen({index}) {
        const {itemChosen} = this.props;
        if (itemChosen === index) {
            return;
        }
        let items = this.props.items;
        if (items[itemChosen].title.trim() === '') {
            items = items.map((item, i) => {
                if (i === itemChosen) {
                    return {...item, title: this.tabText(itemChosen)};
                }
                return item;
            });
        }
        return {
            items,
            itemChosen: index,
            itemDefault: this.props.itemDefault
        };
    }

    delete({index}) {
        const {itemDefault} = this.props;
        const items = this.props.items.filter((_, itemIndex) => index !== itemIndex);
        const isDeleteItemDefault = itemDefault === index;
        const len = items.length;
        return {
            items,
            itemChosen: len ? 0 : null,
            itemDefault: len
                ? isDeleteItemDefault
                    ? 0 : (itemDefault < index ? itemDefault : itemDefault - 1)
                : null
        };
    }

    render() {
        const {items, itemChosen, itemDefault} = this.props;
        return (
            <div className={b()}>
                {
                    items.map(({title}, index) => (
                        <div
                            className={b('item', {chosen: index === itemChosen})}
                            onClick={this.onAction({action: 'changeChosen', index})}
                            key={index}
                        >
                            {/*<div*/}
                                {/*className={b('item-star', {default: index === itemDefault})}*/}
                                {/*onClick={this.onAction({action: 'changeDefault', index})}*/}
                            {/*>*/}
                                {/*<Icon data={iconStar} width="16px"/>*/}
                            {/*</div>*/}
                            <span className={b('item-text')}>{title}</span>
                            {items.length > 1 ?
                                <div className={b('item-del')} onClick={this.onAction({action: 'delete', index})}>
                                    <Icon data={iconPreviewClose} width="22px"/>
                                </div> :
                                null
                            }
                        </div>
                    ))
                }
                <div className={b('add-tab')} onClick={this.onAction({action: 'add'})}>
                    <Icon className={b('add-tab-icon')} data={iconPlus} width="16px"/>
                    <span>{i18n('dash.widget-dialog.edit', 'button_add', {index: 1})}</span>
                </div>
            </div>
        );
    }
}
