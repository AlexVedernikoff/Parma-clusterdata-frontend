import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

// TODO: изменить импорт на `@clustrum-lib`
import { Widget } from '@clustrum-lib/shared/ui/widgets-factory/widget';

import ChartsModule from '@kamatech-data-ui/chartkit/lib/modules/charts/charts';
import ErrorDispatcher from '@kamatech-data-ui/chartkit/lib/modules/error-dispatcher/error-dispatcher';
import { getParamsValue } from '@clustrum-lib';
// TODO: Перечисление WIZARD_NODE_TYPE фактически дублирует перечисление WidgetType
// Нужно рассмотреть возможность использования только второго
import { WIZARD_NODE_TYPE } from '../../../../constants/constants';

export class Charts extends React.PureComponent {
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
    onStateAndParamsChange: PropTypes.func,
    paginateInfo: PropTypes.object,
    orderBy: PropTypes.object,
    onOrderByClickInWizard: PropTypes.func,
    widgetType: PropTypes.string,
    ownWidgetParams: PropTypes.instanceOf(Map),
    refWidget: PropTypes.object,
  };

  _isMounted = null;

  state = {
    loadedData: null,
  };

  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  componentDidMount() {
    this._isMounted = true;
    this.run();
  }

  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  componentDidUpdate(prevProps) {
    const {
      id,
      source,
      params,
      forceUpdate,
      editMode,
      paginateInfo,
      orderBy,
    } = this.props;
    /**
     * todo в родительском компоненте уже происходит проверка на обновление
     * это сделано потому что размазали логику по нескольким компонентам (Charts и Charkit) - хорошо бы структурировать
     */
    // === из-за того, что componentDidUpdate происходит на this.setState
    if (
      (!forceUpdate || forceUpdate === prevProps.forceUpdate) &&
      prevProps.id === id &&
      prevProps.source === source &&
      isEqual(getParamsValue(prevProps.params), getParamsValue(params)) &&
      isEqual(prevProps.editMode, editMode) &&
      isEqual(prevProps.paginateInfo, paginateInfo) &&
      isEqual(prevProps.orderBy, orderBy)
    ) {
      return;
    }

    this.run();
  }

  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  componentDidCatch(error) {
    this.onError({ error });
  }

  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   * todo: onLoad вызывается дочерними виджетами (графики, таблицы, карты) после того как они монтируются/обновляются
   * нужно вызывать onLoad после того как закончится выполняться запрос (метод run)
   * + подумать как убрать из Charkit логику с loading (по идее зона ответственности загрузки это Charts). Учесть чтобы не сломались контролы
   */
  /* eslint-disable react/destructuring-assignment */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  onLoad = () => this.props.onLoad({ loadedData: this.state.loadedData });

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
      if (editMode?.type === WIZARD_NODE_TYPE.MAP || widgetType === 'map') {
        // ? Вынести в функцию?
        const mapLoadedData = {
          widgetType: 'map',
          params: params,
          data: {
            shared:
              editMode.config && editMode.config.shared ? editMode.config.shared : {},
            geoJson: {
              coordType: editMode.config.shared.coordType,
              titleLayerSource: editMode.config.shared.titleLayerSource,
              widgetType: editMode.config.shared.visualization.id,
            },
          },
        };
        this.setState({ loadedData: mapLoadedData });
        return;
      }

      if (this.props.editMode?.type === WIZARD_NODE_TYPE.TABLE) {
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
    if (!loadedData) {
      return null;
    }

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
      refWidget,
    } = this.props;

    return editMode?.type === WIZARD_NODE_TYPE.MAP ? (
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
        refWidget={refWidget}
      />
    ) : (
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
        refWidget={refWidget}
      />
    );
  }
}
