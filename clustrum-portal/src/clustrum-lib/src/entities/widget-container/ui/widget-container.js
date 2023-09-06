/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/destructuring-assignment */
import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';
import axios from 'axios';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import get from 'lodash/get';

import { getParamsValue } from '@lib-shared/lib/utils';
import Loader from '@kamatech-data-ui/chartkit/lib/components/Loader/Loader';
import Error from '@kamatech-data-ui/chartkit/lib/components/Error/Error';
import { WidgetWithData } from './widget-with-data';
import Menu from '@kamatech-data-ui/chartkit/lib/components/Menu/Menu';

import URI from '@kamatech-data-ui/chartkit/lib/modules/uri/uri';
import settings from '@kamatech-data-ui/chartkit/lib/modules/settings/settings';
import { removeEmptyProperties } from '@kamatech-data-ui/chartkit/lib/helpers/helpers';
import { SIGNAL } from '@kamatech-data-ui/types/signal-types';
import { SignalContext } from '@kamatech-data-ui/context/signal-context';

const b = block('chartkit');

export class WidgetContainer extends React.Component {
  constructor(props) {
    super(props);
    this.resetValue = this.resetValue.bind(this);
    this.state = {
      forceUpdate: false,
      runtimeParams: null,
      paginateInfo: this.props.paginateInfo
        ? this.props.paginateInfo
        : { page: 0, pageSize: 10 },
      orderBy: this.props.orderBy,
    };
  }

  refWidget = createRef();

  static contextType = SignalContext;

  static setSettings(newSettings) {
    settings.set(newSettings);
  }

