import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

export function calcLayout(Component) {
    return class CalcLayout extends React.Component {
        static propTypes = {
            config: PropTypes.object,
            registerManager: PropTypes.object,
            layoutId: PropTypes.string
        };

        static getDerivedStateFromProps(props, state) {
            const {config, registerManager, layoutId} = props;
            if (isEqual(config[layoutId], state.initialLayout)) {
                return null;
            }
            return {
                initialLayout: config[layoutId],
                layout: CalcLayout.visibleLayouts(config, registerManager, layoutId)
            };
        }

        static visibleLayouts(config, registerManager, layoutId) {
            return config[layoutId].map((itemLayout, i) => {
                return this.visibleLayoutOrNull(config, itemLayout, registerManager);
            }).filter(item => item !== null);
        }

        static visibleLayoutOrNull(config, itemLayout, registerManager) {
            const visibleItem = config.items.find(
                item => item.id === itemLayout.i);

            if (this.isItemVisible(visibleItem)) {
                return null;
            }

            const {type} = config.items.find(item => item.id === itemLayout.i);
            return {
                ...registerManager.getItem(type).defaultLayout,
                ...itemLayout,
            };
        }

        static isItemVisible(item) {
            return [null, undefined].includes(item);
        }

        state = {};

        render() {
            return <Component {...this.props} layout={this.state.layout}/>;
        }
    };
}
