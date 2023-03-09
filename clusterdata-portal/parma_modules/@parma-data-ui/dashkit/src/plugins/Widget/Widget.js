import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

const b = block('dashkit-plugin-widget');

class PluginWidget extends React.PureComponent {
    static getDerivedStateFromProps(props, state) {
        const {usedParams} = state;
        if (Array.isArray(usedParams) &&
            !isEqual(
                pick(props.params, usedParams),
                pick(state.params, usedParams)
            ) || usedParams === null && props.params !== state.params // usedParams === null, например, когда NO_DATA
        ) {
            if (props.paginateInfo) {
                return {
                    params: props.params,
                    paginateInfo: props.paginateInfo,
                    orderBy: props.orderBy
                };
            } else {
                return {
                    params: props.params
                }
            }
        }
        else
            if (props.paginateInfo) {
                return {
                    params: props.params,
                    paginateInfo: props.paginateInfo,
                    orderBy: props.orderBy
                }
            }
        return null;
    }

    state = {
        loadedData: null,
        usedParams: null,
        params: this.props.params,
        paginateInfo: this.props.paginateInfo ? this.props.paginateInfo : {page: 0, pageSize: 150},
        orderBy: this.props.orderBy,
    };

    componentDidUpdate(prevProps) {
        const dimensionsChanged = this.props.width !== prevProps.width || this.props.height !== prevProps.height;
        if (dimensionsChanged && this.widget && typeof this.widget.reflow === 'function') {
            this.widget.reflow();
        }
    }

    chartKitRef = React.createRef();

    // public
    getMeta() {
        return new Promise((resolve) => {
            this.resolve = resolve;
            this.resolveMeta(this.state.loadedData);
        });
    }

    reload() {
        this.chartKitRef.current.reload();
    }

    resolveMeta(loadedData) {
        if (this.resolve) {
            this.resolve(this.props.data.map(({id, data: {uuid: entryId}}, index) =>
                index === this.tabIndex && loadedData.data.loadedData ?
                    {
                        id,
                        entryId,
                        usedParams: loadedData.data.loadedData.usedParams ?
                            Object.keys(loadedData.data.loadedData.usedParams) :
                            null,
                        datasetFields: loadedData.data.loadedData.datasetFields,
                        datasetId: loadedData.data.loadedData.datasetId,
                        type: loadedData.data.loadedData.widgetType
                    } :
                    {id, entryId}
            ));
        }
    }

    get tabIndex() {
        const {data} = this.props;
        const {tabId} = this.props.state;
        return tabId ? data.findIndex(({id}) => id === tabId) : 0;
    }

    onLoad = (data) => {
        if (data.data) {
            this.widget = data.data.widget;
        }

        if (window.DL.exportMode && this.widget && typeof this.widget.reflow === 'function') {
            setInterval(() => {
                this.widget.reflow();
            }, 1000)
        }

        if (data.status === 'success') {
            this.setState({usedParams: Object.keys(data.data.loadedData.usedParams || {})});
        }

        this.setState({loadedData: data});

        this.resolveMeta(data);
    };

    onClickTab(index) {
        this.props.onStateAndParamsChange({
            state: {
                tabId: this.props.data[index].id
            }
        });
    }

    render() {
        const {tabIndex} = this;
        const {data, ChartKit, onStateAndParamsChange, widgetMenu, paginateInfo, ownWidgetParams, exportWidget, orderBy} = this.props;
        const {params: dashParams} = this.state;
        const {description} = data[tabIndex];
        const {uuid, params = {}} = data[tabIndex].data;
        return (
            <div className={b()}>
                <div className={b('tabs')}>
                    {data.map(({id, title}, index) => (
                        <div
                            className={b('tab', {active: tabIndex === index})}
                            onClick={() => this.onClickTab(index)}
                            key={id}
                            title={title}
                        >
                            {title.trim() || '\u2014'}
                        </div>
                    ))}
                </div>
                <div className={b('body')}>
                    <ChartKit
                        id={uuid}
                        params={{...params, ...dashParams}}
                        onStateAndParamsChange={onStateAndParamsChange}
                        onLoad={this.onLoad}
                        ref={this.chartKitRef}
                        paginateInfo={paginateInfo}
                        menu={widgetMenu}
                        isDisplayOnlyWithFilter={data[0].isDisplayOnlyWithFilter}
                        ownWidgetParams={ownWidgetParams}
                        orderBy={orderBy}
                        exportWidget = {exportWidget}
                    />
                </div>
                {description &&
                    <div className={b('description')}>
                        {description}
                    </div>
                }
            </div>
        );
    }
}

PluginWidget.propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            title: PropTypes.string,
            data: PropTypes.shape({
                uuid: PropTypes.string.isRequired,
                params: PropTypes.object,
                description: PropTypes.string
            }).isRequired
        }).isRequired
    ).isRequired,
    params: PropTypes.object,
    state: PropTypes.object,
    onStateAndParamsChange: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
    ChartKit: PropTypes.func.isRequired,
    PaginateInfo: PropTypes.object,
    ownWidgetParams: PropTypes.instanceOf(Map),
    exportWidget: PropTypes.func,
    orderBy: PropTypes.object,
};

const plugin = {
    type: 'widget',
    defaultLayout: {w: 12, h: 12},
    bindChartKit(ChartKit) {
        plugin._ChartKit = ChartKit;
        return plugin;
    },
    renderer(props, forwardedRef) {
        if (!plugin._ChartKit) {
            throw new Error('плагину widget нужно установить ChartKit: plugin.bindChartKit(ChartKit)');
        }
        return <PluginWidget {...props} ref={forwardedRef} ChartKit={plugin._ChartKit}/>;
    }
};

export default plugin;
