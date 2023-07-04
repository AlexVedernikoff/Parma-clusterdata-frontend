import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

// TODO: изменить импорт на `@clustrum-lib`
import { Widget } from '@clustrum-lib/shared/ui/widgets-factory/Widget';

import ChartsModule from '../../modules/charts/charts';
import ErrorDispatcher from '../../modules/error-dispatcher/error-dispatcher';
import { getParamsValue } from '@kamatech-data-ui/utils/param-utils';
import { WIZARD_NODE_TYPE } from '../../../../../../src/constants/constants';

class Charts extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    source: PropTypes.string,
    params: PropTypes.object,
    editMode: PropTypes.object,
    forceUpdate: PropTypes.bool,
    requestId: PropTypes.string,
    requestCancelToken: PropTypes.object,
    onError: PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onPageControlClick: PropTypes.func,
    paginateInfo: PropTypes.object,
    orderBy: PropTypes.object,
    onOrderByClickInWizard: PropTypes.func,
    widgetType: PropTypes.string,
    ownWidgetParams: PropTypes.instanceOf(Map),
  };

  state = {
    loadedData: null,
  };

  componentDidMount() {
    this._isMounted = true;

    this.run();
  }

  componentDidUpdate({
    id,
    source,
    params,
    forceUpdate,
    editMode,
    paginateInfo,
    orderBy,
  }) {
    /**
     * todo в родительском компоненте уже происходит проверка на обновление
     * это сделано потому что размазали логику по нескольким компонентам (Charts и Charkit) - хорошо бы структурировать
     */
    // === из-за того, что componentDidUpdate происходит на this.setState
    if (
      (!this.props.forceUpdate || this.props.forceUpdate === forceUpdate) &&
      id === this.props.id &&
      source === this.props.source &&
      isEqual(getParamsValue(params), getParamsValue(this.props.params)) &&
      isEqual(editMode, this.props.editMode) &&
      isEqual(paginateInfo, this.props.paginateInfo) &&
      isEqual(orderBy, this.props.orderBy)
    ) {
      return;
    }

    this.run();
  }

  componentDidCatch(error, info) {
    this.onError({ error });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _isMounted = null;

  /**
   * todo: onLoad вызывается дочерними виджетами (графики, таблицы, карты) после того как они монтируются/обновляются
   * нужно вызывать onLoad после того как закончится выполняться запрос (метод run)
   * + подумать как убрать из Charkit логику с loading (по идее зона ответственности загрузки это Charts). Учесть чтобы не сломались контролы
   */
  onLoad = data => this.props.onLoad({ ...data, loadedData: this.state.loadedData });

  onError = data => {
    if (ErrorDispatcher.isCustomError(data.error)) {
      // || для случая, когда, например, NO_DATA
      // || undefined для случая UNSUPPORTED_EXTENSION, чтобы не падали isVisible в Items Menu
      this.props.onError({
        ...data,
        loadedData: data.error.extra || this.state.loadedData || undefined,
      });
    } else {
      this.props.onError({ ...data });
    }
  };

  async run() {
    try {
      const {
        id,
        source,
        params,
        editMode,
        requestId,
        requestCancelToken,
        paginateInfo,
        widgetType,
        orderBy,
      } = this.props;
      if (
        (this.props.editMode &&
          this.props.editMode.type &&
          this.props.editMode.type === WIZARD_NODE_TYPE.MAP) ||
        widgetType === 'map'
      ) {
        const mapLoadedData = {
          widgetType: 'map',
          params: params,
          data: {
            shared:
              editMode.config && editMode.config.shared ? editMode.config.shared : {},
            geoJson: {
              coordType: this.props.editMode.config.shared.coordType,
              titleLayerSource: this.props.editMode.config.shared.titleLayerSource,
              widgetType: this.props.editMode.config.shared.visualization.id,
            },
          },
        };
        this.setState({ loadedData: mapLoadedData });
        return;
      }

      if (
        this.props.editMode &&
        this.props.editMode.type &&
        this.props.editMode.type === WIZARD_NODE_TYPE.TABLE
      ) {
        editMode.config.shared.paginateInfo = paginateInfo;
      }

      const loadedData = await ChartsModule.getData({
        id,
        source,
        params: getParamsValue(params),
        editMode,
        paginateInfo,
        headers: { 'X-Request-ID': requestId },
        cancelToken: requestCancelToken,
        orderBy,
      });

      if (this._isMounted) {
        this.setState({ loadedData });
      }
    } catch (error) {
      this.onError({ error });
    }
  }

  render() {
    const { loadedData } = this.state;
    const {
      editMode,
      onStateAndParamsChange,
      onPageControlClick,
      paginateInfo,
      id,
      onChange,
      requestCancelToken,
      ownWidgetParams,
      orderBy,
      onOrderByClickInWizard,
    } = this.props;

    if (editMode && editMode.type && editMode.type === WIZARD_NODE_TYPE.MAP) {
      return loadedData ? (
        <Widget
          data={loadedData}
          onStateAndParamsChange={onStateAndParamsChange}
          chartEditMode={editMode}
          requestCancelToken={requestCancelToken}
          entryId={id}
          onLoad={this.onLoad}
          onError={this.onError}
          onChange={onChange}
          ownWidgetParams={ownWidgetParams}
          orderBy={orderBy}
          onOrderByClickInWizard={onOrderByClickInWizard}
        />
      ) : null;
    }
    return loadedData ? (
      <Widget
        data={loadedData}
        onStateAndParamsChange={onStateAndParamsChange}
        onLoad={this.onLoad}
        onError={this.onError}
        onChange={onChange}
        onPageControlClick={onPageControlClick}
        paginateInfo={paginateInfo}
        ownWidgetParams={ownWidgetParams}
        orderBy={orderBy}
        onOrderByClickInWizard={onOrderByClickInWizard}
      />
    ) : null;
  }
}

export default Charts;
