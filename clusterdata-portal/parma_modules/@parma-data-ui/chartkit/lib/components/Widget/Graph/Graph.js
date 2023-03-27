import React from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import getConfig from '../../../modules/graph/graph';
import borderColorByColor from "../../../modules/graph/config/border-color-by-color";
import DateFormat from "../../../modules/date/date-format";
import {FILTER_CONDITION_TYPE} from "../../../../../../../src/constants/FilterConditionType";

class Graph extends React.PureComponent {
    static propTypes = {
        data: PropTypes.object.isRequired,
        onLoad: PropTypes.func.isRequired,
        onError: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        onStateAndParamsChange: PropTypes.func.isRequired
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data === prevState.prevData) {
            return null;
        }
        

        try {
            const {data: {data, libraryConfig, config, comments}} = nextProps;

            const {config: options, callback} =
                getConfig(Object.assign({highcharts: libraryConfig}, config), data, null, comments);

            return {
                prevData: nextProps.data,
                options,
                callback,
                isError: false
            };
        } catch (error) {
            nextProps.onError({error});
            return {isError: true};
        }
    }

    state = {
        prevData: null,
        options: null,
        callback: null,
        isError: false
    };

    componentDidMount() {
        this.onLoad();
    }

    componentDidUpdate() {
        this.onLoad();
    }

    componentDidCatch(error, info) {
        // console.log('Graph', 'componentDidCatch', error);
        this.props.onError({error, widgetData: this.state.options});
    }

    chartComponent = React.createRef();

    onLoad() {
        if (!this.state.isError) {
            if (this.chartComponent.current) {
                const container = this.chartComponent.current.container.current;
                // container.style.height = '100%';
                // container.style.width = '100%';
                container.style.flex = '1';
            }

            const data = {
                widget: this.chartComponent.current ? this.chartComponent.current.chart : null,
                widgetData: this.state.options,
                loadedData: this.state.prevData
            };
            this.state.callback(data.widget);
            this.props.onLoad(data);

            // может вызываться после unmount, поэтому проверям наличие ref
            window.requestAnimationFrame(() =>
                this.chartComponent.current && this.chartComponent.current.chart.reflow()
            );
        }
    }

    onChange(data) {
        let groupField = this.props.data.data.groupField;
        if (groupField) {
            this.props.onStateAndParamsChange({
                params: {
                    [groupField]: this._convertCategoryName(data.point.originalCategory, this.props.data.data.categoriesDataTypeName)
                }
            });
        }
    }

    _convertCategoryName(category, categoriesDataTypeName) {
        if (category === null) {
            return FILTER_CONDITION_TYPE.IS_NULL;
        }

        switch (categoriesDataTypeName) {
            case 'date':
            case 'datetime':
                return new DateFormat(category, categoriesDataTypeName).clickHouseDate();

            default: return category;
        }
    }

    getPointClick() {
        return (data) => {
            let point = data.point;
            const color = data.point.originColor || data.point.color;
            point.series.points.forEach(point => {
                point.update({color: '#B8BEC7', borderColor: undefined, borderWidth: 0, originColor: point.originColor || point.color}, true, false);
            });
            point.update({color: color, borderColor: borderColorByColor(color), borderWidth: 2, originColor: color}, true, false);
        };
    }

    bindChartClick(options) {
        if (!options) {
            return;
        }

        options.plotOptions.series.events.click = (data) => {
            this.onChange(data)
        };

        options.plotOptions.series.point.events.click = this.getPointClick();
    }

    render() {
        const {isError, options} = this.state;
        this.bindChartClick(options);

        // todo костыль для показа - нужно переписать
        if (options && options.xAxis && options.xAxis.categories.length > 50) {
            options.xAxis.labels.rotation = 270;
        }

        if (options && options.xAxis) {
            options.xAxis.categories = this._categoriesByDataFormat(options.xAxis)
        }

        return isError ?
            null :
            <HighchartsReact
                // это сделано для того, чтобы Highcharts не обновлял график, а удалял и рисовал
                // чтобы сбрасывался chart.colorCounter - при изменении состава линий берутся следующие цвета из colors
                // чтобы при обновлении линии с одним значением на null, значение бы действительно менялось на null
                key={Math.random()}
                options={options}
                highcharts={Highcharts}
                constructorType={options.useHighStock ? 'stockChart' : 'chart'}
                ref={this.chartComponent}
            />;
    }

    _categoriesByDataFormat(xAxis) {
        if (!xAxis.categories || !Array.isArray(xAxis.categories)) {
            return '';
        }

        if (!(this.props.data && this.props.data.data && this.props.data.data.categoriesDataTypeName)) {
            return xAxis.categories;
        }

        return xAxis.categories.map (category =>
            this._categoryByDataFormat(category, this.props.data.data.categoriesDataTypeName));
    }

    _categoryByDataFormat(category, categoriesDataTypeName) {
        switch (categoriesDataTypeName) {
            case 'date':
            case 'datetime':
                return new DateFormat(category, categoriesDataTypeName).date();

            // TODO: скорее всего, надо будет вернуть это обратно.
            //  убрала, чтобы на фронте всегда рисовались только даты, но фильтровалось либо по date, либо по datetime в зависимости от типа данных
            // case 'datetime':
            //     const categoryDateTime = moment(category);
            //     return (
            //         categoryDateTime.isValid()
            //         ? `${categoryDateTime.toDate().toLocaleDateString()} ${categoryDateTime.toDate().toLocaleTimeString()}`
            //         : category)
            default: return category
        }
    }
}

export default Graph;