  static propTypes = {
    id: PropTypes.string,
    source: PropTypes.string,
    params: PropTypes.object,

    theme: PropTypes.string,

    menu: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        icon: PropTypes.element,
        isVisible: PropTypes.func.isRequired,
        action: PropTypes.func.isRequired,
      }),
    ),

    onLoad: PropTypes.func,
    requestIdPrefix: PropTypes.string,
    silentLoading: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    onStateAndParamsChange: PropTypes.func.isRequired,

    editMode: PropTypes.shape({
      config: PropTypes.object.isRequired,
      type: PropTypes.string.isRequired,
    }),
    paginateInfo: PropTypes.object,
    isDisplayOnlyWithFilter: PropTypes.bool,
    ownWidgetParams: PropTypes.instanceOf(Map),

    exportWidget: PropTypes.func,

    orderBy: PropTypes.shape({
      direction: PropTypes.string,
      field: PropTypes.string,
    }),
  };

  static defaultProps = {
    params: {},
  };

  static getDerivedStateFromProps(
    {
      id,
      source: propsSource,
      params: propsParams,
      editMode,
      requestIdPrefix,
      paginateInfo: paginateInfoFromProps,
      orderBy: orderByFromProps,
    },
    {
      prevId,
      prevSource,
      prevParams,
      prevEditMode,
      forceUpdate,
      requestCancelSource,
      paginateInfo: paginateInfoFromState,
      prevPaginateInfo,
      orderBy: orderByFromState,
      prevOrderBy,
      loading,
    },
  ) {
    const sourceURI = new URI(propsSource);

    const source = sourceURI.pathname;
    const params = removeEmptyProperties(
      Object.assign({}, sourceURI.getParams(), propsParams),
    );

    // первое условие срабатывает при изменении параметров визуализации в виджете
    // второе условие: fromProps - при пагинации в дашборде, fromState - при пагинации в виджете
    const paginateInfo =
      prevEditMode !== editMode
        ? editMode.config.shared.paginateInfo
        : paginateInfoFromProps
        ? paginateInfoFromProps
        : paginateInfoFromState;
    const orderBy =
      prevEditMode !== editMode
        ? editMode.config.shared.orderBy
        : orderByFromProps
        ? orderByFromProps
        : orderByFromState;

    if (
      !forceUpdate &&
      id === prevId &&
      source === prevSource &&
      isEqual(getParamsValue(params), getParamsValue(prevParams)) &&
      isEqual(editMode, prevEditMode) &&
      isEqual(paginateInfo, prevPaginateInfo) &&
      isEqual(orderBy, prevOrderBy)
    ) {
      return null;
    }

    if (requestCancelSource && !forceUpdate) {
      requestCancelSource.cancel('CANCEL_REQUESTS');
    }

    const randomString = settings.requestIdGenerator();

    return {
      loading,
      error: false,
      data: null,
      forceUpdate,
      paginateInfo: paginateInfo,
      prevPaginateInfo: paginateInfo,

      prevId: id,
      prevSource: source,
      prevParams: params,
      prevEditMode: editMode,

      orderBy: orderBy,
      prevOrderBy: orderBy,

      requestId: requestIdPrefix ? `${requestIdPrefix}.${randomString}` : randomString,
      requestCancelSource: axios.CancelToken.source(),

      isParamsEqual: isEqual(params, prevParams),
    };
  }

  static getDerivedStateFromError(error) {
    return { loading: false, error: true, data: error };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  componentDidMount() {
    /**
     * todo в идеале хорошо бы отказаться от шины событий - просто диспатчить экшн
     * сделано потому что компоненты-виджеты не хранят свое состояние в редакс
     * + удалить костыль из @kamatech-data-ui\chartkit\lib\components\Widget\Graph\Graph.js где график рисуется каждый раз с нуля
     * + из-за того что значение виджетов не хранятся в стейте, они сбрасываются если переключать табы
     */
    this.context.subscribe(SIGNAL.RESET_FILTERS, this.resetValue);
  }

  componentWillUnmount() {
    this.context.unSubscribe(SIGNAL.RESET_FILTERS, this.resetValue);
    if (this.state.requestCancelSource) {
      this.state.requestCancelSource.cancel('CANCEL_REQUESTS');
    }
  }

  get params() {
    // TODO: костыль, для ситуации, когда параметры обновляются внутренним контролом, а потом снаружи через props
    if (this.state.isParamsEqual) {
      return { ...this.state.prevParams, ...this.state.runtimeParams };
    }
    return { ...this.state.runtimeParams, ...this.state.prevParams };
  }

  get propsData() {
    const { prevId, prevSource, paginateInfo, orderBy } = this.state;
    return {
      id: prevId,
      source: prevSource,
      params: this.params,
      paginateInfo: paginateInfo,
      orderBy: orderBy,
    };
  }

  resetValue() {
    this.reload();
  }

  reload() {
    this.setState({ forceUpdate: true });
  }

  onLoad = data => {
    this.setState({ loading: false, error: false, forceUpdate: false, data });

    if (this.props.onLoad) {
      this.props.onLoad({
        status: 'success',
        requestId: this.state.requestId,
        data: { ...data, propsData: this.propsData },
      });
    }
  };

  onError = data => {
    this.setState({ loading: false, error: true, forceUpdate: false, data });

    if (this.props.onLoad) {
      this.props.onLoad({
        status: 'error',
        requestId: this.state.requestId,
        data: { ...data, propsData: this.propsData },
      });
    }
  };

  onChange = ({ params, state }) =>
    this.setState({
      loading: true,
      error: false,
      runtimeParams: { ...this.state.runtimeParams, ...params },
      ...state,
    });

  onRetry = retryParams =>
    this.onChange({ params: retryParams, state: { forceUpdate: true } });

  onPageControlClick = (page, pageSize) => {
    this.setState({
      paginateInfo: { page: page, pageSize: pageSize },
      forceUpdate: true,
    });
  };

  onOrderByClickInWizard = (direction, field) => {
    this.setState({ orderBy: { direction: direction, field: field }, forceUpdate: true });
  };

  displayOnlyWithFilter = () => {
    this.setState({ loading: false, error: false, forceUpdate: false });
    return (
      <div className={'chartkit__widget_graph chartkit__widget_need-filter'}>
        Для отображения данных, пожалуйста, выберите значение в фильтре
      </div>
    );
  };

  isDisplayOnlyWithFilterAndFiltersIsEmpty = (isDisplayOnlyWithFilter, params) => {
    return (
      isDisplayOnlyWithFilter &&
      Object.values(params).length !== 0 &&
      !Object.values(params).some(item => item.value.length !== 0)
    );
  };

  render() {
    const {
      loading,
      error,
      data,
      forceUpdate,
      prevId,
      prevSource,
      requestId,
      requestCancelSource,
    } = this.state;

    const {
      silentLoading,
      editMode,
      onStateAndParamsChange,
      isDisplayOnlyWithFilter,
      ownWidgetParams,
      exportWidget,
    } = this.props;

    const theme = this.props.theme || settings.theme;
    const menu = this.props.menu || settings.menu;
    const paginateInfo = this.props.paginateInfo
      ? this.props.paginateInfo
      : this.state.paginateInfo;
    const orderBy = this.state.orderBy;
    const widgetType = get(data, 'loadedData.widgetType');

    return (
      <div className={b({ theme })} data-id={prevId || prevSource}>
        {loading && !error ? <Loader silentLoading={silentLoading} /> : null}

        <div
          className={b('widget', {
            hidden: loading && !silentLoading,
            [widgetType]: Boolean(widgetType),
          })}
          ref={this.refWidget}
        >
          {error ? (
            <Error
              isEditMode={Boolean(editMode)}
              data={data}
              retryClick={this.onRetry}
              requestId={requestId}
            />
          ) : this.isDisplayOnlyWithFilterAndFiltersIsEmpty(
              isDisplayOnlyWithFilter,
              this.params,
            ) ? (
            this.displayOnlyWithFilter()
          ) : (
            <WidgetWithData
              id={prevId}
              source={prevSource}
              params={this.params}
              editMode={editMode}
              forceUpdate={forceUpdate}
              requestId={requestId}
              onStateAndParamsChange={onStateAndParamsChange}
              requestCancelToken={requestCancelSource.token}
              onLoad={this.onLoad}
              onError={this.onError}
              onChange={this.onChange}
              onPageControlClick={this.onPageControlClick}
              paginateInfo={paginateInfo}
              widgetType={widgetType}
              ownWidgetParams={ownWidgetParams}
              orderBy={orderBy}
              onOrderByClickInWizard={this.onOrderByClickInWizard}
              refWidget={this.refWidget}
            />
          )}
        </div>

        {menu && (!loading || silentLoading) && (
          <Menu
            items={menu}
            data={{
              ...pick(data, ['loadedData', 'widget', 'widgetData']),
              propsData: this.propsData,
            }}
            runPayload={{
              id: this.props.id,
              path: this.state.prevSource,
              params: getParamsValue(this.props.params),
              pageSize: this.props.paginateInfo && this.props.paginateInfo.pageSize,
              page: this.props.paginateInfo && this.props.paginateInfo.page,
              config: null,
              responseOptions: {
                includeConfig: true,
              },
            }}
            onChange={this.onChange}
            exportWidget={exportWidget}
          />
        )}
      </div>
    );
  }
}
