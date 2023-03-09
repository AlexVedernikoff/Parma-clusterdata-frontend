import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import {Icon, YCSelect} from '@parma-data-ui/common/src';
import {getPlaceParameters, getQuickItems} from '../Base/configure';
import {PLACE} from '../constants';
// import './PlaceSelect.scss';


const b = block('yc-navigation-minimal-place-select');

export default class PlaceSelect extends React.PureComponent {
    static propTypes = {
        place: PropTypes.string,
        path: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.string),
        quickItems: PropTypes.arrayOf(PropTypes.string),
        onChange: PropTypes.func
    };

    static getItem({place, text, icon, key, iconClassName}) {
        return {
            key: place || key,
            value: place || key,
            title: text,
            icon: (
                <Icon
                    data={icon}
                    className={iconClassName}
                />
            )
        };
    }

    _getItemsConfig() {
        const {items} = this.props;
        return items.map(item => getPlaceParameters(item))
    }

    _getQuickItemsConfig() {
        const {quickItems} = this.props;
        const config = getQuickItems();
        return quickItems.map(key => config.find(itemConfig => itemConfig.key === key));
    }

    _getFullConfig() {
        const {quickItems} = this.props;
        const itemsConfig = this._getItemsConfig();
        return quickItems ? itemsConfig.concat(this._getQuickItemsConfig()) : itemsConfig;
    }

    _getQuickItem() {
        const {path, quickItems} = this.props;

        if (!quickItems) {
            return null;
        }

        return this._getQuickItemsConfig().find(itemConfig => itemConfig.key === path);
    }

    _getItems() {
        return this._getFullConfig().map(PlaceSelect.getItem);
    }

    _onChange = value => {
        const {key} = this._getFullConfig().find(({place, key}) => place === value || key === value);

        this.props.onChange({
            path: key,
            root: key ? PLACE.ORIGIN_ROOT : value
        });
    };

    render() {
        const {place} = this.props;
        const quickItem = this._getQuickItem();

        return (
            <div className={b()}>
                <YCSelect
                    items={this._getItems()}
                    value={quickItem ? quickItem.key : place}
                    onChange={this._onChange}
                    showSearch={false}
                    showItemIcon
                />
            </div>
        )
    }
}
