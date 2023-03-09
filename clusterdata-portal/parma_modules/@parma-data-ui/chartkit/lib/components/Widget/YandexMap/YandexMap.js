import React from 'react';
import PropTypes from 'prop-types';

import YandexMapModule from '../../../modules/yandex-map/yandex-map';

// import './YandexMap.scss';

class YandexMap extends React.PureComponent {
    static propTypes = {
        data: PropTypes.shape({
            data: PropTypes.array,
            config: PropTypes.object
        }).isRequired,
        onLoad: PropTypes.func.isRequired,
        onError: PropTypes.func.isRequired
    };

    async componentDidMount() {
        this.props.onLoad();
        try {
            const {data, libraryConfig, config} = this.props.data;
            this._map = await YandexMapModule.draw({
                node: this._node,
                data,
                config: Object.assign({ymap: libraryConfig}, config)
            });
            // this.props.onLoad(); // если тут, то не отрисовывается gridmap
        } catch (error) {
            // TODO: по идее тут должен быть ErrorDispatcher.wrap
            this.props.onError({error});
        }
    }

    componentWillUnmount() {
        this._map.destroy();
    }

    render() {
        return <div className="chartkit-ymap" ref={(node) => { this._node = node; }}/>;
    }
}

export default YandexMap;
